
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { AuthState } from './types';
import { cleanupAuthState, ensureProfileExists } from '@/utils/authUtils';

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Initial fetch of user
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setState({
          user: session?.user || null,
          session: session || null,
          loading: false,
        });
        
        // Ensure profile exists for authenticated user
        if (session?.user) {
          await ensureProfileExists(session.user.id, session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setState(prev => ({ ...prev, loading: false }));
        
        // Clean up any potentially corrupted auth state
        cleanupAuthState();
      }
    };
    
    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Handle auth state change event
        if (event === 'SIGNED_OUT') {
          // Clean up auth state on sign out
          cleanupAuthState();
        }
        
        setState({
          user: session?.user || null,
          session: session || null,
          loading: false,
        });
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
