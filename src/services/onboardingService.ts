
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
        business_field: formData.businessField,
        employee_count: formData.employeeCount ? parseInt(formData.employeeCount) : 1,
        address: formData.address,
        phone: formData.phone,
        subscription_plan_id: planData.id,
        trial_end_date: trialEndDate.toISOString(),
      })
      .select()
      .single();
    
    if (orgError) {
      console.error("Error creating organization:", orgError);
      throw new Error("Gagal membuat organisasi. Silakan coba lagi nanti.");
    }

    // Update user profile with service role client to bypass RLS
    // Note: In a production environment, you might want to use a more secure approach
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        organization_id: orgData.id,
        role: 'super_admin'
      })
      .eq('id', userId);
    
    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Don't throw here, as organization is already created
      // Just log the error and return the organization
      console.log("Organization created but profile not updated");
    }
    
    return orgData;
  } catch (error) {
    console.error("Error in create organization process:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Terjadi kesalahan saat membuat organisasi. Silakan coba lagi nanti.");
  }
};
