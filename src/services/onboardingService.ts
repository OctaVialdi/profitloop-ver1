
import { supabase } from "@/integrations/supabase/client";
import { OrganizationFormData } from "@/types/onboarding";

export const createOrganization = async (formData: OrganizationFormData) => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // Get default subscription plan (Basic)
  let { data: planData, error: planError } = await supabase
    .from('subscription_plans')
    .select('id')
    .eq('name', 'Basic')
    .single();
  
  if (planError) {
    // If no plan exists, create a basic plan
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
      
    if (newPlanError) throw newPlanError;
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
    throw orgError;
  }

  // Update profile via RPC function
  const { error: profileError } = await supabase.rpc(
    'update_user_organization',
    {
      user_id: user.id,
      org_id: orgData.id,
      user_role: 'super_admin'
    } as any
  );
  
  if (profileError) {
    console.error("Error updating profile:", profileError);
    
    // Fallback method if RPC fails
    const { error: directUpdateError } = await supabase
      .from('profiles')
      .update({
        organization_id: orgData.id,
        role: 'super_admin'
      })
      .eq('id', user.id);
    
    if (directUpdateError) {
      throw directUpdateError;
    }
  }
  
  return orgData;
};
