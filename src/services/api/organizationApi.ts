
import { supabase } from "@/integrations/supabase/client";
import { OrganizationFormData } from "@/types/onboarding";
import { toast } from "@/components/ui/sonner";

/**
 * Checks if the user already has an organization or has created one previously
 */
export const checkExistingOrganization = async (userId: string, userEmail?: string | null) => {
  try {
    // First try to check session metadata
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.user_metadata?.organization_id) {
      return { 
        hasOrganization: true, 
        emailVerified: true, 
        organizationId: session.user.user_metadata.organization_id 
      };
    }
    
    // Check if user's profile has an organization
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id, email_verified')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error checking profile:", profileError);
      
      // If there's an infinite recursion error, assume email is verified
      // but no organization yet so we can continue to organization setup
      if (profileError.message.includes("infinite recursion")) {
        return { 
          hasOrganization: false, 
          emailVerified: true,  // Assume verified to continue flow
          organizationId: null 
        };
      }
      
      toast.error("Terjadi kesalahan saat memeriksa profil");
      return { hasOrganization: false, emailVerified: false, organizationId: null };
    }
    
    // Check if email is verified
    if (!profileData?.email_verified) {
      console.log("Email not verified");
      return { hasOrganization: false, emailVerified: false, organizationId: null };
    }

    // If user already has an organization in their profile
    if (profileData?.organization_id) {
      return { hasOrganization: true, emailVerified: true, organizationId: profileData.organization_id };
    }

    // Also check if this email has already created an organization
    if (userEmail) {
      try {
        const { data: orgCreatorData, error: orgCreatorError } = await supabase
          .from('organizations')
          .select('id')
          .eq('creator_email', userEmail.toLowerCase())
          .maybeSingle();
        
        if (orgCreatorError) {
          console.error("Error checking if email has created organization:", orgCreatorError);
        } else if (orgCreatorData) {
          console.log("This email has already created an organization:", orgCreatorData.id);
          return { hasOrganization: true, emailVerified: true, organizationId: orgCreatorData.id };
        }
      } catch (error) {
        console.error("Error checking organization by email:", error);
      }
    }

    return { hasOrganization: false, emailVerified: true, organizationId: null };
  } catch (error) {
    console.error("Error checking existing organization:", error);
    throw error;
  }
};

/**
 * Updates user's profile with the given organization ID
 */
export const updateUserWithOrganization = async (userId: string, organizationId: string, role: string = 'super_admin') => {
  try {
    // First update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        organization_id: organizationId,
        role: role
      }
    });
      
    if (metadataError) {
      console.error("Error updating user metadata:", metadataError);
    }
    
    // Then update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        organization_id: organizationId,
        role: role
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating profile with organization:", updateError);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error updating user with organization:", error);
    return false;
  }
};
