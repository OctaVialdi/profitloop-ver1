
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-MIDTRANS-CHECKOUT] ${step}${detailsStr}`);
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
      throw new Error("Midtrans configuration is not complete");
    }
    
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

    // Parse request body
    const { planId, successUrl, cancelUrl } = await req.json();
    
    if (!planId) throw new Error("Plan ID is required");
    logStep("Request body parsed", { planId });

    // Create Supabase client with service role for administrative operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the subscription plan details
    const { data: planData, error: planError } = await supabaseAdmin
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single();
      
    if (planError || !planData) {
      throw new Error(`Failed to fetch subscription plan: ${planError?.message || "Plan not found"}`);
    }
    logStep("Retrieved plan details", planData);

    // Get user profile with organization
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, organization_id, full_name")
      .eq("id", user.id)
      .single();
      
    if (profileError || !profileData?.organization_id) {
      throw new Error("User profile or organization not found");
    }
    logStep("Retrieved user profile", { 
      organizationId: profileData.organization_id,
      name: profileData.full_name || user.email
    });

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

    // Calculate actual price based on pricing model
    let actualPrice;
    let priceDescription;
    
    if (planData.price_per_member && planData.price_per_member > 0) {
      // Count active members for per-member pricing
      const { count: memberCount, error: countError } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: 'exact' })
        .eq("organization_id", profileData.organization_id);
        
      if (countError) {
        throw new Error(`Error counting organization members: ${countError.message}`);
      }
      
      const count = memberCount || 1; // Minimum 1 member
      actualPrice = planData.price_per_member * count;
      priceDescription = `${planData.name} (${count} anggota × Rp${planData.price_per_member})`;
    } else {
      actualPrice = planData.price;
      priceDescription = `${planData.name} (Harga tetap)`;
    }
    
    // Generate order ID
    const orderId = `ORDER-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("payment_transactions")
      .insert({
        order_id: orderId,
        user_id: user.id,
        organization_id: profileData.organization_id,
        subscription_plan_id: planData.id,
        amount: actualPrice,
        status: "pending",
        description: priceDescription,
        payment_method: "midtrans",
        gateway_data: {
          customer_name: profileData.full_name || user.email,
          customer_email: user.email
        }
      })
      .select()
      .single();
      
    if (transactionError) {
      throw new Error(`Failed to create payment transaction: ${transactionError.message}`);
    }
    logStep("Created payment transaction", { 
      transactionId: transaction.id, 
      orderId, 
      amount: actualPrice 
    });

    // Encode credentials for Basic Auth
    const encodedAuth = btoa(`${midtransServerKey}:`);
    
    // Construct the Midtrans Snap API payload
    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: actualPrice
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: profileData.full_name || user.email.split("@")[0],
        email: user.email
      },
      callbacks: {
        finish: successUrl || `${req.headers.get("Origin")}/settings/subscription?success=true&order_id=${orderId}`,
        error: cancelUrl || `${req.headers.get("Origin")}/settings/subscription?error=true&order_id=${orderId}`,
        pending: `${req.headers.get("Origin")}/settings/subscription?pending=true&order_id=${orderId}`
      },
      item_details: [
        {
          id: planData.id,
          price: actualPrice,
          quantity: 1,
          name: priceDescription,
          category: "Subscription"
        }
      ],
      expiry: {
        unit: "days",
        duration: 1
      },
      custom_field1: profileData.organization_id,
      custom_field2: planData.id
    };

    // Call Midtrans Snap API to create transaction token
    const snapResponse = await fetch("https://app.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${encodedAuth}`
      },
      body: JSON.stringify(snapPayload)
    });

    const snapData = await snapResponse.json();
    
    if (!snapResponse.ok || !snapData.token) {
      throw new Error(`Failed to create Midtrans transaction: ${JSON.stringify(snapData)}`);
    }
    
    logStep("Created Midtrans transaction", { 
      token: snapData.token,
      redirectUrl: snapData.redirect_url
    });

    // Update transaction with token
    await supabaseAdmin
      .from("payment_transactions")
      .update({
        gateway_data: {
          ...transaction.gateway_data,
          midtrans_token: snapData.token,
          midtrans_redirect_url: snapData.redirect_url
        }
      })
      .eq("id", transaction.id);

    // Return the response with token and redirect URL
    return new Response(JSON.stringify({
      success: true,
      token: snapData.token,
      redirect_url: snapData.redirect_url,
      order_id: orderId,
      client_key: midtransClientKey,
      transaction_id: transaction.id
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
