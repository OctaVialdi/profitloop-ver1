
import { supabase } from "@/integrations/supabase/client";
import { MagicLinkInvitation } from "@/types/magic-link";

/**
 * Process a magic link invitation token
 */
export async function processMagicLinkToken(userId: string, token: string) {
  console.log("Processing invitation with token:", token);
  
  try {
    // Process the magic link invitation
    const { data: result, error: joinError } = await supabase.rpc(
      'process_magic_link_invitation',
      { 
        invitation_token: token,
        user_id: userId
      }
    );

    if (joinError) {
      console.error("Error processing invitation:", joinError);
      return { 
        success: false, 
        message: joinError.message || "Gagal memproses undangan"
      };
    }

    // Handle the response as JSON object
    const invitationResult = result as { 
      success: boolean, 
      message: string, 
      organization_id?: string, 
      role?: string 
    };

    console.log("Invitation processing result:", invitationResult);

    return {
      success: invitationResult.success,
      message: invitationResult.message,
      organizationId: invitationResult.organization_id,
      role: invitationResult.role
    };
  } catch (error: any) {
    console.error("Error processing invitation:", error);
    return { 
      success: false, 
      message: error.message || "Terjadi kesalahan saat memproses undangan" 
    };
  }
}

/**
 * Validate an invitation token
 */
export async function validateInvitationToken(token: string, email: string) {
  try {
    // Query the magic_link_invitations table directly
    const { data, error } = await supabase
      .from('magic_link_invitations')
      .select(`
        id, 
        organization_id, 
        email, 
        role, 
        status, 
        expires_at,
        organizations(name)
      `)
      .eq('token', token)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking invitation:", error);
      return { 
        valid: false, 
        message: error.message 
      };
    }
    
    if (!data) {
      return {
        valid: false,
        message: "Token tidak valid"
      };
    }
    
    const invitation = data as MagicLinkInvitation;
    
    // Check if invitation is valid
    if (email && invitation.email !== email) {
      return {
        valid: false,
        message: "Email tidak sesuai dengan undangan"
      };
    }
    
    if (invitation.status !== 'pending') {
      return {
        valid: false,
        message: "Undangan sudah digunakan"
      };
    }
    
    if (new Date(invitation.expires_at) < new Date()) {
      return {
        valid: false,
        message: "Undangan sudah kadaluarsa"
      };
    }
    
    // Invitation is valid
    return {
      valid: true,
      organizationId: invitation.organization_id,
      role: invitation.role
    };
  } catch (error: any) {
    console.error("Error validating token:", error);
    return { 
      valid: false, 
      message: error.message 
    };
  }
}

/**
 * Get organization name by ID
 */
export async function getOrganizationName(organizationId: string): Promise<string> {
  try {
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .maybeSingle();

    return orgData?.name || "";
  } catch (error) {
    console.error("Error fetching organization name:", error);
    return "";
  }
}
