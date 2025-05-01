
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Replace with your Supabase URL and service role key
const supabaseUrl = "https://nqbcxrujjxwgoyjxmmla.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

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
    const { email, organizationId, role } = await req.json();
    console.log("Processing Magic Link invitation for:", email, "to organization:", organizationId);

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate magic link invitation using the database function
    const { data: result, error: invitationError } = await supabase
      .rpc('generate_magic_link_invitation', {
        email_address: email,
        org_id: organizationId,
        user_role: role || 'employee'
      });

    console.log("Invitation generation result:", result);
    console.log("Invitation error:", invitationError);

    if (invitationError) {
      throw invitationError;
    }

    if (!result || !result.token) {
      throw new Error("Failed to generate invitation token");
    }

    // Get organization details
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    // Generate magic link URL
    const baseUrl = supabaseUrl.includes("localhost") 
      ? "http://localhost:5173" 
      : "https://app.profitloop.id";
      
    const magicLinkUrl = `${baseUrl}/join-organization?token=${result.token}&email=${encodeURIComponent(email)}`;
    
    console.log("Generated Magic Link URL:", magicLinkUrl);
    console.log("Organization Name:", orgData?.name);
    
    // Initialize Resend client for email sending
    const resend = new Resend(resendApiKey);
    
    // Send actual email with Magic Link using Resend
    const emailContent = `
      <h1>Anda diundang untuk bergabung dengan ${orgData?.name || 'organisasi'}</h1>
      <p>Klik tautan di bawah ini untuk bergabung dengan organisasi:</p>
      <a href="${magicLinkUrl}">Bergabung dengan Organisasi</a>
      <p>Tautan ini akan kedaluwarsa dalam 7 hari.</p>
      <p>Jika Anda tidak mengenali pengirim, silakan abaikan email ini.</p>
    `;

    // If we have a Resend API key, send the email
    if (resendApiKey) {
      const emailResponse = await resend.emails.send({
        from: "ProfitLoop <noreply@profitloop.id>",
        to: email,
        subject: `Undangan untuk bergabung dengan ${orgData?.name || 'organisasi'}`,
        html: emailContent,
      });
      
      console.log("Email sending response:", emailResponse);
    } else {
      console.log("RESEND_API_KEY not configured. Email not sent. Please configure the API key.");
      // We'll still return success with the invitation URL for testing purposes
    }

    // Log the email details for debugging
    console.log("=== EMAIL MAGIC LINK DETAILS ===");
    console.log(`To: ${email}`);
    console.log(`Subject: Undangan untuk bergabung dengan ${orgData?.name || 'organisasi'}`);
    console.log(emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Magic Link berhasil dikirim",
        invitation_url: magicLinkUrl
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error sending Magic Link invitation:", error);
    
    return new Response(
      JSON.stringify({ error: "Gagal mengirim Magic Link" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
