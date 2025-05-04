
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/organization";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // First check user session metadata - most reliable source
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id === userId) {
      // Extract from auth metadata if available
      if (session.user.user_metadata) {
        const metadata = session.user.user_metadata;
        
        return {
          id: userId,
          organization_id: metadata.organization_id,
          role: metadata.role,
          email: session.user.email,
          full_name: metadata.full_name || null,
          // Add other fields with defaults
        } as UserProfile;
      }
    }
    
    // Try a direct profiles query first - simpler and less prone to recursion issues
    try {
      const { data: directProfileData, error: directProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (!directProfileError && directProfileData) {
        return directProfileData as UserProfile;
      }
    } catch (directError) {
      console.log("Direct profile query failed, trying RPC function");
    }
    
    // Use our security definer function as fallback
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_user_profile_by_id', {
        user_id: userId
      });
    
    if (profileError) {
      // If we hit recursion issues, try a direct approach with minimal fields
      if (profileError.message.includes("infinite recursion")) {
        // Try a direct query with minimal fields
        const { data: minimalData, error: minimalError } = await supabase.auth.admin
          .getUserById(userId);
          
        if (!minimalError && minimalData) {
          // Create a minimal profile from auth data
          return {
            id: userId,
            email: minimalData.user.email
          } as UserProfile;
        }
      }
      
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
    // Return a minimal profile to avoid breaking the UI
    return {
      id: userId,
    } as UserProfile;
  }
}

export async function ensureProfileExists(userId: string, userData: { email: string, full_name?: string, email_verified?: boolean }): Promise<boolean> {
  try {
    console.log("Ensuring profile exists for:", userId, userData);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing profile:", checkError);
      // Try to create profile anyway as fallback
    }
      
    // If profile doesn't exist or we couldn't check, create it
    if (!existingProfile) {
      console.log("Creating new profile for user:", userId);

      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email.toLowerCase(),
          full_name: userData.full_name || null,
          email_verified: userData.email_verified || false,
          organization_id: null,
          has_seen_welcome: false,
          role: 'employee' // Default role
        })
        .select();
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      }
      
      console.log("Profile created successfully for:", userId);
      return true;
    } else {
      console.log("Profile already exists for:", userId);
    }
    
    return true; // Profile exists
  } catch (err) {
    console.error("Exception ensuring profile exists:", err);
    return false;
  }
}
