
// Edge function to check trial expiration and update status
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    // Initialize Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Starting trial expiration check");

    // Update organizations where trial has expired but not marked as expired
    const { data: expiredOrgs, error: expiredError } = await supabase
      .from('organizations')
      .update({ 
        subscription_status: 'expired',
        trial_expired: true 
      })
      .eq('subscription_status', 'trial')
      .lt('trial_end_date', new Date().toISOString())
      .select('id, name');
    
    if (expiredError) {
      console.error("Error updating expired trials:", expiredError);
      throw expiredError;
    }
    
    console.log(`Updated ${expiredOrgs?.length || 0} expired trials`);
    
    // Create notifications for organizations approaching expiration (3 days)
    const { data: approachingOrgs, error: approachingError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('subscription_status', 'trial')
      .gt('trial_end_date', new Date().toISOString())
      .lt('trial_end_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());
      
    if (approachingError) {
      console.error("Error finding approaching expirations:", approachingError);
      throw approachingError;
    }
    
    console.log(`Found ${approachingOrgs?.length || 0} organizations approaching trial expiration`);
    
    // Create notifications for users in those organizations
    if (approachingOrgs && approachingOrgs.length > 0) {
      for (const org of approachingOrgs) {
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('organization_id', org.id)
          .in('role', ['super_admin', 'admin']);
          
        if (admins && admins.length > 0) {
          const notifications = admins.map(admin => ({
            user_id: admin.id,
            organization_id: org.id,
            title: 'Trial Expiring Soon',
            message: `Your trial will expire in less than 3 days. Upgrade to continue using all features.`,
            type: 'warning',
            action_url: '/settings/subscription'
          }));
          
          const { error: notifError } = await supabase
            .from('notifications')
            .insert(notifications);
            
          if (notifError) {
            console.error("Error creating notifications:", notifError);
          } else {
            console.log(`Created ${notifications.length} notifications for org ${org.id}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        expiredCount: expiredOrgs?.length || 0,
        approachingCount: approachingOrgs?.length || 0
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );
  } catch (error) {
    console.error('Error in check-trial-expiration function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
