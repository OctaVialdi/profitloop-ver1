
/**
 * Utility to thoroughly clean up authentication state
 * Prevents auth limbo states by removing all Supabase auth tokens
 * @param {boolean} [preserveForNavigation=false] - If true, preserves minimal state needed for navigation
 */
export const cleanupAuthState = (preserveForNavigation = false) => {
  console.log("Cleaning up auth state...", preserveForNavigation ? "(preserving navigation state)" : "");
  
  // Log the caller function if possible
  console.log("Auth cleanup called from:", new Error().stack);
  
  if (preserveForNavigation) {
    // Minimal cleanup that won't interrupt navigation
    console.log("Performing minimal cleanup to preserve navigation");
    return;
  }
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`Removing auth key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`Removing session key: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
};
