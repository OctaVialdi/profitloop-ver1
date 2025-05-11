
// Edge function for cancelling subscriptions with Stripe

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { reason, feedback } = await req.json();

    // Get Stripe API key from environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get user info from authorization token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get user info
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    
    // Get the organization associated with this user
    const { data: orgData, error: orgError } = await supabaseClient
      .from('organizations')
      .select('id, stripe_customer_id')
      .eq('creator_email', user.email)
      .maybeSingle();
      
    if (orgError || !orgData) {
      throw new Error("Failed to retrieve organization data");
    }
    
    const { stripe_customer_id: customerId } = orgData;
    if (!customerId) {
      throw new Error("No Stripe customer ID found for this organization");
    }
    
    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    
    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription found");
    }
    
    const subscriptionId = subscriptions.data[0].id;
    
    // Cancel the subscription immediately
    await stripe.subscriptions.cancel(subscriptionId, {
      cancellation_details: {
        comment: `Reason: ${reason}${feedback ? ` | Feedback: ${feedback}` : ''}`,
      },
    });
    
    // Update organization subscription status
    await supabaseClient
      .from('organizations')
      .update({
        subscription_status: 'expired',
        subscription_plan_id: null,
      })
      .eq('id', orgData.id);
      
    // Record cancellation reason in the database
    await supabaseClient.from('subscription_audit_logs').insert({
      organization_id: orgData.id,
      user_id: user.id,
      reason,
      feedback: feedback || null,
      action: 'subscription_cancelled',
      data: {
        reason,
        feedback: feedback || null,
      }
    });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in cancel-subscription:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage, success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
