
// Edge function to fix trial periods in existing organizations
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
    
    console.log("Starting trial period fix");

    // First, identify organizations with inconsistent trial periods
    const { data: orgs, error: fetchError } = await supabase
      .from('organizations')
      .select('id, trial_start_date, trial_end_date');
      
    if (fetchError) {
      throw fetchError;
    }
    
    let updatedCount = 0;
    const results = [];
    
    // Process each organization
    for (const org of orgs || []) {
      if (!org.trial_start_date || !org.trial_end_date) {
        // If missing trial start date, set it to 14 days before trial end date
        if (!org.trial_start_date && org.trial_end_date) {
          const endDate = new Date(org.trial_end_date);
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 14); // 14 day trial
          
          const { error } = await supabase
            .from('organizations')
            .update({ 
              trial_start_date: startDate.toISOString() 
            })
            .eq('id', org.id);
            
          if (!error) {
            updatedCount++;
            results.push({
              org_id: org.id,
              action: 'added_trial_start_date',
              trial_start_date: startDate.toISOString(),
              trial_end_date: org.trial_end_date
            });
          }
          
          continue;
        }
        
        // If missing trial end date but have start date, set end to 14 days after start
        if (org.trial_start_date && !org.trial_end_date) {
          const startDate = new Date(org.trial_start_date);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 14); // 14 day trial
          
          const { error } = await supabase
            .from('organizations')
            .update({ 
              trial_end_date: endDate.toISOString() 
            })
            .eq('id', org.id);
            
          if (!error) {
            updatedCount++;
            results.push({
              org_id: org.id,
              action: 'added_trial_end_date',
              trial_start_date: org.trial_start_date,
              trial_end_date: endDate.toISOString()
            });
          }
          
          continue;
        }
        
        // If both dates are missing, set them based on now
        if (!org.trial_start_date && !org.trial_end_date) {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 14); // 14 day trial
          
          const { error } = await supabase
            .from('organizations')
            .update({ 
              trial_start_date: startDate.toISOString(),
              trial_end_date: endDate.toISOString() 
            })
            .eq('id', org.id);
            
          if (!error) {
            updatedCount++;
            results.push({
              org_id: org.id,
              action: 'added_both_dates',
              trial_start_date: startDate.toISOString(),
              trial_end_date: endDate.toISOString()
            });
          }
          
          continue;
        }
      } else {
        // Both dates exist, check if they're 14 days apart
        const startDate = new Date(org.trial_start_date);
        const endDate = new Date(org.trial_end_date);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If not 14 days, fix it
        if (Math.abs(diffDays - 14) > 1) { // Allow for small rounding errors
          const newEndDate = new Date(startDate);
          newEndDate.setDate(newEndDate.getDate() + 14); // 14 day trial
          
          const { error } = await supabase
            .from('organizations')
            .update({ 
              trial_end_date: newEndDate.toISOString() 
            })
            .eq('id', org.id);
            
          if (!error) {
            updatedCount++;
            results.push({
              org_id: org.id,
              action: 'fixed_inconsistent_period',
              old_period_days: diffDays,
              old_trial_end_date: org.trial_end_date,
              new_trial_end_date: newEndDate.toISOString(),
              trial_start_date: org.trial_start_date
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated_count: updatedCount,
        results
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );
  } catch (error) {
    console.error('Error in fix-trial-periods function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
