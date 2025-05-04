
import { supabase } from "../client";

// Helper function to save user preferences
export async function saveUserPreferences(userId: string, preferences: any) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ preferences })
      .eq('id', userId);
      
    if (error) {
      console.error("Error saving preferences:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception saving preferences:", err);
    return false;
  }
}

// Helper function to save theme settings to database
export async function saveThemeToDatabase(organizationId: string, themeSettings: any, logoPath?: string) {
  try {
    const updateData: any = { theme_settings: themeSettings };
    
    if (logoPath) {
      updateData.logo_path = logoPath;
    }
    
    const { error } = await supabase
      .from('organizations')
      .update(updateData)
      .eq('id', organizationId);
      
    if (error) {
      console.error("Error saving theme settings to database:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception saving theme settings:", err);
    return false;
  }
}
