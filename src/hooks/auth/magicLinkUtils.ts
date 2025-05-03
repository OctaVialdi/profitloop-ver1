
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
    const { data: magicLinkData, error: magicLinkError } = await supabase.rpc(
      'validate_invitation',
      { 
        invitation_token: token,
        invitee_email: email || ""
      }
    );

    console.log("Magic link validation result:", magicLinkData, magicLinkError);

    if (magicLinkError) {
      return { 
        valid: false, 
        message: magicLinkError.message 
      };
    }

    if (magicLinkData && magicLinkData[0]?.valid) {
      return {
        valid: true,
        organizationId: magicLinkData[0].organization_id,
        role: magicLinkData[0].role
      };
    }

    return {
      valid: false,
      message: magicLinkData?.[0]?.message || "Token tidak valid"
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
