
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This would be called by a cron job to schedule daily trial checks
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Check the authorization header has the correct secret
    const authHeader = req.headers.get("Authorization");
    const expectedHeader = `Bearer ${Deno.env.get("CRON_SECRET")}`;
    
    if (authHeader !== expectedHeader) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized"
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Call the check-trial-expiration function
    const response = await fetch(`${supabaseUrl}/functions/v1/check-trial-expiration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`
      }
    });

    const result = await response.json();

    // Log the scheduled job
    await supabase
      .from("subscription_audit_logs")
      .insert({
        organization_id: null,  // This is a system-wide operation
        action: "trial_check_scheduled",
        data: {
          triggered_at: new Date().toISOString(),
          result: result
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Trial check scheduled successfully",
        result
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error scheduling trial check:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
