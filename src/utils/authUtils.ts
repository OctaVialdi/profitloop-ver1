
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures a user profile exists in the database
 */
export const ensureProfileExists = async (userId: string, userData: {
  email: string;
  full_name?: string | null;
  email_verified?: boolean;
}) => {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (existingProfile) {
      // Profile exists, update it if needed
      await supabase
        .from('profiles')
        .update({
          email: userData.email,
          full_name: userData.full_name || null,
          email_verified: userData.email_verified || false
        })
        .eq('id', userId);
    } else {
      // Profile doesn't exist, create it
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name || null,
          email_verified: userData.email_verified || false
        });
    }
  } catch (error) {
    console.error("Error ensuring profile exists:", error);
  }
};

/**
 * Cleans up auth state to prevent auth limbo
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};
