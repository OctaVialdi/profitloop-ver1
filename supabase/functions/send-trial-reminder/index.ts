
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-TRIAL-REMINDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Initialize Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not set");
    const resend = new Resend(resendApiKey);
    
    // Initialize Supabase with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Process request body
    const { mode } = await req.json();
    logStep("Request received", { mode });

    // Different modes:
    // - 'manual': Send reminder for a specific organization
    // - 'auto': Automatically detect and send reminders for all organizations near trial end
    if (mode === 'manual') {
      const { organizationId, userId } = await req.json();
      if (!organizationId || !userId) {
        throw new Error("Organization ID and User ID required for manual mode");
      }
      
      await sendManualReminder(organizationId, userId, supabaseAdmin, resend);
      
    } else if (mode === 'auto') {
      await sendAutomaticReminders(supabaseAdmin, resend);
      
    } else {
      throw new Error("Invalid mode specified");
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

async function sendManualReminder(
  organizationId: string, 
  userId: string,
  supabaseAdmin: any, 
  resend: any
): Promise<void> {
  // Get organization details
  const { data: orgData, error: orgError } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .single();
    
  if (orgError || !orgData) {
    throw new Error("Organization not found");
  }
  
  // Get user profile
  const { data: userData, error: userError } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();
    
  if (userError || !userData) {
    throw new Error("User not found");
  }
  
  await sendReminderEmail(
    userData.email,
    userData.full_name || "User",
    orgData.name,
    7, // Days remaining, hardcoded for manual reminders
    resend
  );
  
  logStep("Manual reminder sent", { organizationId, userId, email: userData.email });
}

async function sendAutomaticReminders(supabaseAdmin: any, resend: any): Promise<void> {
  const now = new Date();
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  const oneDayFromNow = new Date(now);
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
  
  // Organizations with trial ending within 3 days
  const { data: orgsEndingSoon, error: orgsError } = await supabaseAdmin
    .from("organizations")
    .select("id, name, trial_end_date")
    .eq("subscription_status", "trial")
    .eq("trial_expired", false)
    .lt("trial_end_date", threeDaysFromNow.toISOString())
    .gt("trial_end_date", now.toISOString());
    
  if (orgsError) {
    throw new Error(`Error fetching organizations: ${orgsError.message}`);
  }
  
  logStep("Found organizations with trial ending soon", { count: orgsEndingSoon?.length || 0 });
  
  // Organizations with trial already ended
  const { data: orgsEnded, error: endedError } = await supabaseAdmin
    .from("organizations")
    .select("id, name, trial_end_date")
    .eq("subscription_status", "expired")
    .eq("trial_expired", true)
    .gt("trial_end_date", new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()) // In the last 24 hours
    .lt("trial_end_date", now.toISOString());
    
  if (endedError) {
    throw new Error(`Error fetching expired organizations: ${endedError.message}`);
  }
  
  logStep("Found organizations with trial recently ended", { count: orgsEnded?.length || 0 });
  
  // Process organizations with trial ending soon
  for (const org of orgsEndingSoon || []) {
    try {
      // Get admin users for this organization
      const { data: admins } = await supabaseAdmin
        .from("profiles")
        .select("id, email, full_name")
        .eq("organization_id", org.id)
        .in("role", ["super_admin", "admin"]);
        
      if (!admins || admins.length === 0) continue;
      
      // Calculate days remaining
      const trialEnd = new Date(org.trial_end_date);
      const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Send reminder to each admin
      for (const admin of admins) {
        await sendReminderEmail(
          admin.email,
          admin.full_name || "Admin",
          org.name,
          daysRemaining,
          resend
        );
        
        // Create notification in database
        await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: admin.id,
            organization_id: org.id,
            title: `Trial Ending in ${daysRemaining} days`,
            message: `Your trial for ${org.name} will end in ${daysRemaining} days. Please subscribe to continue using all features.`,
            type: "warning",
            action_url: "/settings/subscription"
          });
      }
      
      logStep("Sent trial ending reminders", { 
        organizationId: org.id, 
        daysRemaining, 
        adminCount: admins.length 
      });
    } catch (error) {
      logStep("Error processing organization", { 
        organizationId: org.id, 
        error: error.message 
      });
      // Continue with other organizations
    }
  }
  
  // Process organizations with trial already ended
  for (const org of orgsEnded || []) {
    try {
      // Get admin users for this organization
      const { data: admins } = await supabaseAdmin
        .from("profiles")
        .select("id, email, full_name")
        .eq("organization_id", org.id)
        .in("role", ["super_admin", "admin"]);
        
      if (!admins || admins.length === 0) continue;
      
      // Send expired notification to each admin
      for (const admin of admins) {
        await sendExpiredEmail(
          admin.email,
          admin.full_name || "Admin",
          org.name,
          resend
        );
        
        // Create notification in database
        await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: admin.id,
            organization_id: org.id,
            title: "Trial Has Expired",
            message: `Your trial for ${org.name} has expired. Please subscribe to regain access to all features.`,
            type: "error",
            action_url: "/settings/subscription"
          });
      }
      
      logStep("Sent trial expired notifications", { 
        organizationId: org.id, 
        adminCount: admins.length 
      });
    } catch (error) {
      logStep("Error processing expired organization", { 
        organizationId: org.id, 
        error: error.message 
      });
      // Continue with other organizations
    }
  }
}

async function sendReminderEmail(
  email: string,
  name: string,
  orgName: string,
  daysRemaining: number,
  resend: any
): Promise<void> {
  const subject = `Trial Ending in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} - Action Required`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #3b82f6;">
        <h1 style="color: #1e3a8a; margin: 0;">Trial Ending Soon</h1>
      </div>
      
      <div style="padding: 20px; background-color: white;">
        <p>Hello ${name},</p>
        
        <p>Your trial period for <strong>${orgName}</strong> will end in <strong>${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}</strong>.</p>
        
        <p>To continue enjoying all features without interruption, please subscribe to one of our plans.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000"}/settings/subscription" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; 
                    border-radius: 4px; font-weight: bold; display: inline-block;">
            Subscribe Now
          </a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Thank you for using our service!</p>
        
        <p>Best regards,<br>The Team</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  
  await resend.emails.send({
    from: "Trial Reminder <trial@yourapp.com>",
    to: [email],
    subject: subject,
    html: html
  });
}

async function sendExpiredEmail(
  email: string,
  name: string,
  orgName: string,
  resend: any
): Promise<void> {
  const subject = `Trial Has Expired - Action Required`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #fef2f2; padding: 20px; text-align: center; border-bottom: 3px solid #ef4444;">
        <h1 style="color: #b91c1c; margin: 0;">Trial Has Expired</h1>
      </div>
      
      <div style="padding: 20px; background-color: white;">
        <p>Hello ${name},</p>
        
        <p>Your trial period for <strong>${orgName}</strong> has expired.</p>
        
        <p>To regain access to all premium features, please subscribe to one of our plans.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000"}/settings/subscription" 
             style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; 
                    border-radius: 4px; font-weight: bold; display: inline-block;">
            Subscribe Now
          </a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Thank you for trying our service!</p>
        
        <p>Best regards,<br>The Team</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  
  await resend.emails.send({
    from: "Trial Reminder <trial@yourapp.com>",
    to: [email],
    subject: subject,
    html: html
  });
}
