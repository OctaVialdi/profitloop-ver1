
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client with anonymous key for user auth
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body to get plan ID or product information
    const body = await req.json();
    const { planId, currentPlanId, prorate, subscriptionId } = body;
    
    if (!planId) throw new Error("Plan ID is required");
    logStep("Request body parsed", { planId, currentPlanId, prorate, subscriptionId });

    // Create Supabase client with service role for administrative operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the subscription plan details from Supabase
    const { data: planData, error: planError } = await supabaseAdmin
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single();
      
    if (planError || !planData) {
      throw new Error(`Failed to fetch subscription plan: ${planError?.message || "Plan not found"}`);
    }
    logStep("Retrieved plan details", planData);

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if user has a Stripe customer id already
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, organization_id")
      .eq("id", user.id)
      .single();
      
    if (profileError || !profileData?.organization_id) {
      throw new Error("User profile or organization not found");
    }
    logStep("Retrieved user profile", { organizationId: profileData.organization_id });

    // Get organization details
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("id", profileData.organization_id)
      .single();
      
    if (orgError || !orgData) {
      throw new Error("Organization not found");
    }
    logStep("Retrieved organization details", { orgName: orgData.name });

    // Check if the organization already has a Stripe customer ID
    let customerId = null;
    if (orgData.stripe_customer_id) {
      customerId = orgData.stripe_customer_id;
      logStep("Using existing Stripe customer ID", { customerId });
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: orgData.name,
        metadata: {
          organization_id: profileData.organization_id,
          user_id: user.id
        }
      });
      
      customerId = customer.id;
      
      // Update the organization with the Stripe customer ID
      await supabaseAdmin
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", profileData.organization_id);
        
      logStep("Created new Stripe customer", { customerId });
    }

    // Get the Stripe price ID from the plan
    const priceId = planData.stripe_price_id;
    if (!priceId) throw new Error("Plan does not have a valid Stripe price ID");
    
    const origin = req.headers.get("Origin") || "http://localhost:3000";
    
    // Handle proration for plan changes
    if (prorate && currentPlanId && orgData.subscription_id) {
      logStep("Creating prorated checkout for plan change", { 
        currentPlanId, 
        newPlanId: planId,
        subscriptionId: orgData.subscription_id
      });
      
      // For subscription updates, we create a checkout session in 'setup' mode
      // This allows us to collect payment method if needed but doesn't create a new subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: "setup",
        setup_intent_data: {
          metadata: {
            subscription_id: orgData.subscription_id,
            customer_id: customerId,
            current_plan_id: currentPlanId,
            new_plan_id: planId
          }
        },
        success_url: `${origin}/settings/subscription?success=true&proration=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/settings/subscription?canceled=true`,
        metadata: {
          organization_id: profileData.organization_id,
          user_id: user.id,
          plan_id: planId,
          current_plan_id: currentPlanId,
          proration: "true"
        }
      });
      
      logStep("Created prorated checkout session", { sessionId: session.id, url: session.url });
      
      return new Response(JSON.stringify({ sessionUrl: session.url }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // Regular subscription checkout for new subscriptions
      logStep("Creating regular subscription checkout");
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription", 
        success_url: `${origin}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/settings/subscription?canceled=true`,
        metadata: {
          organization_id: profileData.organization_id,
          user_id: user.id,
          plan_id: planId
        }
      });
      
      logStep("Created regular checkout session", { sessionId: session.id, url: session.url });

      return new Response(JSON.stringify({ sessionUrl: session.url }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
