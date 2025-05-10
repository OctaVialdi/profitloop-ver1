
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
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
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
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });
    
    // Get user's organization
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();
      
    if (profileError || !profileData?.organization_id) {
      throw new Error("User profile or organization not found");
    }
    
    const organizationId = profileData.organization_id;
    logStep("Retrieved organization ID", { organizationId });
    
    // Get organization details
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();
      
    if (orgError || !orgData) {
      throw new Error("Organization not found");
    }
    
    if (!orgData.stripe_customer_id) {
      throw new Error("No Stripe customer ID found for this organization");
    }
    
    logStep("Retrieved organization details", { customerId: orgData.stripe_customer_id });
    
    // Initialize Stripe client
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Create customer portal session
    const returnUrl = req.headers.get("Origin") || "http://localhost:3000";
    
    const session = await stripe.billingPortal.sessions.create({
      customer: orgData.stripe_customer_id,
      return_url: `${returnUrl}/settings/subscription`,
    });
    
    logStep("Created customer portal session", { url: session.url });
    
    return new Response(JSON.stringify({ url: session.url }), {
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
