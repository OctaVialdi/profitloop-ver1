
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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Checking for expired trials...");
    
    // Find organizations with expired trials that haven't been marked as expired
    const { data: expiredTrials, error: trialError } = await supabaseAdmin
      .from("organizations")
      .select("id, name, trial_end_date")
      .lt("trial_end_date", new Date().toISOString())
      .eq("trial_expired", false)
      .eq("subscription_status", "trial");
      
    if (trialError) {
      throw new Error(`Error fetching expired trials: ${trialError.message}`);
    }
    
    console.log(`Found ${expiredTrials?.length || 0} expired trials that need updating`);
    
    // Update each expired trial
    if (expiredTrials && expiredTrials.length > 0) {
      for (const org of expiredTrials) {
        console.log(`Updating trial for organization: ${org.id} (${org.name})`);
        
        // Update organization status
        const { error: updateError } = await supabaseAdmin
          .from("organizations")
          .update({
            trial_expired: true,
            subscription_status: "expired"
          })
          .eq("id", org.id);
          
        if (updateError) {
          console.error(`Error updating organization ${org.id}: ${updateError.message}`);
          continue;
        }
        
        // Get admins of the organization
        const { data: admins } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("organization_id", org.id)
          .in("role", ["super_admin", "admin"]);
          
        if (admins && admins.length > 0) {
          // Create notifications for admins
          const notifications = admins.map(admin => ({
            user_id: admin.id,
            organization_id: org.id,
            title: "Trial Telah Berakhir",
            message: "Masa trial Anda telah berakhir. Silakan pilih paket berlangganan untuk melanjutkan menggunakan layanan.",
            type: "error",
            action_url: "/settings/subscription"
          }));
          
          await supabaseAdmin.from("notifications").insert(notifications);
          
          console.log(`Created ${notifications.length} notifications for organization ${org.id}`);
        }
        
        // Log the trial expiration
        await supabaseAdmin
          .from("subscription_audit_logs")
          .insert({
            organization_id: org.id,
            action: "trial_expired",
            data: {
              trial_end_date: org.trial_end_date,
              expired_at: new Date().toISOString()
            }
          });
      }
    }
    
    // Find organizations approaching trial expiration for reminders
    // (3, 2, and 1 days before expiration)
    const reminderDays = [1, 2, 3, 7];
    const now = new Date();
    
    for (const days of reminderDays) {
      // Calculate the date that is 'days' ahead of now
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      // Format dates for comparison (we use the date part only)
      const targetDateStr = futureDate.toISOString().split('T')[0];
      
      console.log(`Checking for trials expiring in ${days} days (${targetDateStr})...`);
      
      // Find organizations with trials expiring on the target date
      const { data: expiringTrials, error: expiringError } = await supabaseAdmin
        .rpc('get_organizations_with_trial_expiring_on', { 
          target_date: targetDateStr 
        });
        
      if (expiringError) {
        console.error(`Error finding trials expiring in ${days} days: ${expiringError.message}`);
        continue;
      }
      
      console.log(`Found ${expiringTrials?.length || 0} trials expiring in ${days} days`);
      
      // Create notifications for admins of each organization
      if (expiringTrials && expiringTrials.length > 0) {
        for (const org of expiringTrials) {
          // Get admins of the organization
          const { data: admins } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("organization_id", org.id)
            .in("role", ["super_admin", "admin"]);
            
          if (admins && admins.length > 0) {
            // Create messages based on days remaining
            let title = "";
            let message = "";
            let type: "info" | "warning" | "error" = "info";
            
            if (days === 1) {
              title = "Trial Berakhir Besok";
              message = "Masa trial Anda akan berakhir besok. Silakan pilih paket berlangganan untuk menghindari gangguan layanan.";
              type = "error";
            } else if (days === 2) {
              title = "Trial Berakhir Dalam 2 Hari";
              message = "Masa trial Anda akan berakhir dalam 2 hari. Silakan pilih paket berlangganan untuk menghindari gangguan layanan.";
              type = "warning";
            } else if (days === 3) {
              title = "Trial Berakhir Dalam 3 Hari";
              message = "Masa trial Anda akan berakhir dalam 3 hari. Silakan pertimbangkan untuk berlangganan.";
              type = "warning";
            } else {
              title = `Trial Berakhir Dalam ${days} Hari`;
              message = `Masa trial Anda akan berakhir dalam ${days} hari. Silakan pertimbangkan paket berlangganan kami.`;
              type = "info";
            }
            
            // Create notifications for each admin
            const notifications = admins.map(admin => ({
              user_id: admin.id,
              organization_id: org.id,
              title,
              message,
              type,
              action_url: "/settings/subscription"
            }));
            
            await supabaseAdmin.from("notifications").insert(notifications);
            
            console.log(`Created ${notifications.length} reminder notifications for organization ${org.id} (${days} days remaining)`);
            
            // Log the reminder in audit logs
            await supabaseAdmin
              .from("subscription_audit_logs")
              .insert({
                organization_id: org.id,
                action: "trial_reminder_notification",
                data: {
                  days_remaining: days,
                  trial_end_date: org.trial_end_date
                }
              });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        checked_organizations: expiredTrials?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Error in check-trial-expiration:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
