
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-MIDTRANS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const midtransServerKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    const midtransClientKey = Deno.env.get("MIDTRANS_CLIENT_KEY");
    const midtransMerchantId = Deno.env.get("MIDTRANS_MERCHANT_ID");
    
    if (!midtransServerKey || !midtransClientKey || !midtransMerchantId) {
      throw new Error("Midtrans configuration is not set");
    }
    logStep("Midtrans keys verified");

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
    const { planId, amount, name } = body;
    
    if (!planId) throw new Error("Plan ID is required");
    logStep("Request body parsed", { planId, amount, name });

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

    // Check if user has a profile and organization
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

    // Generate a unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a timestamp for 24 hours from now (expiry time)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);
    
    // Set up the payment amount based on plan price
    const paymentAmount = planData.price;
    
    // Encode Midtrans server key to Base64 for Authorization header
    const encodedServerKey = btoa(`${midtransServerKey}:`);
    
    // Create Midtrans transaction
    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: paymentAmount
      },
      item_details: [{
        id: planData.id,
        price: paymentAmount,
        quantity: 1,
        name: `${planData.name} Subscription`,
        brand: "HR System",
        category: "Subscription"
      }],
      customer_details: {
        first_name: user.email.split('@')[0],
        email: user.email,
      },
      enabled_payments: [
        "credit_card", "bca_va", "bni_va", "bri_va", "gopay", "shopeepay", "qris"
      ],
      callbacks: {
        finish: `${req.headers.get("Origin")}/settings/subscription?success=true&order_id=${orderId}`,
        error: `${req.headers.get("Origin")}/settings/subscription?canceled=true`,
        pending: `${req.headers.get("Origin")}/settings/subscription?pending=true&order_id=${orderId}`
      },
      expiry: {
        start_time: new Date().toISOString(),
        unit: "hour",
        duration: 24
      }
    };

    // POST request to Midtrans Snap API
    const midtransResponse = await fetch("https://app.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${encodedServerKey}`
      },
      body: JSON.stringify(transactionDetails)
    });

    if (!midtransResponse.ok) {
      const errorText = await midtransResponse.text();
      throw new Error(`Midtrans API error: ${midtransResponse.status} ${errorText}`);
    }

    const midtransData = await midtransResponse.json();
    logStep("Midtrans transaction created", { 
      token: midtransData.token, 
      redirectUrl: midtransData.redirect_url 
    });
    
    // Store transaction in database with the updated schema
    const { error: transactionError } = await supabaseAdmin
      .from("payment_transactions")
      .insert({
        order_id: orderId,
        organization_id: profileData.organization_id,
        user_id: user.id,
        subscription_plan_id: planData.id,
        payment_gateway: "midtrans",
        amount: paymentAmount,
        currency: "IDR",
        status: "pending",
        gateway_data: midtransData
      });
      
    if (transactionError) {
      logStep("Error storing transaction", transactionError);
      // Continue anyway as this is not critical for user experience
    }

    return new Response(JSON.stringify({ 
      token: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      orderId: orderId
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
