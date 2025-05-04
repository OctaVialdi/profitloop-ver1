
import { supabase } from "../client";

// Helper function to ensure user profile exists
export async function ensureUserProfileExists(userId: string, userData: { email: string, full_name?: string }) {
  try {
    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error checking profile:", profileError);
      return false;
    }
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      // Get role from user metadata
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || 'employee';
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email.toLowerCase(),
          full_name: userData.full_name || null,
          role: role // Set the role from metadata
        });
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      } else {
        console.log("Profile created successfully with role:", role);
        return true;
      }
    }
    
    return true;
  } catch (err) {
    console.error("Exception ensuring profile exists:", err);
    return false;
  }
}
