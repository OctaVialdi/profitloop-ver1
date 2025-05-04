
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/organization";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Use our security definer function to avoid recursion
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_user_profile_by_id', {
        user_id: userId
      });
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw profileError;
    }
    
    // If no profile data was returned, return null
    if (!profileData || (Array.isArray(profileData) && profileData.length === 0)) {
      return null;
    }
    
    // The function returns a set, so we need to handle both single object and array
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    
    return profile as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
