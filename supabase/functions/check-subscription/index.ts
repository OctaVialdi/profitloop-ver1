
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
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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
    logStep("Supabase environment variables verified");

    // Create Supabase clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user's organization ID
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) throw new Error(`Error fetching profile: ${profileError.message}`);
    if (!profileData?.organization_id) throw new Error("User has no associated organization");
    
    const organizationId = profileData.organization_id;
    logStep("Found organization ID", { organizationId });
    
    // Get organization data
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('subscription_status, trial_end_date, trial_start_date, trial_expired, subscription_plan_id, stripe_customer_id, stripe_subscription_id')
      .eq('id', organizationId)
      .maybeSingle();
      
    if (orgError) throw new Error(`Error fetching organization: ${orgError.message}`);
    if (!orgData) throw new Error("Organization not found");
    
    logStep("Retrieved organization data", { 
      subscriptionStatus: orgData.subscription_status,
      trialExpired: orgData.trial_expired,
      planId: orgData.subscription_plan_id
    });
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check subscription status based on organization state
    let subscribed = false;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    
    // If trial is active, return trial status
    if (orgData.subscription_status === 'trial' && !orgData.trial_expired) {
      const now = new Date();
      const trialEndDate = new Date(orgData.trial_end_date);
      
      // Check if trial has expired
      if (trialEndDate < now) {
        // Trial has expired, update organization
        await supabaseAdmin
          .from('organizations')
          .update({ 
            trial_expired: true,
            subscription_status: 'expired'
          })
          .eq('id', organizationId);
          
        logStep("Trial has expired, updated organization status");
        subscribed = false;
      } else {
        // Trial is still active
        subscribed = true;
        subscriptionTier = 'trial';
        subscriptionEnd = orgData.trial_end_date;
        logStep("Trial is active", { trialEnd: subscriptionEnd });
      }
    } 
    // If subscription is active, verify with Stripe
    else if (orgData.subscription_status === 'active') {
      // Check if there's a Stripe customer ID and subscription ID
      if (orgData.stripe_customer_id && orgData.stripe_subscription_id) {
        try {
          // Verify subscription with Stripe
          const subscription = await stripe.subscriptions.retrieve(
            orgData.stripe_subscription_id
          );
          
          logStep("Retrieved Stripe subscription", { 
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
          });
          
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            subscribed = true;
            subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
            
            // Get subscription plan from organization
            if (orgData.subscription_plan_id) {
              const { data: planData } = await supabaseAdmin
                .from('subscription_plans')
                .select('name')
                .eq('id', orgData.subscription_plan_id)
                .maybeSingle();
                
              if (planData) {
                subscriptionTier = planData.name;
              }
            }
          } else {
            // Subscription is not active, update organization
            await supabaseAdmin
              .from('organizations')
              .update({ 
                subscription_status: 'expired'
              })
              .eq('id', organizationId);
              
            logStep("Stripe subscription is not active, updated organization status");
            subscribed = false;
          }
        } catch (error) {
          logStep("Error fetching Stripe subscription", { error });
          // Failed to retrieve subscription, mark as not subscribed
          subscribed = false;
        }
      } else {
        // No Stripe IDs but marked as active, check if there's a plan ID
        if (orgData.subscription_plan_id) {
          // This is a special case, possibly a manually set subscription
          subscribed = true;
          subscriptionTier = 'manual';
          
          // Get subscription plan name
          const { data: planData } = await supabaseAdmin
            .from('subscription_plans')
            .select('name')
            .eq('id', orgData.subscription_plan_id)
            .maybeSingle();
            
          if (planData) {
            subscriptionTier = planData.name;
          }
          
          logStep("Manual subscription is active", { tier: subscriptionTier });
        } else {
          // No valid subscription information
          subscribed = false;
          
          // Update organization status
          await supabaseAdmin
            .from('organizations')
            .update({ subscription_status: 'expired' })
            .eq('id', organizationId);
            
          logStep("No valid subscription found, updated organization status");
        }
      }
    }
    
    // Create final response
    const response = {
      subscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      organization_id: organizationId
    };
    
    logStep("Completed subscription check", response);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in check-subscription:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
