
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  organizationId: string;
  email: string;
  daysLeft: number;
  name: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Resend client with API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable not set");
    }
    
    const resend = new Resend(resendApiKey);
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Get request data
    const { organizationId, email, daysLeft, name } = await req.json() as EmailData;

    if (!organizationId || !email) {
      throw new Error("Missing required fields");
    }

    // Prepare email content based on days left
    let subject = "";
    let preheaderText = "";
    let buttonText = "Upgrade Now";
    let messageContent = "";
    
    // Get organization info for branding
    const frontendUrl = Deno.env.get("FRONTEND_URL") || supabaseUrl;
    const upgradeUrl = `${frontendUrl}/settings/subscription`;

    if (daysLeft === 0) {
      subject = "Your trial has ended";
      preheaderText = "Your trial period has expired. Upgrade to continue using all features.";
      messageContent = `
        <p>Dear ${name || "User"},</p>
        <p>Your 14-day trial has now ended. To continue using all premium features without interruption, please upgrade to a paid subscription.</p>
        <p>You have a 2-day grace period before your account is restricted.</p>
      `;
    } else if (daysLeft === 1) {
      subject = "Your trial ends tomorrow";
      preheaderText = "Your trial ends in 24 hours. Upgrade to avoid any interruption.";
      messageContent = `
        <p>Dear ${name || "User"},</p>
        <p>Your 14-day trial will end in 24 hours. To continue using all features without interruption, please upgrade to a paid subscription.</p>
        <p>After your trial ends, you'll have a 2-day grace period before your account is restricted.</p>
      `;
    } else if (daysLeft === 3) {
      subject = "Your trial ends in 3 days";
      preheaderText = "Your trial ends in 3 days. Upgrade to continue using all features.";
      messageContent = `
        <p>Dear ${name || "User"},</p>
        <p>Your 14-day trial will end in 3 days. To continue using all premium features without interruption, please upgrade to a paid subscription.</p>
      `;
    }

    // Create email HTML with modern styling
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <meta name="description" content="${preheaderText}">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; padding: 20px; text-align: center; }
          .header img { max-height: 40px; }
          .header h1 { color: white; margin: 0; padding: 10px 0; font-size: 24px; }
          .content { background-color: #ffffff; padding: 30px 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; margin: 20px 0; }
          .button:hover { background-color: #3c36b1; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .timer { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 4px; }
          @media only screen and (max-width: 550px) {
            .container { width: 100%; }
            .content { padding: 20px 15px; }
            .header h1 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Trial Notification</h1>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            ${messageContent}
            <div class="timer">
              ${daysLeft === 0 ? 'Your trial has ended' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining in your trial`}
            </div>
            <div style="text-align: center;">
              <a href="${upgradeUrl}" class="button">${buttonText}</a>
            </div>
            <p>If you have any questions or need assistance, please contact our support team.</p>
            <p>Thank you for trying our service!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p><small>You're receiving this email because you have an active trial account.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Log email sending attempt to audit table
    const createClient = (await import("https://esm.sh/@supabase/supabase-js@2.7.1")).createClient;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });
    
    // First log the attempt
    const { data: auditLog, error: auditError } = await supabase
      .from('subscription_audit_logs')
      .insert({
        organization_id: organizationId,
        action: `trial_reminder_email_${daysLeft}_days`,
        user_id: null,
        data: {
          recipient_email: email,
          days_left: daysLeft,
          sent_at: new Date().toISOString()
        }
      });
    
    if (auditError) {
      console.error("Error logging email attempt:", auditError);
    }

    // Now actually send the email with Resend
    const emailResponse = await resend.emails.send({
      from: 'Trial Updates <trial@yourdomain.com>',
      to: email,
      subject: subject,
      html: emailHtml,
      text: `${subject}\n\n${preheaderText}\n\nVisit ${upgradeUrl} to upgrade your subscription.`,
    });
    
    // Log success
    if (emailResponse?.id) {
      await supabase
        .from('subscription_audit_logs')
        .insert({
          organization_id: organizationId,
          action: `trial_reminder_email_${daysLeft}_days_success`,
          user_id: null,
          data: {
            recipient_email: email,
            days_left: daysLeft,
            sent_at: new Date().toISOString(),
            email_id: emailResponse.id
          }
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email notification sent",
        recipient: email,
        daysLeft,
        email_id: emailResponse?.id || null
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending trial reminder:", error);
    
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
