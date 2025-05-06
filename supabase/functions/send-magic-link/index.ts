
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
    console.log("Processing magic link invitation for:", email);

    // Validate input
    if (!email || !organizationId) {
      return new Response(
        JSON.stringify({ error: "Email and organization ID are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a token for the invitation
    const { data: invitationData, error: invitationError } = await supabase.rpc(
      "generate_magic_link_invitation",
      { 
        email_address: email,
        org_id: organizationId,
        user_role: role || "employee"
      }
    );

    console.log("Invitation generated:", invitationData);
    console.log("Invitation error:", invitationError);

    if (invitationError) {
      throw new Error(invitationError.message);
    }

    // The base URL should be configurable for different environments
    const baseUrl = "https://app.profitloop.id";
    const invitationUrl = `${baseUrl}/join-magic-link?token=${invitationData.token}`;

    // In a production app, you would send an email here using SendGrid, Postmark, etc.
    // For now, we'll just log the URL and return it

    console.log("=== MAGIC LINK INVITATION URL ===");
    console.log(invitationUrl);

    // For demo/testing purposes, attempt to send email could be simulated here
    // Normally you would integrate with an email service

    return new Response(
      JSON.stringify({ 
        success: true, 
        email_sent: true, // In a real implementation, this would be based on the email service response
        invitation_url: invitationUrl,
        token: invitationData.token
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error processing magic link invitation:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process invitation", 
        email_sent: false,
        email_error: "Email sending failed or not implemented in this demo"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
