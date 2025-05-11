
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not set");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);
    
    // Get user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    if (!userData?.user) throw new Error("No authenticated user found");
    
    const user = userData.user;
    
    // Parse request body
    const { organizationId, daysLeft, email = user.email } = await req.json();
    
    if (!organizationId) throw new Error("Organization ID is required");
    if (!daysLeft && daysLeft !== 0) throw new Error("Days left is required");
    
    // Get organization information
    const { data: organization, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select("name, trial_end_date")
      .eq("id", organizationId)
      .single();
      
    if (orgError || !organization) {
      throw new Error("Organization not found or error fetching organization data");
    }
    
    // Generate appropriate email content based on days left
    let subject = "";
    let emailHtml = "";
    
    if (daysLeft === 0) {
      subject = `Trial Anda di ${organization.name} telah berakhir`;
      emailHtml = `
        <h1>Trial Anda telah berakhir</h1>
        <p>Masa trial untuk ${organization.name} telah berakhir hari ini. Untuk melanjutkan akses ke semua fitur, silakan upgrade ke paket berbayar.</p>
        <p>Jika Anda mengalami kendala atau membutuhkan bantuan, jangan ragu untuk menghubungi tim dukungan kami.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${req.headers.get("Origin")}/settings/subscription" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Upgrade Sekarang
          </a>
        </div>
      `;
    } else if (daysLeft === 1) {
      subject = `Trial Anda di ${organization.name} berakhir besok`;
      emailHtml = `
        <h1>Trial Anda berakhir besok</h1>
        <p>Masa trial untuk ${organization.name} akan berakhir besok. Untuk menghindari gangguan layanan, silakan upgrade ke paket berbayar.</p>
        <p>Dengan berlangganan, Anda akan terus mendapatkan akses ke semua fitur premium dan dukungan prioritas.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${req.headers.get("Origin")}/settings/subscription" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Upgrade Sekarang
          </a>
        </div>
      `;
    } else if (daysLeft <= 3) {
      subject = `Trial Anda di ${organization.name} berakhir dalam ${daysLeft} hari`;
      emailHtml = `
        <h1>Trial Anda akan segera berakhir</h1>
        <p>Masa trial untuk ${organization.name} akan berakhir dalam ${daysLeft} hari. Untuk menghindari gangguan layanan, silakan upgrade ke paket berbayar.</p>
        <p>Kami menawarkan berbagai paket berlangganan yang dapat disesuaikan dengan kebutuhan bisnis Anda.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${req.headers.get("Origin")}/settings/subscription" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Lihat Paket Kami
          </a>
        </div>
      `;
    } else {
      subject = `${daysLeft} hari tersisa dalam trial Anda di ${organization.name}`;
      emailHtml = `
        <h1>${daysLeft} hari tersisa dalam trial Anda</h1>
        <p>Masa trial untuk ${organization.name} akan berakhir dalam ${daysLeft} hari. Kami harap Anda menikmati semua fitur yang kami tawarkan.</p>
        <p>Untuk terus menikmati akses tak terbatas, silakan pertimbangkan untuk upgrade ke salah satu paket berlangganan kami.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${req.headers.get("Origin")}/settings/subscription" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Lihat Paket Kami
          </a>
        </div>
      `;
    }
    
    // Add common email styling and footer
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${emailHtml}
        <div style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; font-size: 12px; color: #666;">
          <p>Email ini dikirimkan secara otomatis terkait dengan langganan Anda.</p>
          <p>© ${new Date().getFullYear()} ${organization.name}</p>
        </div>
      </div>
    `;
    
    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: `Notifications <no-reply@${Deno.env.get("RESEND_DOMAIN") || "resend.dev"}>`,
      to: [email],
      subject: subject,
      html: emailHtml,
      tags: [
        {
          name: "category",
          value: "trial_reminder"
        },
        {
          name: "days_left",
          value: daysLeft.toString()
        }
      ]
    });
    
    console.log("Email sent:", emailResult);
    
    // Log the reminder in audit logs
    await supabaseAdmin.from("subscription_audit_logs").insert({
      organization_id: organizationId,
      action: "trial_reminder_sent",
      user_id: user.id,
      data: {
        days_left: daysLeft,
        sent_to: email,
        email_type: "trial_reminder"
      }
    });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Trial reminder email sent successfully",
        email_id: emailResult.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
    
  } catch (error) {
    console.error("Error in send-trial-reminder:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
