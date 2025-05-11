
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WEBHOOK-MIDTRANS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const midtransServerKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    if (!midtransServerKey) throw new Error("MIDTRANS_SERVER_KEY is not set");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client with service role for administrative operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse notification from Midtrans
    const notification = await req.json();
    logStep("Received notification", notification);

    // Extract relevant information
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const transactionId = notification.transaction_id;
    const grossAmount = notification.gross_amount;

    if (!orderId) {
      throw new Error("Missing order_id in notification");
    }

    logStep("Processing notification", { 
      orderId, 
      transactionStatus, 
      fraudStatus 
    });

    // Find the transaction in our database
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("payment_transactions")
      .select("*, subscription_plan:subscription_plans(*)")
      .eq("order_id", orderId)
      .single();

    if (transactionError || !transaction) {
      // If transaction not found, create a log for debugging
      await supabaseAdmin
        .from("payment_notifications")
        .insert({
          order_id: orderId,
          status: "unmatched_order",
          gateway_data: notification
        });
      throw new Error(`Transaction not found for order ID ${orderId}`);
    }
    
    logStep("Found transaction in database", { transactionId: transaction.id });

    // Update transaction status
    let newStatus = "pending";
    let shouldActivateSubscription = false;

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "challenge") {
        // Payment with challenge status
        newStatus = "challenge";
      } else if (fraudStatus === "accept" || !fraudStatus) {
        // Payment success
        newStatus = "success";
        shouldActivateSubscription = true;
      }
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      // Payment failed
      newStatus = "failed";
    } else if (transactionStatus === "pending") {
      // Payment pending
      newStatus = "pending";
    }

    logStep("Determined new status", { newStatus, shouldActivateSubscription });

    // Update transaction in database
    const { error: updateError } = await supabaseAdmin
      .from("payment_transactions")
      .update({
        status: newStatus,
        gateway_reference: transactionId,
        updated_at: new Date().toISOString(),
        gateway_data: {
          ...transaction.gateway_data,
          notification: notification
        }
      })
      .eq("id", transaction.id);

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }
    logStep("Updated transaction status", { status: newStatus });

    // Create a transaction log entry
    await supabaseAdmin
      .from("payment_transaction_logs")
      .insert({
        payment_transaction_id: transaction.id,
        status: newStatus,
        gateway_reference: transactionId,
        amount: grossAmount,
        data: notification
      });

    // If payment is successful, activate subscription
    if (shouldActivateSubscription) {
      // Calculate subscription end date based on plan duration (default to 1 month)
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      // Update organization subscription
      const { error: orgUpdateError } = await supabaseAdmin
        .from("organizations")
        .update({
          subscription_plan_id: transaction.subscription_plan_id,
          subscription_status: "active",
          trial_expired: false,
          subscription_end_date: subscriptionEndDate.toISOString(),
          subscription_id: transaction.id
        })
        .eq("id", transaction.organization_id);

      if (orgUpdateError) {
        throw new Error(`Failed to update organization subscription: ${orgUpdateError.message}`);
      }
      logStep("Activated subscription", { 
        organizationId: transaction.organization_id,
        planId: transaction.subscription_plan_id,
        endDate: subscriptionEndDate.toISOString()
      });

      // Log subscription activation
      await supabaseAdmin
        .from("subscription_audit_logs")
        .insert({
          organization_id: transaction.organization_id,
          action: "subscription_activated",
          user_id: transaction.user_id,
          data: {
            subscription_plan_id: transaction.subscription_plan_id,
            subscription_plan_name: transaction.subscription_plan.name,
            payment_method: "midtrans",
            transaction_id: transaction.id,
            order_id: orderId,
            amount: grossAmount
          }
        });
      
      // Create notifications for all organization admins
      const { data: admins } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("organization_id", transaction.organization_id)
        .in("role", ["super_admin", "admin"]);
        
      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          organization_id: transaction.organization_id,
          title: "Pembayaran Berhasil",
          message: `Pembayaran langganan ${transaction.subscription_plan.name} berhasil diproses. Terima kasih!`,
          type: "success",
          action_url: "/settings/subscription"
        }));
        
        await supabaseAdmin.from("notifications").insert(notifications);
        logStep("Created admin notifications", { count: notifications.length });
      }
    } else if (newStatus === "failed") {
      // Send notification for failed payment
      const { data: admins } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("organization_id", transaction.organization_id)
        .in("role", ["super_admin", "admin"]);
        
      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          organization_id: transaction.organization_id,
          title: "Pembayaran Gagal",
          message: "Terjadi masalah dengan pembayaran langganan Anda. Silahkan coba lagi atau hubungi dukungan.",
          type: "error",
          action_url: "/settings/subscription"
        }));
        
        await supabaseAdmin.from("notifications").insert(notifications);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
