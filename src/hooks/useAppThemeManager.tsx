
import { useState, useEffect } from 'react';
import { useOrganization } from './useOrganization';
import { supabase } from '@/integrations/supabase/client';
import { saveThemeToDatabase } from '@/integrations/supabase/profiles/preferences';
import { toast } from '@/components/ui/sonner';

interface Theme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  sidebar_color: string;
}

interface ThemeManagerReturn {
  theme: Theme;
  updateTheme: (updates: Partial<Theme>) => Promise<void>;
  isLoading: boolean;
  uploadLogo: (file: File) => Promise<{ success: boolean; path?: string; error?: string }>;
  logoUrl: string | null;
  uploadError: string | null;
  isUploading: boolean;
}

export const defaultTheme: Theme = {
  primary_color: '#1E40AF', // dark blue
  secondary_color: '#3B82F6', // blue
  accent_color: '#60A5FA', // light blue
  sidebar_color: '#F1F5F9', // light slate
};

export const useAppThemeManager = (): ThemeManagerReturn => {
  const { organization, refreshData } = useOrganization();
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load theme settings
  useEffect(() => {
    if (organization) {
      setIsLoading(true);
      const orgThemeSettings = organization.theme_settings as any;
      
      if (orgThemeSettings) {
        // Merge default theme with saved theme settings
        const mergedTheme = {
          ...defaultTheme,
          ...orgThemeSettings,
        };
        setTheme(mergedTheme);
      }
      
      // Set logo URL if available
      if (organization.logo_path) {
        setLogoUrl(organization.logo_path);
      }
      
      setIsLoading(false);
    }
  }, [organization]);

  // Update theme in state and database
  const updateTheme = async (updates: Partial<Theme>): Promise<void> => {
    try {
      if (!organization) {
        throw new Error('No organization found');
      }
      
      // Update local state
      const updatedTheme = { ...theme, ...updates };
      setTheme(updatedTheme);
      
      // Save to database
      const success = await saveThemeToDatabase(organization.id, updatedTheme);
      
      if (success) {
        toast.success('Theme updated successfully');
        // Refresh organization data to get the updated theme
        await refreshData();
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error: any) {
      console.error('Error updating theme:', error);
      toast.error(`Failed to update theme: ${error.message}`);
      
      // Revert to previous theme on error
      if (organization?.theme_settings) {
        setTheme({ ...defaultTheme, ...(organization.theme_settings as any) });
      }
    }
  };

  // Upload logo function
  const uploadLogo = async (file: File): Promise<{ success: boolean; path?: string; error?: string }> => {
    if (!organization) {
      return { success: false, error: 'No organization found' };
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organization.id}-logo-${Date.now()}.${fileExt}`;
      const filePath = `organizations/${organization.id}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('organization_assets')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('organization_assets')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlData?.publicUrl;
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      // Update organization with logo path
      const orgUpdate = {
        logo_path: publicUrl
      };
      
      const { error: updateError } = await supabase
        .from('organizations')
        .update(orgUpdate)
        .eq('id', organization.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setLogoUrl(publicUrl);
      toast.success('Logo updated successfully');
      await refreshData();
      
      return { success: true, path: publicUrl };
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      setUploadError(error.message || 'Failed to upload logo');
      toast.error(`Failed to upload logo: ${error.message}`);
      
      return { success: false, error: error.message || 'Failed to upload logo' };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    theme,
    updateTheme,
    isLoading,
    uploadLogo,
    logoUrl,
    uploadError,
    isUploading
  };
};
