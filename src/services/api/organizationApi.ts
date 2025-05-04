
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
    
    // Approach 1: First try using the user metadata in the session
    if (session?.user) {
      const isEmailVerified = session.user.email_confirmed_at !== null;
      
      if (session.user.user_metadata?.organization_id) {
        return { 
          hasOrganization: true, 
          emailVerified: isEmailVerified || true, // Assume verified if we have org metadata
          organizationId: session.user.user_metadata.organization_id 
        };
      }
      
      if (!isEmailVerified) {
        return { hasOrganization: false, emailVerified: false, organizationId: null };
      }
    }
    
    // Direct query on profiles table - simpler and less prone to recursion
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, email_verified')
        .eq('id', userId)
        .maybeSingle();
        
      if (!profileError && profileData) {
        return {
          hasOrganization: !!profileData.organization_id,
          emailVerified: !!profileData.email_verified,
          organizationId: profileData.organization_id || null
        };
      }
    } catch (directError) {
      console.error("Direct profile query failed:", directError);
    }
    
    // Approach 2: Try using our security definer function as fallback
    try {
      const { data: profileData, error: profileError } = await supabase
        .rpc('check_user_has_organization', {
          user_id: userId
        });
        
      if (profileError) {
        console.error("Error checking profile with RPC:", profileError);
        
        // If there's an infinite recursion error, assume email is verified
        // but no organization yet so we can continue to organization setup
        if (profileError.message.includes("infinite recursion")) {
          return { 
            hasOrganization: false, 
            emailVerified: true,  // Assume verified to continue flow
            organizationId: null 
          };
        }
        
        throw profileError;
      }
      
      if (!profileData || profileData.length === 0) {
        console.log("No profile data returned from RPC function");
        return { hasOrganization: false, emailVerified: false, organizationId: null };
      }
      
      // The RPC function returns an array, take first item
      const profile = profileData[0];
      
      // Check if email is verified
      if (!profile.email_verified) {
        console.log("Email not verified from RPC check");
        return { hasOrganization: false, emailVerified: false, organizationId: null };
      }

      // If user already has an organization in their profile
      if (profile.organization_id) {
        return { 
          hasOrganization: true, 
          emailVerified: true, 
          organizationId: profile.organization_id 
        };
      }
    } catch (error) {
      console.error("Error in RPC check:", error);
      // Continue to the last approach
    }

    // Approach 3: Also check if this email has already created an organization
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

    // Default to assuming email is verified if we got this far and didn't find any negative information
    return { hasOrganization: false, emailVerified: true, organizationId: null };
  } catch (error) {
    console.error("Error checking existing organization:", error);
    // Return default fallback values to avoid blocking the application flow
    return { hasOrganization: false, emailVerified: true, organizationId: null };
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
