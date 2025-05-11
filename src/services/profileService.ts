
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/organization";

class ProfileService {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }
}

export const profileService = new ProfileService();
