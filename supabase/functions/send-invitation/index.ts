
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
    const { invitationId } = await req.json();

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select(`
        id, email, token, 
        organizations!inner(name)
      `)
      .eq("id", invitationId)
      .eq("status", "pending")
      .single();

    if (invitationError || !invitation) {
      console.error("Error fetching invitation:", invitationError);
      return new Response(
        JSON.stringify({ error: "Undangan tidak ditemukan atau sudah tidak berlaku" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the sender details
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("organization_id", invitation.organizations.id)
      .limit(1);

    const senderName = profiles && profiles.length > 0 ? profiles[0].full_name : "Tim";
    const organizationName = invitation.organizations.name;

    // In a real app, you would send an email using a service like SendGrid, Postmark, or Resend
    // For demo purposes, we'll just log the email details
    console.log("=== EMAIL INVITATION DETAILS ===");
    console.log(`To: ${invitation.email}`);
    console.log(`Subject: Undangan untuk bergabung dengan ${organizationName}`);
    console.log(`
      <h1>Anda diundang untuk bergabung dengan ${organizationName}</h1>
      <p>Halo,</p>
      <p>${senderName} mengundang Anda untuk bergabung dengan organisasi mereka di Multi-Tenant App.</p>
      <p>Klik tautan di bawah ini untuk menerima undangan:</p>
      <a href="${supabaseUrl}/accept-invitation?token=${invitation.token}">Terima Undangan</a>
      <p>Tautan ini akan kedaluwarsa dalam 7 hari.</p>
      <p>Jika Anda tidak mengenali pengirim, silakan abaikan email ini.</p>
    `);

    // Update invitation to mark as sent
    await supabase
      .from("invitations")
      .update({ status: "sent" })
      .eq("id", invitationId);

    return new Response(
      JSON.stringify({ success: true, message: "Undangan berhasil dikirim" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error sending invitation:", error);
    
    return new Response(
      JSON.stringify({ error: "Gagal mengirim undangan" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
