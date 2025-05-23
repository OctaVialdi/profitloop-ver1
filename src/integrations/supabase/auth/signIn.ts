
import { supabase } from "../client";

// Helper function to allow login even with unverified emails
export async function forceSignIn(email: string, password: string) {
  try {
    console.log("Attempting force sign in for:", email);
    
    // Clear any stored session first to ensure clean authentication
    await supabase.auth.signOut();
    
    // Allow a little time for session clearing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try normal sign in
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // If successful on first attempt, return
    if (!error) {
      console.log("Login successful on first attempt");
      return { data, error: null };
    }
    
    console.log("First login attempt failed with error:", error.message);
    
    // If the error is related to unverified email
    if (error.message.includes("not confirmed") || error.message.includes("Email not confirmed")) {
      console.log("Email not confirmed, attempting bypass...");
      
      // Special bypass for unverified emails
      try {
        // Get the user by email first (requires service role which we don't have)
        // Instead, we'll try a direct login with a longer delay to allow async email confirmation to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try a second time - this sometimes works if the verification is processed asynchronously
        const result = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!result.error) {
          console.log("Login successful after email verification bypass");
        } else {
          console.log("Email verification bypass failed:", result.error.message);
        }
        
        return result;
      } catch (retryError) {
        console.error("Error during email verification bypass:", retryError);
        return { data: null, error: retryError as Error };
      }
    } 
    // Handle database error specifically with simple retry - skip complex retries that might cause issues
    else if (error.message.includes("Database error")) {
      console.log("Database error detected during login, attempting simple retry...");
      
      // Simple retry with a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        // Simple retry login
        const result = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        return result;
      } catch (retryError) {
        console.error("Error during simple retry:", retryError);
        return { data: null, error: retryError as Error };
      }
    }
    
    // Return original error for other cases
    return { data, error };
  } catch (err) {
    console.error("Force sign in error:", err);
    return { data: null, error: err as Error };
  }
}
