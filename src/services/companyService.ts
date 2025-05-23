
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Company Profile Types
export interface CompanyProfile {
  id: string;
  organization_id: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  established?: string;
  employees?: number;
  tax_id?: string;
}

export interface CompanyMissionVision {
  id: string;
  organization_id: string;
  mission?: string;
  vision?: string;
}

// Modified: Removed CompanyDepartment interface and added OrganizationName
export interface OrganizationName {
  organization_name: string;
}

export interface CompanyValue {
  id: string;
  organization_id: string;
  value: string;
  order_index: number;
}

export interface CompanyData {
  organization: {
    id: string;
    name: string;
  };
  profile: CompanyProfile | null;
  missionVision: CompanyMissionVision | null;
  departments: OrganizationName[]; // Changed type to OrganizationName[]
  values: CompanyValue[];
}

// Fetch all company data for a given organization
export const fetchCompanyData = async (organizationId: string): Promise<CompanyData | null> => {
  try {
    // Fetch organization
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("id", organizationId)
      .single();

    if (orgError) throw orgError;

    // Fetch company profile
    const { data: profileData, error: profileError } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") throw profileError;
    
    // Fetch mission and vision
    const { data: missionVisionData, error: missionVisionError } = await supabase
      .from("company_mission_vision")
      .select("*")
      .eq("organization_id", organizationId)
      .maybeSingle();
    
    if (missionVisionError && missionVisionError.code !== "PGRST116") throw missionVisionError;
    
    // Modified: Fetch departments from employee_employment instead of company_departments
    const { data: departmentsData, error: departmentsError } = await supabase
      .rpc("get_unique_organization_names", { org_id: organizationId });
    
    if (departmentsError) throw departmentsError;
    
    // Fetch values
    const { data: valuesData, error: valuesError } = await supabase
      .from("company_values")
      .select("*")
      .eq("organization_id", organizationId)
      .order("order_index");
    
    if (valuesError) throw valuesError;
    
    return {
      organization: orgData,
      profile: profileData,
      missionVision: missionVisionData,
      departments: departmentsData || [],
      values: valuesData || []
    };
  } catch (error) {
    console.error("Error fetching company data:", error);
    toast.error("Failed to load company data");
    return null;
  }
};

// Save or update company profile
export const saveCompanyProfile = async (
  profile: { organization_id: string } & Partial<Omit<CompanyProfile, 'id' | 'organization_id'>>
): Promise<CompanyProfile | null> => {
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    let result;

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("company_profiles")
        .update(profile)
        .eq("id", existingProfile.id)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from("company_profiles")
        .insert(profile)
        .select("*")
        .single();

      if (error) throw error;
      result = data;
    }

    toast.success("Company profile saved successfully");
    return result;
  } catch (error) {
    console.error("Error saving company profile:", error);
    toast.error("Failed to save company profile");
    return null;
  }
};

// Update organization name
export const updateOrganizationName = async (
  organizationId: string,
  name: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("organizations")
      .update({ name })
      .eq("id", organizationId);

    if (error) throw error;
    toast.success("Organization name updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating organization name:", error);
    toast.error("Failed to update organization name");
    return false;
  }
};

// Save or update mission and vision
export const saveMissionVision = async (
  missionVision: { organization_id: string } & Partial<Omit<CompanyMissionVision, 'id' | 'organization_id'>>
): Promise<CompanyMissionVision | null> => {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from("company_mission_vision")
      .select("id")
      .eq("organization_id", missionVision.organization_id)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    let result;
    
    if (existingData) {
      // Update existing data
      const { data, error } = await supabase
        .from("company_mission_vision")
        .update(missionVision)
        .eq("id", existingData.id)
        .select("*")
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Create new data
      const { data, error } = await supabase
        .from("company_mission_vision")
        .insert(missionVision)
        .select("*")
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error("Error saving mission & vision:", error);
    toast.error("Failed to save mission & vision");
    return null;
  }
};

// Removed: addDepartment and deleteDepartment functions as departments now come from employee_employment

// Add a new company value
export const addCompanyValue = async (
  companyValue: Omit<CompanyValue, "id" | "order_index">,
  order: number
): Promise<CompanyValue | null> => {
  try {
    const valueWithOrder = {
      ...companyValue,
      order_index: order
    };
    
    const { data, error } = await supabase
      .from("company_values")
      .insert(valueWithOrder)
      .select("*")
      .single();
      
    if (error) throw error;
    toast.success("Company value added successfully");
    return data;
  } catch (error) {
    console.error("Error adding company value:", error);
    toast.error("Failed to add company value");
    return null;
  }
};

// Delete a company value
export const deleteCompanyValue = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("company_values")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    toast.success("Company value removed successfully");
    return true;
  } catch (error) {
    console.error("Error deleting company value:", error);
    toast.error("Failed to remove company value");
    return false;
  }
};

// Upload company logo
export const uploadCompanyLogo = async (
  organizationId: string,
  file: File
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${organizationId}/logo-${Date.now()}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('company-logos')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data } = supabase
      .storage
      .from('company-logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading logo:", error);
    toast.error("Failed to upload logo");
    return null;
  }
};
