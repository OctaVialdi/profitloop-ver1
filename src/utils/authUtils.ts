
import { supabase } from "@/integrations/supabase/client";

/**
 * A robust sign out function that handles edge cases and cleans up auth state
 */
export async function robustSignOut(): Promise<void> {
  try {
    // Clear any local storage items that might contain auth state
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('auth-token');
    
    // Clear cookies that might contain auth info
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Call Supabase signOut method
    await supabase.auth.signOut();
    
    // Force a page reload if needed to clear React state
    // window.location.href = '/auth/login';
  } catch (error) {
    console.error("Error during sign out:", error);
    // Force sign out even if the API call failed
    window.location.href = '/auth/login';
  }
}

/**
 * Validate password against security policy
 */
export function validatePassword(password: string): { 
  valid: boolean; 
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Check if contains uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check if contains lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check if contains number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check if contains special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Clean email input (trim and lowercase)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Get password last change date
 */
export async function getPasswordLastChangeDate(userId: string): Promise<Date | null> {
  try {
    // This would normally query the auth_audit_logs table
    // For now, return the current date - 5 days
    return new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  } catch (error) {
    console.error("Error getting password change date:", error);
    return null;
  }
}
