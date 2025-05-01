
import { useState, useEffect } from "react";
import { supabase, saveThemeToDatabase } from "@/integrations/supabase/client";
import { useOrganization } from "./useOrganization";
import { toast } from "sonner";
import { useAppTheme } from "@/components/ThemeProvider";
import { saveThemeToStorage } from "@/components/ThemeProvider";
import { saveThemeChanges } from "@/services/meetingService";

export type ThemeSettings = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  sidebar_color: string;
};

const defaultTheme: ThemeSettings = {
  primary_color: "#1E40AF",
  secondary_color: "#3B82F6",
  accent_color: "#60A5FA",
  sidebar_color: "#F1F5F9"
};

export const useAppThemeManager = () => {
  const { organization, isAdmin, refreshData, userProfile } = useOrganization();
  const { setTheme } = useAppTheme();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get theme settings from organization
  useEffect(() => {
    if (organization) {
      const savedTheme = organization.theme_settings as any;
      const newTheme = savedTheme || defaultTheme;
      setThemeSettings(newTheme);
      
      // Save to localStorage for offline/non-authenticated access
      saveThemeToStorage(newTheme, logoUrl);
      
      if (organization.logo_path) {
        fetchLogoUrl(organization.logo_path);
      }
    }
  }, [organization]);

  // Fetch logo URL from storage
  const fetchLogoUrl = async (path: string) => {
    try {
      const { data } = await supabase.storage
        .from('org_logos')
        .getPublicUrl(path);
      
      if (data?.publicUrl) {
        setLogoUrl(data.publicUrl);
        // Save logo URL to localStorage
        saveThemeToStorage(themeSettings, data.publicUrl);
      }
    } catch (error) {
      console.error("Error fetching logo URL:", error);
    }
  };

  // Function to update theme settings
  const saveThemeSettings = async (newSettings: ThemeSettings) => {
    if (!organization || !isAdmin) return;
    
    setIsSaving(true);
    
    try {
      // Update database with theme settings
      await saveThemeToDatabase(organization.id, newSettings);
      
      setThemeSettings(newSettings);
      // Update localStorage
      saveThemeToStorage(newSettings, logoUrl);
      
      await refreshData();
      toast.success("Pengaturan tema berhasil disimpan");
    } catch (error: any) {
      console.error("Error saving theme settings:", error);
      toast.error("Gagal menyimpan pengaturan tema");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to upload logo
  const uploadLogo = async (file: File) => {
    if (!organization || !isAdmin) return;
    
    setIsLoading(true);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${organization.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('org_logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Update organization record with logo path
      await saveThemeToDatabase(organization.id, themeSettings, filePath);
      
      // Get public URL
      fetchLogoUrl(filePath);
      await refreshData();
      toast.success("Logo berhasil diupload");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error("Gagal mengupload logo");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to set dark mode
  const setDarkMode = (isDarkMode: boolean) => {
    setTheme(isDarkMode ? "dark" : "light");
    
    // Save theme change to database
    if (userProfile?.id) {
      saveThemeChanges(isDarkMode ? "dark" : "light", userProfile.id);
    }
    
    // If user is logged in, save preference to database
    if (userProfile?.id) {
      saveUserPreferences(isDarkMode);
    }
  };
  
  // Helper to save user dark mode preference
  const saveUserPreferences = async (isDarkMode: boolean) => {
    if (!userProfile) return;
    
    try {
      // First get current preferences
      const currentPreferences = userProfile.preferences || {
        notification_emails: true,
        marketing_emails: false,
        dark_mode: false
      };
      
      // Update dark mode setting
      const updatedPreferences = {
        ...currentPreferences,
        dark_mode: isDarkMode
      };
      
      // Save to database
      await supabase
        .from('profiles')
        .update({ preferences: updatedPreferences })
        .eq('id', userProfile.id);
        
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  };

  return {
    themeSettings,
    logoUrl,
    isLoading,
    isSaving,
    saveThemeSettings,
    uploadLogo,
    isAdmin,
    setDarkMode
  };
};

// Export the hook functionality
export const useTheme = useAppThemeManager;
