
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";

// Default colors
const defaultColors = {
  primary: "#1E40AF",
  secondary: "#3B82F6",
  accent: "#60A5FA",
  sidebar: "#F1F5F9",
};

export const useAppThemeManager = () => {
  const [colors, setColors] = useState(defaultColors);
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Load organization theme settings
  useEffect(() => {
    const loadOrganizationTheme = async () => {
      try {
        setIsLoading(true);
        
        // First get the user's organization
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsLoading(false);
          return;
        }
        
        // Get user profile to find organization
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', session.user.id)
          .single();
        
        if (profileError || !profile?.organization_id) {
          setIsLoading(false);
          return;
        }
        
        // Get organization with theme settings
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single();
        
        if (orgError || !org) {
          setIsLoading(false);
          return;
        }
        
        setOrganization(org);
        
        // Apply theme settings if available
        if (org.theme_settings && typeof org.theme_settings === 'object') {
          const themeSettings = org.theme_settings as {
            primary_color?: string;
            secondary_color?: string;
            accent_color?: string;
            sidebar_color?: string;
          };
          
          setColors({
            primary: themeSettings.primary_color || defaultColors.primary,
            secondary: themeSettings.secondary_color || defaultColors.secondary,
            accent: themeSettings.accent_color || defaultColors.accent,
            sidebar: themeSettings.sidebar_color || defaultColors.sidebar,
          });
        }
      } catch (error) {
        console.error("Error loading theme settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrganizationTheme();
  }, []);
  
  const updateTheme = async (newColors: typeof colors) => {
    if (!organization?.id) return;
    
    try {
      // Update in database
      const { error } = await supabase
        .from('organizations')
        .update({
          theme_settings: {
            primary_color: newColors.primary,
            secondary_color: newColors.secondary,
            accent_color: newColors.accent,
            sidebar_color: newColors.sidebar,
          },
          logo_path: organization.logo_path // Preserve existing logo path
        })
        .eq('id', organization.id);
      
      if (error) {
        console.error("Error updating theme:", error);
        throw error;
      }
      
      // Update local state
      setColors(newColors);
      
      return { success: true };
    } catch (error) {
      console.error("Exception updating theme:", error);
      return { success: false, error };
    }
  };
  
  return {
    colors,
    updateTheme,
    isLoading,
  };
};
