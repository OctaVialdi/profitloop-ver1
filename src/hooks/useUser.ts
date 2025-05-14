
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing user session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    getUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Only set user state using the session's user 
        setUser(session?.user || null);
      }
    );
    
    // Clean up subscription when unmounting
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { user, loading };
}
