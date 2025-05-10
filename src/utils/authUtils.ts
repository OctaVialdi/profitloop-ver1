
export async function robustSignOut() {
  try {
    // Clean up any auth-related localStorage items
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clean up any auth-related sessionStorage items
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });

    // Attempt to sign out from Supabase with global scope
    const { error } = await fetch('https://nqbcxrujjxwgoyjxmmla.supabase.co/auth/v1/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmN4cnVqanh3Z295anhtbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjA3ODAsImV4cCI6MjA2MTU5Njc4MH0.ksytXhQEPyaHVNCmmFd45FgC58Nyn3MOkSdioIqUiwQ'
      },
    }).then(res => res.json());

    if (error) {
      console.error('Error during sign out:', error);
    }

    // Remove any blur effect that might be applied
    document.body.classList.remove('trial-expired');
    
    // Clear any user-related cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    return true;
  } catch (err) {
    console.error('Robust sign out failed:', err);
    return false;
  }
}

// Add the missing cleanupAuthState function
export function cleanupAuthState() {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if it exists
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
  
  // Remove any blur effect that might be applied
  document.body.classList.remove('trial-expired');
}
