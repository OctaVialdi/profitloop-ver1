
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/organization";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Get user profile using direct query by ID
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_user_profile_by_id', {
        user_id: userId
      })
      .maybeSingle();
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw profileError;
    }
    
    if (!profileData) {
      return null;
    }
    
    // Get full profile data to have complete information
    const { data: fullProfileData, error: fullProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (fullProfileError) {
      console.error("Full profile fetch error:", fullProfileError);
      // Don't throw, continue with limited profile data
    }
    
    // Use full profile if available, otherwise use limited data
    return {
      ...profileData,
      ...(fullProfileData || {})
    } as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
