
import { useState, useEffect } from "react";
import { useOrganization } from "./useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useTheme, saveThemeToStorage } from "@/components/theme-provider";
import { Json } from "@/integrations/supabase/types";

export function useAppThemeManager() {
  const { organization, userProfile } = useOrganization();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [themeSettings, setThemeSettings] = useState<Record<string, any>>({
    primary_color: "#0369a1",
    secondary_color: "#6366f1",
    accent_color: "#ec4899",
    sidebar_color: "#1e293b"
  });

  // Initialize theme settings from organization data
  useEffect(() => {
    if (organization?.theme_settings) {
      try {
        // Handle both string and object theme settings
        const settings = typeof organization.theme_settings === 'string'
          ? JSON.parse(organization.theme_settings as string)
          : organization.theme_settings;

        // Use default values if settings don't exist
        setThemeSettings({
          primary_color: settings.primary_color || "#0369a1",
          secondary_color: settings.secondary_color || "#6366f1",
          accent_color: settings.accent_color || "#ec4899",
          sidebar_color: settings.sidebar_color || "#1e293b"
        });
      } catch (error) {
        console.error("Failed to parse theme settings:", error);
      }
    }
    
    // Set logo preview from organization data
    if (organization?.logo_path) {
      setLogoPreview(organization.logo_path);
    }
  }, [organization]);

  // Handle file input change for logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle color changes in the theme
  const handleColorChange = (colorKey: string, value: string) => {
    setThemeSettings((prev) => ({
      ...prev,
      [colorKey]: value
    }));
  };

  // Save theme settings to database
  const saveThemeSettings = async () => {
    if (!organization?.id || !userProfile?.id) {
      toast({
        title: "Error",
        description: "Organization or user profile not found",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // First, save the theme settings
      const { error: themeError } = await supabase
        .from('organizations')
        .update({
          theme_settings: themeSettings as Json
        })
        .eq('id', organization.id);

      if (themeError) {
        throw new Error(`Failed to save theme settings: ${themeError.message}`);
      }

      // Then, if there's a logo file, upload it to storage
      let logoPath = organization.logo_path;
      if (logoFile) {
        const filename = `${organization.id}/logo-${Date.now()}.${logoFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('organization-assets')
          .upload(filename, logoFile);

        if (uploadError) {
          throw new Error(`Failed to upload logo: ${uploadError.message}`);
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('organization-assets')
          .getPublicUrl(filename);
        
        logoPath = publicUrlData.publicUrl;
        
        // Update the organization with the new logo path
        const { error: logoUpdateError } = await supabase
          .from('organizations')
          .update({ logo_path: logoPath })
          .eq('id', organization.id);

        if (logoUpdateError) {
          throw new Error(`Failed to update logo path: ${logoUpdateError.message}`);
        }
      }

      // Save theme to local storage for immediate use
      saveThemeToStorage(themeSettings, logoPath);

      toast({
        title: "Success",
        description: "Theme settings saved successfully",
      });

    } catch (error: any) {
      console.error('Error saving theme settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save theme settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update this function to properly handle the logo_path property
  const findAnAlternativeFor = (objectWithKeys: Record<string, any>, keyToFind: string): boolean => {
    for (const key of Object.keys(objectWithKeys)) {
      if (key.toLowerCase().includes(keyToFind.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  // In the updateOrgTheme function
  const updateOrgTheme = async (orgId: string, themeData: Record<string, any>) => {
    try {
      // Only include the logo_path if it exists in the themeData
      const updatePayload: Record<string, any> = {
        theme_settings: themeData
      };
      
      if ('logo_path' in themeData) {
        // In a real implementation you'd need to modify your DB schema
        // For now we'll just log that this field was attempted to be updated
        console.log('Updating logo_path is not supported in this version');
      }
      
      const { error } = await supabase
        .from('organizations')
        .update(updatePayload)
        .eq('id', orgId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Theme updated",
        description: "Your theme settings have been updated",
      });
      
    } catch (err) {
      console.error('Error updating theme:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update theme settings",
      });
    }
  };

  return {
    themeSettings,
    logoPreview,
    isLoading,
    isSaving,
    handleLogoChange,
    handleColorChange,
    saveThemeSettings,
    updateOrgTheme
  };
}
