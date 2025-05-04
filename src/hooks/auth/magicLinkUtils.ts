
import { supabase } from "@/integrations/supabase/client";

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
    // First try validating against magic_link_invitations table directly
    const { data: magicLinkData, error: magicLinkError } = await supabase
      .from('magic_link_invitations')
      .select('id, organization_id, role, email, status, expires_at')
      .eq('token', token)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!magicLinkError && magicLinkData) {
      console.log("Magic link found directly in table:", magicLinkData);
      
      // Check if email matches if provided
      if (email && email !== magicLinkData.email) {
        return {
          valid: false,
          message: "Email undangan tidak sesuai"
        };
      }
      
      return {
        valid: true,
        organizationId: magicLinkData.organization_id,
        role: magicLinkData.role
      };
    }
    
    // If not found in direct table check, try the RPC function
    const { data: validationResult, error: validationError } = await supabase.rpc(
      'validate_invitation',
      { 
        invitation_token: token,
        invitee_email: email || ""
      }
    );

    console.log("Magic link validation result:", validationResult, validationError);

    if (validationError) {
      return { 
        valid: false, 
        message: validationError.message 
      };
    }

    if (validationResult && validationResult[0]?.valid) {
      return {
        valid: true,
        organizationId: validationResult[0].organization_id,
        role: validationResult[0].role
      };
    }

    return {
      valid: false,
      message: validationResult?.[0]?.message || "Token tidak valid"
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
