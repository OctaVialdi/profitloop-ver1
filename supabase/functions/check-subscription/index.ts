
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
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body to get organization ID
    const { organizationId } = await req.json();
    
    if (!organizationId) {
      logStep("No organization ID provided, using auth token instead");
      
      // Try to get organization from authenticated user
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("No authorization header provided and no organization ID");
      
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      if (userError) throw new Error(`Authentication error: ${userError.message}`);
      
      const user = userData.user;
      if (!user?.id) throw new Error("User not authenticated");
      
      // Get user's organization
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();
        
      if (profileError || !profileData?.organization_id) {
        throw new Error("User profile or organization not found");
      }
      
      // Use the found organization ID
      const orgId = profileData.organization_id;
      logStep("Found organization ID from auth", { organizationId: orgId });
      
      return await processOrganizationSubscription(orgId, stripeKey, supabaseAdmin, corsHeaders);
    } else {
      logStep("Using provided organization ID", { organizationId });
      return await processOrganizationSubscription(organizationId, stripeKey, supabaseAdmin, corsHeaders);
    }
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

async function processOrganizationSubscription(
  organizationId: string, 
  stripeKey: string, 
  supabaseAdmin: any,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    // Get organization details
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();
      
    if (orgError || !orgData) {
      throw new Error("Organization not found");
    }
    
    logStep("Retrieved organization details", { 
      name: orgData.name, 
      customerId: orgData.stripe_customer_id,
      trialEnd: orgData.trial_end_date,
      subscriptionStatus: orgData.subscription_status
    });

    // Initialize response data with default values
    const responseData = {
      organizationId,
      isTrialActive: false,
      isTrialExpired: false,
      daysLeftInTrial: 0,
      hasPaidSubscription: false,
      subscriptionStatus: orgData.subscription_status || 'trial',
      subscription: null,
      trialEndDate: orgData.trial_end_date,
      updated: false
    };

    // Check Stripe subscription if there's a customer ID
    if (orgData.stripe_customer_id) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
        
        const subscriptions = await stripe.subscriptions.list({
          customer: orgData.stripe_customer_id,
          status: 'active',
          limit: 1,
          expand: ['data.plan.product']
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          responseData.hasPaidSubscription = true;
          responseData.subscription = {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            planName: subscription.items.data[0].plan.nickname || 'Premium'
          };
          
          // Update organization status if needed
          if (orgData.subscription_status !== 'active') {
            await supabaseAdmin
              .from("organizations")
              .update({ 
                subscription_status: 'active',
                trial_expired: false
              })
              .eq("id", organizationId);
            
            responseData.subscriptionStatus = 'active';
            responseData.updated = true;
            logStep("Updated organization to active subscription status");
          }
        }
      } catch (stripeError) {
        logStep("Stripe API error", { message: stripeError.message });
        // Continue with trial status check even if Stripe API fails
      }
    }

    // Check trial status if not on paid subscription
    if (!responseData.hasPaidSubscription) {
      const now = new Date();
      const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
      
      if (trialEndDate) {
        const isExpired = trialEndDate < now;
        responseData.isTrialActive = !isExpired && orgData.subscription_status === 'trial';
        responseData.isTrialExpired = isExpired || orgData.trial_expired;
        
        if (!isExpired) {
          const diffTime = trialEndDate.getTime() - now.getTime();
          responseData.daysLeftInTrial = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Update trial status in database if necessary
        if (isExpired && !orgData.trial_expired) {
          await supabaseAdmin
            .from("organizations")
            .update({ 
              trial_expired: true, 
              subscription_status: 'expired'
            })
            .eq("id", organizationId);
          
          responseData.subscriptionStatus = 'expired';
          responseData.updated = true;
          logStep("Updated organization to expired trial status");
        }
      }
    }

    logStep("Subscription check completed", responseData);
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    logStep("Error in processOrganizationSubscription", { message: error.message });
    throw error;
  }
}
