
/**
 * Utility functions for authentication state management
 */

/**
 * Cleans up all authentication-related data from localStorage and sessionStorage
 * This helps prevent authentication limbo states when session tokens become invalid
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
  
  console.log("Authentication state cleaned up");
};

/**
 * Performs a robust sign out operation that ensures all auth state is properly cleared
 */
export const robustSignOut = async () => {
  try {
    // Import supabase client directly to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Clean up existing auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error("Global sign out failed, but cleanup was performed:", err);
      // Continue even if this fails since we've already cleaned up local state
    }
    
    return true;
  } catch (error) {
    console.error("Error during robust sign out:", error);
    return false;
  }
};
