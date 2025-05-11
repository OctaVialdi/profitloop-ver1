
// NOTE: This file is for reference only and would be implemented in Supabase Edge Functions

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
    const { discountPercent, durationMonths } = await req.json();
    
    // Validate params
    if (!discountPercent || !durationMonths) {
      throw new Error("Missing required parameters");
    }

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
    
    const { stripe_customer_id: customerId, id: organizationId } = orgData;
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
    
    const subscription = subscriptions.data[0];
    
    // Calculate expiration date for the discount (now + durationMonths)
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(now.getMonth() + durationMonths);
    
    // Create a coupon in Stripe
    const coupon = await stripe.coupons.create({
      percent_off: discountPercent,
      duration: 'repeating',
      duration_in_months: durationMonths,
      name: `Retention Offer ${discountPercent}% off for ${durationMonths} months`,
    });
    
    // Apply the coupon to the subscription
    await stripe.subscriptions.update(subscription.id, {
      coupon: coupon.id,
    });
    
    // Record the discount in the database
    await supabaseClient.from('subscription_audit_logs').insert({
      organization_id: organizationId,
      user_id: user.id,
      action: 'discount_applied',
      data: {
        discount_percent: discountPercent,
        duration_months: durationMonths,
        claimed_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true
      }
    });
    
    return new Response(JSON.stringify({ 
      success: true,
      discount: {
        percent: discountPercent,
        durationMonths: durationMonths,
        expiresAt: expiresAt.toISOString()
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in apply-discount:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage, success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
