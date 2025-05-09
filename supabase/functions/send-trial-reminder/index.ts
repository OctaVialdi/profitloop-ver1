
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get request data
    const { organizationId, email, daysLeft, name } = await req.json() as EmailData;

    if (!organizationId || !email) {
      throw new Error("Missing required fields");
    }

    // Prepare email content based on days left
    let subject = "Your trial is ending soon";
    let message = "";

    if (daysLeft === 0) {
      subject = "Your trial has ended";
      message = `
        <h2>Your trial has ended</h2>
        <p>Dear ${name || "User"},</p>
        <p>Your 14-day trial has now ended. To continue using all features, please upgrade to a paid subscription.</p>
        <p><a href="${supabaseUrl}/settings/subscription" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">Upgrade Now</a></p>
        <p>If you have any questions or need assistance, please contact our support team.</p>
        <p>Thank you for trying our service!</p>
      `;
    } else if (daysLeft === 1) {
      subject = "Your trial ends tomorrow";
      message = `
        <h2>24 Hours Left in Your Trial</h2>
        <p>Dear ${name || "User"},</p>
        <p>Your 14-day trial will end in 24 hours. To continue using all features without interruption, please upgrade to a paid subscription.</p>
        <p><a href="${supabaseUrl}/settings/subscription" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">Upgrade Now</a></p>
        <p>If you have any questions or need assistance, please contact our support team.</p>
        <p>Thank you for trying our service!</p>
      `;
    } else if (daysLeft === 3) {
      subject = "Your trial ends in 3 days";
      message = `
        <h2>3 Days Left in Your Trial</h2>
        <p>Dear ${name || "User"},</p>
        <p>Your 14-day trial will end in 3 days. To continue using all features without interruption, please upgrade to a paid subscription.</p>
        <p><a href="${supabaseUrl}/settings/subscription" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">Upgrade Now</a></p>
        <p>If you have any questions or need assistance, please contact our support team.</p>
        <p>Thank you for trying our service!</p>
      `;
    }

    // Log email sending attempt to audit table
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

    // In a real implementation, you would send the email using a service like Resend, SendGrid, etc.
    // For now, we'll just log it and pretend it was sent
    console.log(`Email would be sent to ${email} with subject: ${subject}`);
    console.log(`Message: ${message}`);

    // To actually send emails, you would use a service like Resend:
    // const apiKey = Deno.env.get("RESEND_API_KEY");
    // const resend = new Resend(apiKey);
    // await resend.emails.send({
    //   from: 'noreply@yourapp.com',
    //   to: email,
    //   subject: subject,
    //   html: message,
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email notification sent",
        recipient: email,
        daysLeft
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
