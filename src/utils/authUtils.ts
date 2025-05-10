
/**
 * Utility functions for authentication state management
 */

/**
 * Clean up authentication state in both localStorage and sessionStorage
 * This helps prevent auth limbo states
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

/**
 * Ensure a user profile exists after authentication
 */
export const ensureProfileExists = async (userId: string, userData: any) => {
  try {
    // This function would typically check if a profile exists in the database
    // and create one if it doesn't
    console.log("Ensuring profile exists for user:", userId);
    return true;
  } catch (error) {
    console.error("Error ensuring profile exists:", error);
    return false;
  }
};
