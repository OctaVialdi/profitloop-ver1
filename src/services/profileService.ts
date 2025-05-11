
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

  async ensureProfileExists(userId: string, profileData: {
    email: string;
    full_name?: string | null;
    email_verified?: boolean;
  }): Promise<boolean> {
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (existingProfile) {
        // Profile exists, just update it
        await supabase
          .from('profiles')
          .update({
            email: profileData.email,
            full_name: profileData.full_name || null,
            email_verified: profileData.email_verified || false
          })
          .eq('id', userId);
        
        return true;
      }
      
      // Profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: profileData.email,
          full_name: profileData.full_name || null,
          email_verified: profileData.email_verified || false
        });
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in ensureProfileExists:", error);
      return false;
    }
  }
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.getProfile(userId);
  }
}

export const profileService = new ProfileService();
export const { ensureProfileExists, getUserProfile } = profileService;
