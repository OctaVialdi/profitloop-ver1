
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  logoUrl: string | null;
  themeSettings: Record<string, any> | null;
  setTheme: (theme: string) => void; // Added this property
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeContextType>({ 
  logoUrl: null,
  themeSettings: null,
  setTheme: () => {} // Add default implementation
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, defaultTheme = "light", storageKey = "app-theme" }: ThemeProviderProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [themeSettings, setThemeSettings] = useState<Record<string, any> | null>(null);
  const [theme, setThemeState] = useState<string>(defaultTheme);

  // Function to apply theme settings to document
  const applyThemeSettings = (settings: Record<string, any>) => {
    if (!settings) return;

    const root = document.documentElement;
    
    // Convert HEX to HSL
    const hexToHSL = (hex: string): string => {
      // Convert hex to rgb
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      }

      // Convert rgb to hsl
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h = Math.round(h * 60);
      }
      
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return `${h} ${s}% ${l}%`;
    };

    // Apply CSS variables
    root.style.setProperty('--primary', hexToHSL(settings.primary_color));
    root.style.setProperty('--primary-foreground', '0 0% 100%');
    
    root.style.setProperty('--secondary', hexToHSL(settings.secondary_color));
    root.style.setProperty('--secondary-foreground', '0 0% 100%');
    
    root.style.setProperty('--accent', hexToHSL(settings.accent_color));
    root.style.setProperty('--accent-foreground', '0 0% 100%');
    
    root.style.setProperty('--sidebar-background', hexToHSL(settings.sidebar_color));
  };

  // Set theme function
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    
    // Apply theme to document
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);
    
    // Save to localStorage
    try {
      localStorage.setItem(`${storageKey}`, newTheme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  };

  // Store theme data into context
  const setThemeData = (settings: Record<string, any> | null, logo: string | null) => {
    setThemeSettings(settings);
    setLogoUrl(logo);
    
    if (settings) {
      applyThemeSettings(settings);
    }
  };

  // Initialize theme from localStorage if available
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      const storedThemeSettings = localStorage.getItem(`${storageKey}_settings`);
      const storedLogo = localStorage.getItem(`${storageKey}_logo_url`);
      
      if (storedTheme) {
        setTheme(storedTheme);
      }
      
      if (storedThemeSettings) {
        const parsedTheme = JSON.parse(storedThemeSettings);
        setThemeSettings(parsedTheme);
        applyThemeSettings(parsedTheme);
      }
      
      if (storedLogo) {
        setLogoUrl(storedLogo);
      }
    } catch (error) {
      console.log("Could not initialize theme from localStorage");
    }
  }, [storageKey]);

  return (
    <ThemeContext.Provider value={{ logoUrl, themeSettings, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility function to save theme data to localStorage
export const saveThemeToStorage = (settings: Record<string, any>, logoUrl: string | null, storageKey: string = "app-theme") => {
  try {
    localStorage.setItem(`${storageKey}_settings`, JSON.stringify(settings));
    if (logoUrl) {
      localStorage.setItem(`${storageKey}_logo_url`, logoUrl);
    }
  } catch (error) {
    console.error("Failed to save theme to localStorage", error);
  }
};
