
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Get environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    const { invitationId, baseUrl } = await req.json();
    
    if (!invitationId) {
      return new Response(
        JSON.stringify({ error: "Missing invitation ID" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Create Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch the invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from("magic_link_invitations")
      .select(`
        id, email, token, role,
        organization:organization_id (name)
      `)
      .eq("id", invitationId)
      .eq("status", "pending")
      .single();
    
    if (invitationError || !invitation) {
      console.error("Error fetching invitation:", invitationError);
      return new Response(
        JSON.stringify({ error: "Invitation not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Get the sender details
    const { data: sender, error: senderError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("organization_id", invitation.organization.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    
    const senderName = sender?.full_name || "The team";
    
    // In a real app, you would use a service like SendGrid or a similar email provider
    // For this demo, we'll just log the email details
    console.log("=== EMAIL INVITATION DETAILS ===");
    console.log(`To: ${invitation.email}`);
    console.log(`Subject: You've been invited to join ${invitation.organization.name}`);
    
    // Create the magic link URL
    const invitationUrl = `${baseUrl}/accept-magic-invitation?token=${invitation.token}&email=${encodeURIComponent(invitation.email)}`;
    
    console.log(`
      <h1>You've been invited to join ${invitation.organization.name}</h1>
      <p>Hello,</p>
      <p>${senderName} has invited you to join ${invitation.organization.name} as a ${invitation.role}.</p>
      <p>Click the link below to accept this invitation and join the organization:</p>
      <a href="${invitationUrl}">Accept invitation</a>
      <p>This invitation link will expire in 7 days.</p>
      <p>If you don't recognize this invitation, please ignore this email.</p>
    `);
    
    // Update the invitation status to sent
    await supabase
      .from("magic_link_invitations")
      .update({ status: "sent" })
      .eq("id", invitationId);
    
    return new Response(
      JSON.stringify({ success: true, message: "Invitation email sent" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error processing invitation:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send invitation" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
