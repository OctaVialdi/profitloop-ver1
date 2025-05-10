
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
  console.log(`[CALCULATE-PRORATION] ${step}${detailsStr}`);
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

    // Parse request body to get plan IDs
    const body = await req.json();
    const { newPlanId, currentPlanId } = body;
    
    if (!newPlanId || !currentPlanId) throw new Error("Both current and new plan IDs are required");
    logStep("Request body parsed", { newPlanId, currentPlanId });

    // Create Supabase client with service role for administrative operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user's profile and organization
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, organization_id")
      .eq("id", user.id)
      .single();
      
    if (profileError || !profileData?.organization_id) {
      throw new Error("User profile or organization not found");
    }
    
    // Get organization details
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("*, subscription_plans(name, price, stripe_price_id)")
      .eq("id", profileData.organization_id)
      .single();
      
    if (orgError || !orgData) {
      throw new Error("Organization not found");
    }
    
    // Get plan details for current and new plans
    const { data: plans, error: plansError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id, name, price, stripe_price_id")
      .in("id", [currentPlanId, newPlanId]);
      
    if (plansError || !plans || plans.length < 2) {
      throw new Error("Failed to fetch subscription plans");
    }
    
    const currentPlan = plans.find(p => p.id === currentPlanId);
    const newPlan = plans.find(p => p.id === newPlanId);
    
    if (!currentPlan || !newPlan) {
      throw new Error("One or both plans not found");
    }
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Calculate proration
    // If no active subscription, this is just informational
    const subscriptionId = orgData.subscription_id;
    const now = new Date();
    let prorationDate = Math.floor(now.getTime() / 1000);
    
    let daysLeft = 30; // Default for new subscriptions
    let totalDaysInPeriod = 30;
    let amountDue = 0;
    let credit = 0;
    
    if (subscriptionId) {
      try {
        // Get the subscription to calculate days left
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        const currentPeriodEnd = subscription.current_period_end * 1000;
        const currentPeriodStart = subscription.current_period_start * 1000;
        
        totalDaysInPeriod = Math.round((currentPeriodEnd - currentPeriodStart) / (24 * 60 * 60 * 1000));
        daysLeft = Math.max(0, Math.round((currentPeriodEnd - now.getTime()) / (24 * 60 * 60 * 1000)));
        
        // Calculate prorated values if user has an active subscription
        const currentPlanDailyRate = currentPlan.price / totalDaysInPeriod;
        const newPlanDailyRate = newPlan.price / totalDaysInPeriod;
        
        credit = Math.round(currentPlanDailyRate * daysLeft);
        const newCharge = Math.round(newPlanDailyRate * daysLeft);
        
        amountDue = Math.max(0, newCharge - credit);
        
      } catch (error) {
        logStep("Error fetching subscription details, using estimates", { error: error.message });
        // Fallback to estimates if subscription details can't be retrieved
        const currentPrice = currentPlan.price || 0;
        const newPrice = newPlan.price || 0;
        
        // Estimate based on prices in database
        const currentPlanDailyRate = currentPrice / 30;
        const newPlanDailyRate = newPrice / 30;
        
        credit = Math.round(currentPlanDailyRate * 15); // Assume half month left
        const newCharge = Math.round(newPlanDailyRate * 15);
        
        amountDue = Math.max(0, newCharge - credit);
        daysLeft = 15;
      }
    } else {
      // No active subscription, just return the full new plan price
      amountDue = newPlan.price;
      credit = 0;
    }
    
    logStep("Calculated proration", {
      currentPlan: currentPlan.name,
      newPlan: newPlan.name,
      daysLeft,
      totalDaysInPeriod,
      credit,
      amountDue
    });

    return new Response(JSON.stringify({
      prorationDate: new Date(prorationDate * 1000).toISOString(),
      amountDue,
      credit,
      newAmount: newPlan.price,
      daysLeft,
      totalDaysInPeriod,
      currentPlanName: currentPlan.name,
      newPlanName: newPlan.name
    }), {
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
