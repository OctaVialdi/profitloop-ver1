
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeContextType {
  logoUrl: string | null;
}

const ThemeContext = createContext<ThemeContextType>({ logoUrl: null });

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { themeSettings, logoUrl } = useTheme();

  // Terapkan variabel CSS kustom untuk tema
  useEffect(() => {
    if (!themeSettings) return;

    const root = document.documentElement;
    
    // Konversi HEX ke HSL
    const hexToHSL = (hex: string): string => {
      // Konversi hex ke rgb
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

      // Konversi rgb ke hsl
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

    // Terapkan variabel CSS
    root.style.setProperty('--primary', hexToHSL(themeSettings.primary_color));
    root.style.setProperty('--primary-foreground', '0 0% 100%');
    
    root.style.setProperty('--secondary', hexToHSL(themeSettings.secondary_color));
    root.style.setProperty('--secondary-foreground', '0 0% 100%');
    
    root.style.setProperty('--accent', hexToHSL(themeSettings.accent_color));
    root.style.setProperty('--accent-foreground', '0 0% 100%');
    
    root.style.setProperty('--sidebar-background', hexToHSL(themeSettings.sidebar_color));

  }, [themeSettings]);

  return (
    <ThemeContext.Provider value={{ logoUrl }}>
      {children}
    </ThemeContext.Provider>
  );
};
