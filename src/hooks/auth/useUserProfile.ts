
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  
  const getUserOrganization = async (userId: string) => {
    if (!userId) return null;
    
    setIsLoading(true);
    try {
      // Fetch user profile with organization data
      const { data, error } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserOrganization:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    getUserOrganization,
    isLoading
  };
}
