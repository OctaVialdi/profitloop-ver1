
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
    
    // Fetch organizations with expired trials
    const { data: expiredTrials, error } = await supabase
      .from('organizations')
      .select('id, name, subscription_plan_id')
      .lt('trial_end_date', now.toISOString())
      .eq('trial_expired', false);
    
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
            trial_expired: true,
            // If they don't have a subscription plan, set to the basic free plan
            subscription_plan_id: org.subscription_plan_id || basicPlanId
          })
          .eq('id', org.id);
          
        if (updateError) {
          console.error(`Error updating organization ${org.id}:`, updateError);
        } else {
          console.log(`Marked organization ${org.id} as trial expired`);
          
          // Set custom claims for all organization users to reflect trial expiration
          if (admins && admins.length > 0) {
            for (const admin of admins) {
              // Add a notification in the future via a notifications table
              console.log(`Would notify admin ${admin.email} about trial expiration`);
              
              // You could send emails or store notifications here
            }
          }
        }
      }
    }
    
    // Now update JWT claims for all users to include org_id and role
    await updateCustomClaims(supabase);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: expiredTrials?.length || 0,
        claims_updated: true
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

// Update custom claims for all users
async function updateCustomClaims(supabase) {
  try {
    // Get all profiles with their organizations
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, organization_id, role');
    
    if (error) {
      throw error;
    }
    
    console.log(`Updating custom claims for ${profiles?.length || 0} users`);
    
    // Update custom claims for each user
    if (profiles && profiles.length > 0) {
      for (const profile of profiles) {
        if (profile.organization_id && profile.role) {
          // Set custom claims for the user
          const { error: claimError } = await supabase.auth.admin.updateUserById(
            profile.id,
            { 
              user_metadata: { 
                org_id: profile.organization_id,
                role: profile.role
              }
            }
          );
          
          if (claimError) {
            console.error(`Error updating claims for user ${profile.id}:`, claimError);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating custom claims:", error);
    return false;
  }
}
