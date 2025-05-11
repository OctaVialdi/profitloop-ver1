
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create a Supabase client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create a Supabase client for auth
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get user authentication if available
    let isAuthenticated = false;
    let isAdmin = false;
    
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
        
        if (!userError && userData?.user) {
          // Check if user is admin
          const { data: profileData } = await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", userData.user.id)
            .single();
            
          isAuthenticated = true;
          isAdmin = profileData?.role === "super_admin" || profileData?.role === "admin";
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // We continue even if auth check fails
    }
    
    // If this is not a webhook and the user is not authenticated as admin, reject
    if (!req.headers.get("X-Scheduled-Function") && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Only administrators can manually trigger this function." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Call the check-trial-expiration edge function
    const checkExpirationResponse = await fetch(
      `${supabaseUrl}/functions/v1/check-trial-expiration`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    const checkExpirationResult = await checkExpirationResponse.json();
    
    if (!checkExpirationResponse.ok) {
      throw new Error(`Error calling check-trial-expiration: ${JSON.stringify(checkExpirationResult)}`);
    }
    
    console.log("Trial expiration check completed:", checkExpirationResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cron job executed successfully",
        check_result: checkExpirationResult
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Error in cron job:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
