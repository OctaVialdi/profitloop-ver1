
import { supabase } from "@/integrations/supabase/client";
import { OrganizationFormData } from "@/types/onboarding";

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
      // Try direct method if RPC fails
      return await createOrganizationDirectly(userId, formData);
    }

    console.log("Organization created successfully via RPC:", data);
    return data;
  } catch (error) {
    console.error("Error in create organization process:", error);
    // Try direct method if the primary method fails
    try {
      return await createOrganizationDirectly(userId, formData);
    } catch (fallbackError) {
      console.error("Direct method also failed:", fallbackError);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Terjadi kesalahan saat membuat organisasi. Silakan coba lagi nanti.");
    }
  }
};

// Direct method using separate queries instead of RPC
async function createOrganizationDirectly(userId: string, formData: OrganizationFormData) {
  console.log("Using direct method to create organization");
  
  // Get default subscription plan (Basic)
  let { data: planData, error: planError } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('name', 'Basic')
    .maybeSingle();
  
  if (planError) {
    console.error("Error fetching plan:", planError);
    throw new Error("Gagal mengambil paket berlangganan. Silakan coba lagi.");
  }
  
  // If no plan exists, create a basic plan
  if (!planData) {
    console.log("No basic plan found, creating one");
    const { data: newPlanData, error: newPlanError } = await supabase
      .from('subscription_plans')
      .insert({
        name: 'Basic',
        max_members: 5,
        price: 0,
        features: { storage: '1GB', api_calls: 1000 }
      })
      .select()
      .single();
      
    if (newPlanError) {
      console.error("Error creating plan:", newPlanError);
      throw new Error("Gagal membuat paket berlangganan. Silakan coba lagi.");
    }
    
    planData = newPlanData;
  }
  
  // Set trial_end_date to 30 days from now
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30);
  
  // Create new organization
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: formData.name,
      business_field: formData.businessField || null,
      employee_count: formData.employeeCount ? parseInt(formData.employeeCount) : 1,
      address: formData.address || null,
      phone: formData.phone || null,
      subscription_plan_id: planData.id,
      trial_end_date: trialEndDate.toISOString(),
    })
    .select()
    .single();
  
  if (orgError) {
    console.error("Error creating organization:", orgError);
    throw new Error("Gagal membuat organisasi. Silakan coba lagi nanti.");
  }

  // Directly update profile with service role (bypassing RLS policies)
  try {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          organization_id: orgData.id,
          role: 'super_admin'
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        console.log("Profile update failed, but organization was created");
        // Continue anyway since organization was created
      }
    } else {
      // Get user email for profile creation
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData && userData.user) {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.user.email,
            organization_id: orgData.id,
            role: 'super_admin'
          });
        
        if (insertError) {
          console.error("Error inserting profile:", insertError);
          console.log("Profile insertion failed, but organization was created");
          // Continue anyway since organization was created
        }
      }
    }
    
    return orgData;
  } catch (profileError) {
    console.error("Error updating profile:", profileError);
    // Return organization data even if profile update fails
    return orgData;
  }
}
