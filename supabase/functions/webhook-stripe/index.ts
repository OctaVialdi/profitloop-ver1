import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0";

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logEvent = (type: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WEBHOOK-STRIPE] ${type}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe and Supabase
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not set");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables not set");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature || !endpointSecret) {
      throw new Error("Missing signature or endpoint secret");
    }
    
    // Get the raw body
    const body = await req.text();

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      logEvent("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    logEvent("Webhook received", { type: event.type });

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session, supabaseAdmin, stripe);
        break;
      }
      
      case "setup_intent.succeeded": {
        const setupIntent = event.data.object;
        await handleSetupIntentSucceeded(setupIntent, supabaseAdmin, stripe);
        break;
      }
      
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription, supabaseAdmin, stripe);
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription, supabaseAdmin);
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice, supabaseAdmin);
        break;
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(invoice, supabaseAdmin);
        break;
      }
      
      default:
        logEvent(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    logEvent("Error", { message: err.message });
    return new Response(`Webhook error: ${err.message}`, { status: 500 });
  }
});

async function handleCheckoutSessionCompleted(
  session: any, 
  supabaseAdmin: any, 
  stripe: any
): Promise<void> {
  try {
    if (session.mode !== "subscription") return;
    
    const { metadata } = session;
    if (!metadata || !metadata.organization_id) {
      logEvent("No organization ID found in session metadata");
      return;
    }
    
    const organizationId = metadata.organization_id;
    logEvent("Processing completed checkout", { organizationId });
    
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Update organization with subscription details
    await supabaseAdmin
      .from("organizations")
      .update({
        subscription_status: "active",
        trial_expired: false,
        subscription_id: subscription.id,
        plan_id: metadata.plan_id || null,
        subscription_updated_at: new Date().toISOString()
      })
      .eq("id", organizationId);
    
    // Log subscription created in audit log
    await createAuditLog(
      supabaseAdmin,
      organizationId,
      metadata.user_id,
      "subscription_created",
      {
        subscription_id: subscription.id,
        plan_id: metadata.plan_id,
        customer_id: session.customer
      }
    );
    
    // Create notification for organization admins
    await createNotificationForAdmins(
      supabaseAdmin,
      organizationId,
      "Subscription Activated",
      "Your subscription has been successfully activated. You now have full access to all premium features.",
      "success",
      "/settings/subscription"
    );
    
    logEvent("Checkout session completed", { 
      organizationId, 
      subscriptionId: subscription.id 
    });
  } catch (error) {
    logEvent("Error handling checkout completion", { error: error.message });
    throw error;
  }
}

async function handleSetupIntentSucceeded(
  setupIntent: any, 
  supabaseAdmin: any, 
  stripe: any
): Promise<void> {
  try {
    const { metadata } = setupIntent;
    if (!metadata || !metadata.subscription_id || !metadata.current_plan_id || !metadata.new_plan_id) {
      logEvent("No required metadata found in setup intent");
      return;
    }
    
    const subscriptionId = metadata.subscription_id;
    const currentPlanId = metadata.current_plan_id;
    const newPlanId = metadata.new_plan_id;
    const customerId = metadata.customer_id;
    
    logEvent("Processing setup intent for subscription change", { 
      subscriptionId,
      currentPlanId,
      newPlanId
    });
    
    // Get the new plan price ID from the database
    const { data: planData } = await supabaseAdmin
      .from("subscription_plans")
      .select("stripe_price_id")
      .eq("id", newPlanId)
      .single();
      
    if (!planData || !planData.stripe_price_id) {
      logEvent("Could not find stripe price ID for plan", { planId: newPlanId });
      return;
    }
    
    // Update the subscription to use the new price (proration happens automatically)
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      proration_behavior: 'create_prorations',
      items: [{
        id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
        price: planData.stripe_price_id,
      }],
      metadata: {
        previous_plan_id: currentPlanId,
        upgraded_at: new Date().toISOString()
      }
    });
    
    // Find organization with this customer ID
    const { data: orgData } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
      
    if (!orgData) {
      logEvent("No organization found for customer", { customerId });
      return;
    }
    
    const organizationId = orgData.id;
    
    // Update organization with new plan ID
    await supabaseAdmin
      .from("organizations")
      .update({
        subscription_plan_id: newPlanId,
        subscription_status: "active",
        subscription_updated_at: new Date().toISOString()
      })
      .eq("id", organizationId);
    
    // Log plan change in audit log
    await createAuditLog(
      supabaseAdmin,
      organizationId,
      metadata.user_id || null,
      "plan_changed",
      {
        subscription_id: subscriptionId,
        previous_plan_id: currentPlanId,
        new_plan_id: newPlanId,
        proration: true
      }
    );
    
    // Create notification for organization admins
    await createNotificationForAdmins(
      supabaseAdmin,
      organizationId,
      "Paket Berlangganan Diubah",
      "Perubahan paket berlangganan Anda telah berhasil diproses. Penyesuaian biaya prorata telah diterapkan.",
      "success",
      "/settings/subscription"
    );
    
    logEvent("Subscription plan changed successfully", { 
      organizationId, 
      subscriptionId,
      newPlanId
    });
  } catch (error) {
    logEvent("Error handling setup intent", { error: error.message });
    throw error;
  }
}

async function handleSubscriptionChange(
  subscription: any, 
  supabaseAdmin: any, 
  stripe: any
): Promise<void> {
  try {
    const customerId = subscription.customer;
    
    // Find organization with this customer ID
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
      
    if (orgError || !orgData) {
      logEvent("No organization found for customer", { customerId });
      return;
    }
    
    const organizationId = orgData.id;
    
    // Get more details about subscription items and plan
    const subscriptionWithItems = await stripe.subscriptions.retrieve(subscription.id, {
      expand: ['items.data.price.product']
    });
    
    const planName = subscriptionWithItems.items.data[0]?.price?.product?.name || "Premium";
    
    // Update organization with subscription details
    await supabaseAdmin
      .from("organizations")
      .update({
        subscription_status: subscription.status === "active" ? "active" : "trial",
        subscription_id: subscription.id,
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        subscription_updated_at: new Date().toISOString()
      })
      .eq("id", organizationId);
    
    // Log subscription update in audit log
    await createAuditLog(
      supabaseAdmin,
      organizationId,
      null, // We don't have user_id in this context
      "subscription_updated",
      {
        subscription_id: subscription.id,
        status: subscription.status,
        plan_name: planName
      }
    );
    
    logEvent("Subscription updated", { 
      organizationId, 
      subscriptionId: subscription.id,
      status: subscription.status
    });
  } catch (error) {
    logEvent("Error handling subscription change", { error: error.message });
    throw error;
  }
}

async function handleSubscriptionDeleted(
  subscription: any, 
  supabaseAdmin: any
): Promise<void> {
  try {
    const customerId = subscription.customer;
    
    // Find organization with this customer ID
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
      
    if (orgError || !orgData) {
      logEvent("No organization found for customer", { customerId });
      return;
    }
    
    const organizationId = orgData.id;
    
    // Get the basic plan ID
    const { data: basicPlanData, error: planError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id")
      .eq("name", "Basic")
      .single();
      
    if (planError) {
      logEvent("Error getting basic plan", { error: planError.message });
    }
    
    const basicPlanId = basicPlanData?.id;
    
    // Update organization to free tier
    await supabaseAdmin
      .from("organizations")
      .update({
        subscription_status: "expired",
        subscription_id: null,
        plan_id: basicPlanId || null,
        subscription_updated_at: new Date().toISOString()
      })
      .eq("id", organizationId);
    
    // Log subscription cancellation in audit log
    await createAuditLog(
      supabaseAdmin,
      organizationId,
      null,
      "subscription_cancelled",
      {
        subscription_id: subscription.id
      }
    );
    
    // Create notification for organization admins
    await createNotificationForAdmins(
      supabaseAdmin,
      organizationId,
      "Subscription Cancelled",
      "Your subscription has been cancelled. You now have limited access to features.",
      "info",
      "/settings/subscription"
    );
    
    logEvent("Subscription cancelled", { 
      organizationId, 
      subscriptionId: subscription.id 
    });
  } catch (error) {
    logEvent("Error handling subscription deletion", { error: error.message });
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: any, 
  supabaseAdmin: any
): Promise<void> {
  try {
    if (!invoice.subscription) return; // Not subscription-related
    
    const customerId = invoice.customer;
    
    // Find organization with this customer ID
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
      
    if (orgError || !orgData) {
      logEvent("No organization found for customer", { customerId });
      return;
    }
    
    const organizationId = orgData.id;
    
    // Log payment success in audit log
    await createAuditLog(
      supabaseAdmin,
      organizationId,
      null,
      "payment_succeeded",
      {
        invoice_id: invoice.id,
        amount_paid: invoice.amount_paid,
        subscription_id: invoice.subscription
      }
    );
    
    logEvent("Invoice payment succeeded", { 
      organizationId, 
      invoiceId: invoice.id 
    });
  } catch (error) {
    logEvent("Error handling invoice payment success", { error: error.message });
    throw error;
  }
}

async function handleInvoicePaymentFailed(
  invoice: any, 
  supabaseAdmin: any
): Promise<void> {
  try {
    if (!invoice.subscription) return; // Not subscription-related
    
    const customerId = invoice.customer;
    
    // Find organization with this customer ID
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();
      
    if (orgError || !orgData) {
      logEvent("No organization found for customer", { customerId });
      return;
    }
    
    const organizationId = orgData.id;
    
    // Log payment failure in audit log
    await createAuditLog(
      supabaseAdmin,
      organizationId,
      null,
      "payment_failed",
      {
        invoice_id: invoice.id,
        subscription_id: invoice.subscription
      }
    );
    
    // Create notification for organization admins
    await createNotificationForAdmins(
      supabaseAdmin,
      organizationId,
      "Payment Failed",
      "Your subscription payment has failed. Please update your payment method to avoid service interruption.",
      "error",
      "/settings/subscription"
    );
    
    logEvent("Invoice payment failed", { 
      organizationId, 
      invoiceId: invoice.id 
    });
  } catch (error) {
    logEvent("Error handling invoice payment failure", { error: error.message });
    throw error;
  }
}

async function createAuditLog(
  supabaseAdmin: any,
  organizationId: string,
  userId: string | null,
  action: string,
  data: any
): Promise<void> {
  try {
    await supabaseAdmin
      .from("subscription_audit_logs")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        action,
        data
      });
  } catch (error) {
    logEvent("Error creating audit log", { error: error.message });
  }
}

async function createNotificationForAdmins(
  supabaseAdmin: any,
  organizationId: string,
  title: string,
  message: string,
  type: string,
  actionUrl: string
): Promise<void> {
  try {
    // Get all admin users for this organization
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("organization_id", organizationId)
      .in("role", ["super_admin", "admin"]);
      
    if (adminsError || !admins || admins.length === 0) {
      return;
    }
    
    // Create notification for each admin
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      organization_id: organizationId,
      title,
      message,
      type,
      action_url: actionUrl
    }));
    
    await supabaseAdmin
      .from("notifications")
      .insert(notifications);
  } catch (error) {
    logEvent("Error creating admin notifications", { error: error.message });
  }
}
