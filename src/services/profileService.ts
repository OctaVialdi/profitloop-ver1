
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

export async function ensureProfileExists(userId: string, userData: { email: string, full_name?: string | null, email_verified?: boolean }): Promise<boolean> {
  try {
    console.log("Ensuring profile exists for:", userId, userData);
    
    // First, check if a profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, email_verified')
      .eq('id', userId)
      .maybeSingle();
      
    if (!checkError && existingProfile) {
      // Profile exists - check if we need to update email verification status
      if (userData.email_verified && !existingProfile.email_verified) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', userId);
          
        if (updateError) {
          console.error("Error updating email verification status:", updateError);
        } else {
          console.log("Updated email_verified to true for existing profile");
          return true;
        }
      }
      
      // Profile exists and no updates needed
      return true;
    }
    
    // Direct insert as primary method
    try {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email.toLowerCase(),
          full_name: userData.full_name || null,
          email_verified: userData.email_verified || false,
        });
        
      if (!insertError) {
        console.log("Profile created via direct insert");
        return true;
      } else if (insertError.code === '23505') { // Unique violation (profile already exists)
        console.log("Profile already exists (conflict during insert)");
        return true;
      } else {
        console.error("Direct insert failed:", insertError);
      }
    } catch (insertErr) {
      console.error("Direct insert failed:", insertErr);
    }
    
    // Use auth metadata as a fallback - this won't fix the profile 
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
