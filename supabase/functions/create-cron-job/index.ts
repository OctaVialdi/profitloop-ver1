
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }
    
    // Create database client with the service key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Schedule a cron job to run the check-trial-expiration function daily
    const { data, error } = await supabaseAdmin.rpc('cron_schedule', {
      job_name: 'check_trial_expiration_daily',
      schedule: '0 0 * * *', // Every day at midnight
      command: `SELECT net.http_post(
        '${supabaseUrl}/functions/v1/check-trial-expiration',
        '{}',
        'application/json',
        ARRAY[net.http_header('Authorization', 'Bearer ${supabaseServiceKey}')]
      )`
    });

    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Cron job scheduled successfully", data }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    rpc: (functionName: string, params: Record<string, any>) => {
      return fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(params)
      }).then(response => response.json())
        .then(data => ({ data, error: null }))
        .catch(error => ({ data: null, error }));
    }
  };
}
