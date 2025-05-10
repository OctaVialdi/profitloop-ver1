
import { supabase } from "@/integrations/supabase/client";

/**
 * Process a magic link invitation token
 */
export async function processMagicLinkToken(userId: string, token: string) {
  console.log("Processing invitation with token:", token);
  
  try {
    // Process the magic link invitation
    // Karena tabel magic_link_invitations sudah dihapus, kita return success false
    console.log("Error: magic_link_invitations table not available");
    return { 
      success: false, 
      message: "Fitur magic link tidak tersedia" 
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
    // Karena tabel magic_link_invitations sudah dihapus, kita return valid false
    console.log("Error: magic_link_invitations table not available");
    return { 
      valid: false, 
      message: "Fitur magic link tidak tersedia" 
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
