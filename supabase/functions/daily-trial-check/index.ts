
// This edge function runs daily to check trial expirations and send notifications
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // --- Process trial expirations ---
    console.log("Checking for expired trials...");
    
    // Update organizations where trial has expired
    const { data: expiredOrgs, error: updateError } = await supabase
      .from('organizations')
      .update({ 
        subscription_status: 'expired', 
        trial_expired: true 
      })
      .eq('subscription_status', 'trial')
      .lt('trial_end_date', new Date().toISOString())
      .select('id, name');
      
    if (updateError) {
      console.error("Error updating expired trials:", updateError);
      throw updateError;
    }
    
    console.log(`Updated ${expiredOrgs?.length || 0} organizations with expired trials`);
    
    // --- Create notifications for trials expiring soon ---
    // Find organizations with trials expiring in the next 3 days
    const { data: approachingExpiration, error: approachingError } = await supabase
      .from('organizations')
      .select('id, name, trial_end_date')
      .eq('subscription_status', 'trial')
      .gt('trial_end_date', new Date().toISOString())
      .lt('trial_end_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());
      
    if (approachingError) {
      console.error("Error finding trials approaching expiration:", approachingError);
      throw approachingError;
    }
    
    console.log(`Found ${approachingExpiration?.length || 0} organizations with trials expiring soon`);
    
    // Create notifications for organizations with expiring trials
    const notificationPromises = [];
    
    for (const org of approachingExpiration || []) {
      // Calculate days until expiration
      const daysLeft = Math.ceil((new Date(org.trial_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      // Get admin users to notify
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('organization_id', org.id)
        .in('role', ['super_admin', 'admin']);
        
      if (!admins || admins.length === 0) continue;
      
      // Create notifications for each admin
      for (const admin of admins) {
        // Add to notification table
        const notificationPromise = supabase
          .from('notifications')
          .insert({
            user_id: admin.id,
            organization_id: org.id,
            title: 'Trial Expiring Soon',
            message: `Your trial will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Upgrade now to continue using all features.`,
            type: 'warning',
            action_url: '/settings/subscription'
          });
          
        notificationPromises.push(notificationPromise);
      }
    }
    
    // Wait for all notification insertions to complete
    if (notificationPromises.length > 0) {
      await Promise.all(notificationPromises);
      console.log(`Created ${notificationPromises.length} notifications for trials expiring soon`);
    }
    
    // --- Create entries in audit log ---
    if (expiredOrgs && expiredOrgs.length > 0) {
      for (const org of expiredOrgs) {
        await supabase
          .from('subscription_audit_logs')
          .insert({
            organization_id: org.id,
            action: 'trial_expired',
            data: { 
              organization_name: org.name,
              expired_at: new Date().toISOString()
            }
          });
      }
      
      console.log(`Created ${expiredOrgs.length} audit log entries for expired trials`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        expired_count: expiredOrgs?.length || 0,
        approaching_expiration_count: approachingExpiration?.length || 0
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in daily-trial-check:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString() 
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
