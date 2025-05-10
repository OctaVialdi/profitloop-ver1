
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
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
    
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing required Supabase environment variables");
    }

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    // Create Supabase clients
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // Initialize Resend email client
    const resend = new Resend(resendApiKey);
    
    // Get request body
    const { daysLeft } = await req.json();
    
    // Validate daysLeft parameter
    if (typeof daysLeft !== 'number' || daysLeft < 0) {
      throw new Error("Invalid daysLeft parameter");
    }
    
    logStep("Processing request", { daysLeft });
    
    // Authenticate the user
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    if (!userData?.user) throw new Error("No authenticated user found");
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });
    
    // Get user's profile to fetch organization ID
    const { data: profileData } = await supabaseAdmin
      .from('profiles')
      .select('organization_id, full_name')
      .eq('id', user.id)
      .maybeSingle();
      
    if (!profileData?.organization_id) {
      throw new Error("User has no associated organization");
    }
    
    // Get organization details
    const { data: orgData } = await supabaseAdmin
      .from('organizations')
      .select('id, name, trial_end_date')
      .eq('id', profileData.organization_id)
      .maybeSingle();
      
    if (!orgData) throw new Error("Organization not found");
    
    logStep("Found organization", { orgId: orgData.id, orgName: orgData.name });
    
    // Format trial end date
    const trialEndDate = orgData.trial_end_date ? new Date(orgData.trial_end_date) : null;
    const formattedEndDate = trialEndDate ? trialEndDate.toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : 'tidak diketahui';
    
    // Get all admins of the organization to send them emails
    const { data: admins } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('organization_id', orgData.id)
      .in('role', ['super_admin', 'admin']);
    
    if (!admins || admins.length === 0) {
      throw new Error("No admin users found for organization");
    }
    
    logStep("Found admins", { count: admins.length });
    
    // Generate trial reminder message
    const userName = profileData.full_name || user.email || 'Pelanggan';
    const orgName = orgData.name || 'Organisasi Anda';
    
    // Determine email subject and content based on days left
    let subject = '';
    let content = '';
    
    if (daysLeft === 0) {
      subject = `Masa trial ${orgName} telah berakhir`;
      content = `
        <h1>Masa Trial Anda Telah Berakhir</h1>
        <p>Halo ${userName},</p>
        <p>Masa trial untuk ${orgName} telah berakhir. Untuk melanjutkan akses ke semua fitur premium, silakan upgrade ke salah satu paket berlangganan kami.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${supabaseUrl}/settings/subscription" style="background-color: #9b87f5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Upgrade Sekarang</a>
        </div>
        <p>Jika Anda memerlukan bantuan atau memiliki pertanyaan, silakan hubungi tim dukungan kami.</p>
        <p>Terima kasih,<br>Tim Kami</p>
      `;
    } else {
      subject = `Masa trial ${orgName} akan berakhir dalam ${daysLeft} hari`;
      content = `
        <h1>Masa Trial Anda Akan Segera Berakhir</h1>
        <p>Halo ${userName},</p>
        <p>Masa trial untuk ${orgName} akan berakhir pada <strong>${formattedEndDate}</strong> (${daysLeft} hari lagi).</p>
        <p>Untuk melanjutkan akses ke semua fitur premium, silakan upgrade ke salah satu paket berlangganan kami sebelum masa trial berakhir.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="${supabaseUrl}/settings/subscription" style="background-color: #9b87f5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Lihat Paket Berlangganan</a>
        </div>
        <p>Jika Anda memerlukan bantuan atau memiliki pertanyaan, silakan hubungi tim dukungan kami.</p>
        <p>Terima kasih,<br>Tim Kami</p>
      `;
    }
    
    // Send email notifications to all admins
    const emailPromises = admins.map(admin => {
      return resend.emails.send({
        from: 'notification@yourdomain.com',
        to: admin.email!,
        subject: subject,
        html: content
      });
    });
    
    // Wait for all emails to be sent
    const emailResults = await Promise.allSettled(emailPromises);
    const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
    
    logStep("Email sending complete", { 
      total: emailResults.length, 
      success: successCount,
      failed: emailResults.length - successCount 
    });
    
    // Create notifications in the system for all admins
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      organization_id: orgData.id,
      title: subject,
      message: daysLeft === 0 
        ? 'Masa trial Anda telah berakhir. Silakan upgrade untuk melanjutkan akses.' 
        : `Masa trial Anda akan berakhir dalam ${daysLeft} hari.`,
      type: 'warning',
      action_url: '/settings/subscription'
    }));
    
    if (notifications.length > 0) {
      const { error: notifError } = await supabaseAdmin
        .from('notifications')
        .insert(notifications);
        
      if (notifError) {
        console.error("Error creating notifications:", notifError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: successCount,
        emailsFailed: emailResults.length - successCount
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
    
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in send-trial-reminder:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});
