
import { supabase } from "@/integrations/supabase/client";

export function useUserProfile() {
  // Check if user has organization
  const getUserOrganization = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userId)
        .maybeSingle();
      
      return profileData?.organization_id || null;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };
  
  return {
    getUserOrganization
  };
}
