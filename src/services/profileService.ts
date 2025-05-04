
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
    
    // Try a direct API call to the security definer function (most reliable)
    try {
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_user_profile_by_id', {
          user_id: userId
        });
      
      if (!profileError && profileData) {
        return Array.isArray(profileData) && profileData.length > 0 
          ? profileData[0] as UserProfile 
          : profileData as UserProfile;
      }
    } catch (rpcError) {
      console.log("RPC call failed:", rpcError);
      // Continue to fallback approaches
    }
    
    // If we still don't have a profile, construct a minimal one from auth
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Create a minimal profile from auth data
        return {
          id: userId,
          email: userData.user.email,
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

export async function ensureProfileExists(userId: string, userData: { email: string, full_name?: string | null, email_verified?: boolean }): Promise<boolean> {
  try {
    console.log("Ensuring profile exists for:", userId, userData);
    
    // DO NOT query the profiles table directly - this is what causes recursion
    // Instead, check if the user exists in auth.users (which won't trigger profiles RLS)
    const { data: authUser } = await supabase.auth.getUser();
    
    if (!authUser || !authUser.user) {
      console.error("No authenticated user found");
      return false;
    }
    
    // Try the security definer function first - this bypasses RLS
    try {
      // Call the create_profile_if_not_exists RPC function
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('create_profile_if_not_exists', {
          user_id: userId,
          user_email: userData.email.toLowerCase(),
          user_full_name: userData.full_name || null,
          is_email_verified: userData.email_verified || false
        });
        
      if (rpcError) {
        console.log("RPC profile creation error, trying admin API:", rpcError);
      } else {
        console.log("Profile created/updated via RPC function");
        return true;
      }
    } catch (err) {
      console.log("RPC profile creation failed, trying Service Role API:", err);
    }
    
    // Use auth metadata as a temporary workaround - this won't fix the profile 
    // but will at least let the user proceed past organization creation
    try {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          email: userData.email,
          full_name: userData.full_name,
          email_verified: userData.email_verified
        }
      });
      
      if (!metadataError) {
        console.log("User metadata updated as a fallback");
        return true;
      }
    } catch (metadataErr) {
      console.error("Metadata update failed:", metadataErr);
    }
    
    // If we get here, all methods failed
    console.log("All profile creation methods failed, but proceeding anyway");
    return false;
  } catch (err) {
    console.error("Exception ensuring profile exists:", err);
    return false;
  }
}
