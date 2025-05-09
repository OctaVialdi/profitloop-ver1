
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const cronSecret = Deno.env.get("CRON_SECRET") || "";
    
    // Check for authorization
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.includes(cronSecret) && cronSecret !== "") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Unauthorized request"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
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

    // Get the desired schedule time from request or use default (10:00 AM UTC)
    const requestData = await req.json().catch(() => ({}));
    const scheduleTime = requestData.scheduleTime || "0 10 * * *"; // Default: 10 AM UTC daily
    const scheduleName = requestData.scheduleName || "daily-trial-expiration-check";
    
    // Set up the SQL for creating the schedule
    const setupCronSql = `
      -- Enable required extensions if not already enabled
      CREATE EXTENSION IF NOT EXISTS pg_cron;
      CREATE EXTENSION IF NOT EXISTS pg_net;

      -- Remove any existing schedule with this name
      SELECT cron.unschedule('${scheduleName}');
      
      -- Create a new schedule
      SELECT cron.schedule(
        '${scheduleName}',
        '${scheduleTime}',
        $$
        SELECT net.http_post(
          url:='${supabaseUrl}/functions/v1/check-trial-expiration',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
          body:='{"scheduled": true, "timestamp": "' || now() || '"}'::jsonb
        ) AS request_id;
        $$
      );
    `;

    // Execute the SQL to set up the cron job
    const { error: cronError } = await supabase.rpc('exec_sql', { 
      sql_query: setupCronSql 
    });

    if (cronError) {
      throw new Error(`Failed to set up cron job: ${cronError.message}`);
    }
    
    // Log that we've set up the scheduled job
    await supabase
      .from("subscription_audit_logs")
      .insert({
        organization_id: null,  // System operation
        action: "trial_check_scheduled",
        data: {
          schedule_name: scheduleName,
          schedule_time: scheduleTime,
          set_up_at: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Trial check scheduled successfully",
        schedule: {
          name: scheduleName,
          cron: scheduleTime,
          function: "check-trial-expiration"
        }
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
