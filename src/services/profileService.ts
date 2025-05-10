import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/organization";
import { Json } from "@/integrations/supabase/types";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // First check user session metadata - most reliable source
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id === userId) {
      // Extract from auth metadata if available
      if (session.user.user_metadata) {
        const metadata = session.user.user_metadata;
        const isEmailVerified = session.user.email_confirmed_at !== null;
        
        return {
          id: userId,
          organization_id: metadata.organization_id,
          role: metadata.role,
          email: session.user.email,
          email_verified: isEmailVerified,
          full_name: metadata.full_name || null,
          // Add other fields with defaults
        } as UserProfile;
      }
    }
    
    // Try a direct API call to get profile data
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!profileError && profileData) {
        return profileData as UserProfile;
      }
    } catch (directError) {
      console.error("Direct profile query failed:", directError);
    }
    
    // If we still don't have a profile, construct a minimal one from auth
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const isEmailVerified = userData.user.email_confirmed_at !== null;
        
        // Create a minimal profile from auth data
        return {
          id: userId,
          email: userData.user.email,
          email_verified: isEmailVerified,
          full_name: userData.user.user_metadata?.full_name,
          role: userData.user.user_metadata?.role || 'employee',
          organization_id: userData.user.user_metadata?.organization_id
        } as UserProfile;
      }
    } catch (authError) {
      console.error("Error getting user auth data:", authError);
    }
    
    // Last resort - minimal profile with just ID
    return { id: userId } as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Return a minimal profile to avoid breaking the UI
    return {
      id: userId,
    } as UserProfile;
  }
}

export async function updateUserProfile(
  userId: string, 
  data: { 
    full_name?: string; 
    timezone?: string; 
    preferences?: Record<string, any>; 
    profile_image?: string | null;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_user_profile_with_password', {
      user_id: userId,
      full_name: data.full_name || null,
      timezone: data.timezone || null,
      preferences: data.preferences || null,
      profile_image: data.profile_image || null,
      current_password: null,
      new_password: null
    });
    
    if (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception updating user profile:", err);
    return false;
  }
}

// Handle the custom create_profile_if_not_exists function which was causing TypeScript errors
export async function ensureProfileExists(userId: string, userData: { email: string, full_name?: string | null, email_verified?: boolean }): Promise<boolean> {
  try {
    console.log("Ensuring profile exists for:", userId, userData);
    
    // First try the edge function for most reliable profile creation
    try {
      const { data, error } = await supabase.functions.invoke('create-profile-if-not-exists', {
        body: {
          user_id: userId,
          user_email: userData.email.toLowerCase(),
          user_full_name: userData.full_name,
          is_email_verified: userData.email_verified
        }
      });
      
      if (!error && data && (data.status === 'created' || data.status === 'exists' || data.status === 'updated')) {
        console.log("Profile created/updated via edge function:", data);
        return true;
      } else if (error) {
        console.error("Edge function error:", error);
      }
    } catch (edgeFuncError) {
      console.error("Edge function call failed:", edgeFuncError);
    }
    
    // Direct insert as a fallback strategy
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: userData.email.toLowerCase(),
        full_name: userData.full_name || null,
        email_verified: userData.email_verified || false
      }, {
        onConflict: 'id'
      });
      
    if (upsertError) {
      console.error("Error upserting profile:", upsertError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception ensuring profile exists:", err);
    return false;
  }
}
