
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

  // Create Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const now = new Date();
    
    // Fetch organizations with expired trials - check if trial_end_date is in the past
    // and status is still 'trial'
    const { data: expiredTrials, error } = await supabase
      .from('organizations')
      .select('id, name, subscription_plan_id')
      .lt('trial_end_date', now.toISOString())
      .eq('subscription_status', 'trial');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${expiredTrials?.length || 0} organizations with newly expired trials`);
    
    // Process expired trials
    if (expiredTrials && expiredTrials.length > 0) {
      for (const org of expiredTrials) {
        console.log(`Processing expired trial for organization: ${org.id} (${org.name})`);
        
        // Get organization admins to notify them
        const { data: admins } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('organization_id', org.id)
          .in('role', ['super_admin', 'admin']);
          
        console.log(`Found ${admins?.length || 0} admins to notify for organization ${org.id}`);
        
        // Get basic plan ID for default plan after trial
        const basicPlanId = await getBasicPlanId(supabase);
        
        // Mark the organization as expired
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ 
            subscription_status: 'expired',
            // If they don't have a subscription plan, set to the basic free plan
            subscription_plan_id: org.subscription_plan_id || basicPlanId
          })
          .eq('id', org.id);
          
        if (updateError) {
          console.error(`Error updating organization ${org.id}:`, updateError);
        } else {
          console.log(`Marked organization ${org.id} as trial expired`);
          
          // Create notifications for all organization admins
          if (admins && admins.length > 0) {
            for (const admin of admins) {
              // Add a notification in the notifications table
              const { error: notificationError } = await supabase
                .from('notifications')
                .insert({
                  user_id: admin.id,
                  organization_id: org.id,
                  title: 'Masa Trial Berakhir',
                  message: `Masa trial untuk organisasi ${org.name} telah berakhir. Silakan berlangganan untuk terus menggunakan semua fitur premium.`,
                  type: 'error',
                  action_url: '/subscription'
                });
                
              if (notificationError) {
                console.error(`Error creating notification for admin ${admin.email}:`, notificationError);
              } else {
                console.log(`Created notification for admin ${admin.email}`);
              }
            }
          }
        }
      }
    }
    
    // Also check for organizations within 3 days of trial expiration for warnings
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const { data: nearingExpiration, error: warningError } = await supabase
      .from('organizations')
      .select('id, name, trial_end_date')
      .lt('trial_end_date', threeDaysFromNow.toISOString())
      .gt('trial_end_date', now.toISOString())
      .eq('subscription_status', 'trial');
    
    if (warningError) {
      console.error("Error fetching organizations nearing expiration:", warningError);
    } else if (nearingExpiration && nearingExpiration.length > 0) {
      console.log(`Found ${nearingExpiration.length} organizations nearing trial expiration`);
      
      for (const org of nearingExpiration) {
        const daysLeft = Math.ceil((new Date(org.trial_end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`Organization ${org.id} trial ends in ${daysLeft} days`);
        
        // Get organization admins to notify
        const { data: admins } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('organization_id', org.id)
          .in('role', ['super_admin', 'admin']);
          
        if (admins && admins.length > 0) {
          for (const admin of admins) {
            // Add a notification in the notifications table
            await supabase
              .from('notifications')
              .insert({
                user_id: admin.id,
                organization_id: org.id,
                title: 'Masa Trial Akan Berakhir',
                message: `Masa trial untuk organisasi ${org.name} akan berakhir dalam ${daysLeft} hari. Silakan berlangganan untuk terus menggunakan semua fitur premium.`,
                type: 'warning',
                action_url: '/subscription'
              });
          }
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        expired_processed: expiredTrials?.length || 0,
        warnings_sent: nearingExpiration?.length || 0
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error processing trial expirations:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});

// Helper function to get the basic plan ID
async function getBasicPlanId(supabase) {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('name', 'Basic')
    .single();
  
  if (error || !data) {
    // If no Basic plan exists, create one
    const { data: newPlan } = await supabase
      .from('subscription_plans')
      .insert({
        name: 'Basic',
        max_members: 5,
        price: 0,
        features: { storage: '1GB', api_calls: 1000 }
      })
      .select()
      .single();
    
    return newPlan?.id;
  }
  
  return data.id;
}
