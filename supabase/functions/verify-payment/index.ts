
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
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create authentication clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // Get user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    if (!userData?.user) throw new Error("No authenticated user found");
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });
    
    // Get the checkout session ID from the request body
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("No session ID provided");
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved checkout session", { 
      sessionId: session.id, 
      status: session.status,
      paymentStatus: session.payment_status
    });
    
    // Get plan ID from metadata or line items
    let planId = null;
    if (session.metadata?.plan_id) {
      planId = session.metadata.plan_id;
    }
    
    // Get organization ID from metadata or user profile
    let organizationId = null;
    if (session.metadata?.organization_id) {
      organizationId = session.metadata.organization_id;
    } else {
      const { data: profileData } = await supabaseAdmin
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .maybeSingle();
      
      if (profileData?.organization_id) {
        organizationId = profileData.organization_id;
      }
    }
    
    // If no organization ID was found, we can't proceed
    if (!organizationId) {
      throw new Error("Could not determine organization ID");
    }
    
    logStep("Identified organization", { organizationId, planId });
    
    // Default response
    const response = {
      success: false,
      status: session.payment_status,
      subscription_tier: null
    };
    
    // If payment was successful, update the organization's subscription
    if (session.payment_status === "paid" || 
        (session.mode === "subscription" && session.status === "complete")) {
      logStep("Payment was successful");
      
      response.success = true;
      
      // Get subscription tier from planId if available
      if (planId) {
        const { data: planData } = await supabaseAdmin
          .from("subscription_plans")
          .select("name")
          .eq("id", planId)
          .maybeSingle();
        
        if (planData) {
          response.subscription_tier = planData.name;
        }
      }
      
      // Update organization's subscription details
      const { error: updateError } = await supabaseAdmin
        .from("organizations")
        .update({
          subscription_status: "active",
          subscription_plan_id: planId,
          trial_expired: false,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string
        })
        .eq("id", organizationId);
      
      if (updateError) {
        logStep("Error updating organization", updateError);
        throw new Error(`Failed to update organization: ${updateError.message}`);
      }
      
      // Create a notification for the user
      await supabaseAdmin
        .from("notifications")
        .insert({
          user_id: user.id,
          organization_id: organizationId,
          title: "Pembayaran Berhasil",
          message: "Langganan Anda telah berhasil diaktifkan.",
          type: "success",
          action_url: "/settings/subscription"
        });
    }
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
    
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in verify-payment:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
