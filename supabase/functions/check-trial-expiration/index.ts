
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
    // Create a Supabase client with the admin role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Call the function to update trial expirations
    const { data, error } = await supabase.rpc('check_trial_expirations');
    
    // Check for errors
    if (error) throw error;
    
    // Now let's send email reminders to organizations with trials ending soon
    // Get organizations with trials ending in 1, 3 days or already ended
    const { data: orgsNeedingReminders, error: orgsError } = await supabase
      .from('organizations')
      .select(`
        id,
        name,
        trial_end_date,
        subscription_status,
        profiles!inner(id, email, full_name, role)
      `)
      .in('subscription_status', ['trial', 'expired'])
      .gte('trial_end_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Include those expired in the last 24h
      .lte('trial_end_date', new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()); // Include those expiring in the next 4 days
      
    if (orgsError) {
      console.error("Error fetching organizations for reminders:", orgsError);
    } else if (orgsNeedingReminders) {
      // Process each organization
      for (const org of orgsNeedingReminders) {
        const trialEndDate = new Date(org.trial_end_date);
        const now = new Date();
        const diffTime = trialEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Only send reminders for 0, 1, or 3 days
        if (![0, 1, 3].includes(diffDays)) continue;
        
        // Send reminder to each admin in the organization
        const admins = org.profiles.filter(p => ['super_admin', 'admin'].includes(p.role));
        
        for (const admin of admins) {
          try {
            // Call the send-trial-reminder function
            await fetch(`${supabaseUrl}/functions/v1/send-trial-reminder`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({
                organizationId: org.id,
                email: admin.email,
                name: admin.full_name,
                daysLeft: diffDays
              })
            });
          } catch (emailError) {
            console.error(`Error sending reminder to ${admin.email}:`, emailError);
          }
        }
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Trial expiration check and reminders sent successfully",
        result: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    // Return error response
    console.error("Error in trial expiration check:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
