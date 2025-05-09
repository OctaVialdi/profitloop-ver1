
// This edge function is designed to be triggered by cron to regularly check trial statuses

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

Deno.serve(async (req) => {
  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ error: 'Missing service configuration' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Invoke the database function to check trials
    const { data, error } = await supabase.rpc('check_trial_expirations');
    
    if (error) {
      console.error('Error invoking check_trial_expirations:', error);
      throw error;
    }
    
    // Update all organizations where trial has expired but status not yet updated
    const { error: updateError } = await supabase
      .from('organizations')
      .update({ 
        trial_expired: true, 
        subscription_status: 'expired' 
      })
      .eq('subscription_status', 'trial')
      .lt('trial_end_date', new Date().toISOString());

    if (updateError) {
      console.error('Error updating expired trials:', updateError);
      throw updateError;
    }

    // Add a background job to run this automatically every day
    // See: https://supabase.com/docs/guides/database/extensions/pg_cron
    // This would be a database migration that you'd run separately:
    /*
    SELECT cron.schedule(
      'daily-trial-check',
      '0 0 * * *',  -- Run daily at midnight
      $$
      SELECT net.http_post(
        url := 'https://nqbcxrujjxwgoyjxmmla.functions.supabase.co/cron-check-trial-status',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmN4cnVqanh3Z295anhtbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjA3ODAsImV4cCI6MjA2MTU5Njc4MH0.ksytXhQEPyaHVNCmmFd45FgC58Nyn3MOkSdioIqUiwQ"}'::jsonb,
        body := '{}'::jsonb
      );
      $$
    );
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Trial statuses checked and updated successfully',
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in cron-check-trial-status:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString() 
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
