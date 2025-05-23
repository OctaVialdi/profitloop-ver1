
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

    // Get environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("STRIPE_SECRET_KEY missing");
      return new Response(
        JSON.stringify({ 
          error: "STRIPE_SECRET_KEY is not set", 
          message: "Payment provider not properly configured"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      logStep("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Supabase configuration missing" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Create Supabase clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      return new Response(
        JSON.stringify({ error: `Authentication error: ${userError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    if (!userData?.user) {
      return new Response(
        JSON.stringify({ error: "No authenticated user found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });
    
    // Get user's organization ID
    const { data: profileData } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (!profileData?.organization_id) {
      return new Response(
        JSON.stringify({ error: "User has no associated organization" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get organization data
    const { data: orgData } = await supabaseAdmin
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', profileData.organization_id)
      .maybeSingle();
      
    let customerId = null;
    
    // Check if the organization already has a Stripe customer ID
    if (orgData?.stripe_customer_id) {
      customerId = orgData.stripe_customer_id;
      logStep("Found existing Stripe customer ID", { customerId });
    } else {
      // Check if there's a customer with this email
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          
          // Update the organization with the customer ID
          await supabaseAdmin
            .from('organizations')
            .update({ stripe_customer_id: customerId })
            .eq('id', profileData.organization_id);
            
          logStep("Found and saved existing Stripe customer by email", { customerId });
        } else {
          // Create a new customer
          try {
            const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
            const newCustomer = await stripe.customers.create({
              email: user.email,
              name: user.user_metadata?.full_name || user.email,
              metadata: {
                organization_id: profileData.organization_id
              }
            });
            
            customerId = newCustomer.id;
            
            // Update the organization with the customer ID
            await supabaseAdmin
              .from('organizations')
              .update({ stripe_customer_id: customerId })
              .eq('id', profileData.organization_id);
              
            logStep("Created and saved new Stripe customer", { customerId });
          } catch (stripeError) {
            logStep("Error creating Stripe customer", { error: stripeError.message });
            throw new Error(`Failed to create Stripe customer: ${stripeError.message}`);
          }
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            error: "Failed to find or create Stripe customer",
            details: error.message
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "No Stripe customer found or created for this user or organization" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create customer portal session
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Specific return URL to the billing settings page
    const returnUrl = `${origin}/settings/billing`;
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    logStep("Customer portal session created", { 
      sessionId: portalSession.id, 
      url: portalSession.url 
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in customer portal:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
