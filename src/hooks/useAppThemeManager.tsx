
import { useEffect, useState } from 'react';
import { useOrganization } from './useOrganization';
import { ThemeSettings } from '@/types/organization';
import { parseJsonIfString } from '@/utils/jsonUtils';

export function useAppThemeManager() {
  const { organization } = useOrganization();
  const [themeColors, setThemeColors] = useState<ThemeSettings>({
    primary_color: '#1e40af',
    secondary_color: '#3b82f6',
    accent_color: '#60a5fa',
    sidebar_color: '#f1f5f9',
  });

  const applyThemeToDOM = (colors: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary_color);
    root.style.setProperty('--primary-foreground', getContrastingTextColor(colors.primary_color));
    
    root.style.setProperty('--secondary', colors.secondary_color);
    root.style.setProperty('--secondary-foreground', getContrastingTextColor(colors.secondary_color));
    
    root.style.setProperty('--accent', colors.accent_color);
    root.style.setProperty('--accent-foreground', getContrastingTextColor(colors.accent_color));
    
    root.style.setProperty('--sidebar', colors.sidebar_color);
    root.style.setProperty('--sidebar-foreground', getContrastingTextColor(colors.sidebar_color));
  };

  // Helper to determine if text should be light or dark based on background color
  const getContrastingTextColor = (bgColor: string): string => {
    // Remove the hash if it's there
    const hex = bgColor.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, black for light
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  useEffect(() => {
    if (organization?.theme_settings) {
      // Parse theme settings if they're in string format
      const parsedTheme = parseJsonIfString<ThemeSettings>(
        organization.theme_settings, 
        {
          primary_color: '#1e40af',
          secondary_color: '#3b82f6',
          accent_color: '#60a5fa',
          sidebar_color: '#f1f5f9',
        }
      );

      setThemeColors(parsedTheme);
      applyThemeToDOM(parsedTheme);
    }
  }, [organization?.theme_settings]);

  return {
    themeColors,
    setThemeColors,
    applyThemeToDOM,
  };
}
