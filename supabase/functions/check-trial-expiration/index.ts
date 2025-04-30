
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
      .select('id, name')
      .lt('trial_end_date', now.toISOString())
      .is('subscription_plan_id', null);
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${expiredTrials?.length || 0} organizations with expired trials`);
    
    // Process expired trials
    if (expiredTrials && expiredTrials.length > 0) {
      for (const org of expiredTrials) {
        console.log(`Processing expired trial for organization: ${org.id} (${org.name})`);
        
        // You could implement notifications or other actions here
        // For example, send an email to the organization admins
        
        // Mark the organization as expired (e.g., by setting a flag)
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ trial_expired: true })
          .eq('id', org.id);
          
        if (updateError) {
          console.error(`Error updating organization ${org.id}:`, updateError);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: expiredTrials?.length || 0 
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
