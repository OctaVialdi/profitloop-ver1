
import { supabase, updateUserOrgMetadata } from "@/integrations/supabase/client";
import { OrganizationFormData } from "@/types/onboarding";

interface OrganizationResponse {
  id: string;
  name: string;
  business_field: string | null;
  employee_count: number | null;
  address: string | null;
  phone: string | null;
  subscription_plan_id: string | null;
  trial_end_date: string | null;
}

export const createOrganization = async (formData: OrganizationFormData) => {
  // Get current user
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error("Authentication error:", sessionError);
    throw new Error("Autentikasi gagal. Silakan coba login kembali.");
  }
  
  const userId = session.user.id;
  
  try {
    console.log("Creating organization with user ID:", userId);
    
    // Using a transaction to ensure all operations succeed or fail together
    const { data, error } = await supabase.rpc('create_organization_with_profile', {
      user_id: userId,
      org_name: formData.name,
      org_business_field: formData.businessField || null,
      org_employee_count: formData.employeeCount ? parseInt(formData.employeeCount) : 1,
      org_address: formData.address || null,
      org_phone: formData.phone || null,
      user_role: 'super_admin'
    });

    if (error) {
      console.error("Error creating organization with RPC:", error);
      throw error;
    }

    // Update JWT with organization_id
    if (data) {
      const organizationData = data as OrganizationResponse;
      await updateUserOrgMetadata(organizationData.id, 'super_admin');
    }

    console.log("Organization created successfully via RPC:", data);
    return data;
  } catch (error) {
    console.error("Error in create organization process:", error);
    throw error;
  }
};
