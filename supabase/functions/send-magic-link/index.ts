
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Replace with your Supabase URL and service role key
const supabaseUrl = "https://nqbcxrujjxwgoyjxmmla.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    
    let emailSent = false;
    let emailError = null;
    
    try {
      // Coba kirim email menggunakan fitur bawaan Supabase
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: magicLinkUrl,
        data: {
          organization_id: organizationId,
          organization_name: orgData?.name || 'organization',
          role: role || 'employee',
          invitation_token: result.token
        }
      });
      
      if (!error) {
        emailSent = true;
      } else {
        emailError = error;
        console.error("Error sending email with Supabase auth:", error);
      }
    } catch (err) {
      emailError = err;
      console.error("Exception sending email with Supabase auth:", err);
    }
    
    // Jika email sudah terdaftar atau ada error lain, coba alternatif kedua: mengirim email langsung
    if (!emailSent && emailError?.message?.includes("already been registered")) {
      try {
        // Cari pengguna yang sudah ada
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', email)
          .maybeSingle();
          
        if (userError) {
          console.error("Error finding existing user:", userError);
        }
        
        if (userData) {
          console.log("Found existing user:", userData);
          
          // Kirim notifikasi ke pengguna yang sudah ada
          const { error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: userData.id,
              organization_id: organizationId,
              title: `Undangan Bergabung ke ${orgData?.name || 'Organisasi'}`,
              message: `Anda diundang untuk bergabung dengan ${orgData?.name || 'organisasi'}. Klik tautan ini untuk bergabung: ${magicLinkUrl}`,
              type: 'invitation',
              action_url: magicLinkUrl
            });
            
          if (notifError) {
            console.error("Error sending notification:", notifError);
          } else {
            console.log("Notification sent to existing user");
            emailSent = true;
          }
        }
      } catch (alternateErr) {
        console.error("Error in alternate notification method:", alternateErr);
      }
    }
    
    console.log("Email invitation sent status:", emailSent ? "Success" : "Failed");

    // Log the email details for debugging
    console.log("=== EMAIL MAGIC LINK DETAILS ===");
    console.log(`To: ${email}`);
    console.log(`Subject: Undangan untuk bergabung dengan ${orgData?.name || 'organisasi'}`);
    console.log(`Magic Link URL: ${magicLinkUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: emailSent ? "Magic Link berhasil dikirim" : "Magic Link dibuat tetapi email gagal dikirim",
        invitation_url: magicLinkUrl,
        email_sent: emailSent,
        email_error: emailError ? emailError.message : null
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
