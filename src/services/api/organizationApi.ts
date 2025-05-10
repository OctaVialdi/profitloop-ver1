
import { supabase } from "@/integrations/supabase/client";
import { OrganizationFormData } from "@/types/onboarding";
import { toast } from "@/components/ui/sonner";
import { Organization } from "@/types/organization";

/**
 * Checks if the user already has an organization or has created one previously
 */
export const checkExistingOrganization = async (userId: string, userEmail?: string | null) => {
  try {
    // First try to check session metadata - most reliable and avoids RLS
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.user_metadata?.organization_id) {
      return { 
        hasOrganization: true, 
        emailVerified: true, 
        organizationId: session.user.user_metadata.organization_id 
      };
    }
    
    // Check email verification using auth data directly
    if (session?.user) {
      const isEmailVerified = session.user.email_confirmed_at !== null;
      
      if (!isEmailVerified) {
        return { hasOrganization: false, emailVerified: false, organizationId: null };
      }
    }
    
    // Skip profile querying and try a direct check on the organizations table
    if (userEmail) {
      try {
        const { data: orgCreatorData, error: orgCreatorError } = await supabase
          .from('organizations')
          .select('id')
          .eq('creator_email', userEmail.toLowerCase())
          .maybeSingle();
        
        if (!orgCreatorError && orgCreatorData) {
          console.log("This email has already created an organization:", orgCreatorData.id);
          return { hasOrganization: true, emailVerified: true, organizationId: orgCreatorData.id };
        }
      } catch (error) {
        console.error("Error checking organization by email:", error);
      }
    }

    // Default to assuming email is verified if we got this far
    return { hasOrganization: false, emailVerified: true, organizationId: null };
  } catch (error) {
    console.error("Error checking existing organization:", error);
    // Return default fallback values
    return { hasOrganization: false, emailVerified: true, organizationId: null };
  }
};

/**
 * Updates user's profile with the given organization ID
 */
export const updateUserWithOrganization = async (userId: string, organizationId: string, role: string = 'super_admin') => {
  try {
    // First update user metadata - this avoids RLS issues
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        organization_id: organizationId,
        role: role
      }
    });
      
    if (metadataError) {
      console.error("Error updating user metadata:", metadataError);
    }
    
    // Try using the RPC function to update profile
    try {
      const { data, error } = await supabase.rpc('update_user_organization', {
        user_id: userId,
        org_id: organizationId,
        user_role: role
      });
      
      if (error) {
        console.error("Error using RPC to update profile:", error);
        return false;
      }
      
      return true;
    } catch (rpcError) {
      console.error("RPC error updating organization:", rpcError);
    }
    
    // Even if the profile update fails, user can still proceed with metadata
    return true;
  } catch (error) {
    console.error("Error updating user with organization:", error);
    return false;
  }
};

// Update organization data (fixed the issue with insert function)
export const updateOrganizationData = async (orgData: Partial<Organization>) => {
  if (!orgData.id) {
    console.error('Organization ID is required for update');
    return { error: 'Organization ID is required', data: null };
  }
  
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(orgData)
      .eq('id', orgData.id)
      .select()
      .single();
      
    if (error) throw error;
    return { error: null, data };
  } catch (error) {
    console.error("Error updating organization:", error);
    return { error, data: null };
  }
};

// Fix the insert function
export const createOrganization = async (orgData: OrganizationFormData) => {
  // Ensure we're working with a valid object, not an array
  const organizationData = {
    name: orgData.name, // Ensure name is always provided
    business_field: orgData.businessField,
    employee_count: orgData.employeeCount ? parseInt(orgData.employeeCount) : null,
    address: orgData.address || null,
    phone: orgData.phone || null
  };
  
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organizationData)
      .select()
      .single();
      
    if (error) throw error;
    return { error: null, data };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { error, data: null };
  }
};
