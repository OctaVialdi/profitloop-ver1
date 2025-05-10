
import { supabase } from "@/integrations/supabase/client";

/**
 * A robust sign out function that handles edge cases and cleans up auth state
 */
export async function robustSignOut(): Promise<void> {
  try {
    // Clear any local storage items that might contain auth state
    cleanupAuthState();
    
    // Clear cookies that might contain auth info
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Call Supabase signOut method
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error during sign out:", error);
    // Force a page reload if needed to clear React state
    window.location.href = '/auth/login';
  }
}

/**
 * Clean up auth state from localStorage
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
 * Get user-friendly auth error message
 */
export function getAuthErrorMessage(error: any): string {
  // If it's a string already, return it
  if (typeof error === 'string') return error;
  
  // Check for common Supabase error messages
  const message = error?.message || error?.error_description || 'An unknown error occurred';
  
  // Map to user-friendly messages
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address before logging in';
  }
  
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  
  if (message.includes('Email already registered')) {
    return 'This email is already registered. Please log in instead';
  }
  
  if (message.includes('JWT expired')) {
    return 'Your session has expired. Please log in again';
  }
  
  return message;
}

/**
 * Create or update user profile after login
 */
export async function ensureProfileExists(userId: string, userData: {
  email: string;
  full_name: string | null;
  email_verified?: boolean;
}) {
  try {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      // If profile exists, update it
      await supabase
        .from('profiles')
        .update({
          email: userData.email,
          full_name: userData.full_name,
          email_verified: userData.email_verified || false,
          last_active: new Date().toISOString()
        })
        .eq('id', userId);
    } else {
      // If profile doesn't exist, create it
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name,
          email_verified: userData.email_verified || false,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    // Don't throw - just log the error since this is not critical
  }
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
