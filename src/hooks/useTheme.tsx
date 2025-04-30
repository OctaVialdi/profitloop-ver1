
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "./useOrganization";
import { toast } from "@/components/ui/sonner";

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

export const useTheme = () => {
  const { organization, isAdmin, refreshData } = useOrganization();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Ambil pengaturan tema dari organisasi
  useEffect(() => {
    if (organization) {
      const savedTheme = organization.theme_settings as ThemeSettings;
      setThemeSettings(savedTheme || defaultTheme);
      
      if (organization.logo_path) {
        fetchLogoUrl(organization.logo_path);
      }
    }
  }, [organization]);

  // Ambil URL logo dari storage
  const fetchLogoUrl = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('org_logos')
        .getPublicUrl(path);
      
      if (error) throw error;
      
      if (data?.publicUrl) {
        setLogoUrl(data.publicUrl);
      }
    } catch (error) {
      console.error("Error fetching logo URL:", error);
    }
  };

  // Fungsi untuk mengupdate pengaturan tema
  const saveThemeSettings = async (newSettings: ThemeSettings) => {
    if (!organization || !isAdmin) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ theme_settings: newSettings })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      setThemeSettings(newSettings);
      await refreshData();
      toast.success("Pengaturan tema berhasil disimpan");
    } catch (error: any) {
      console.error("Error saving theme settings:", error);
      toast.error("Gagal menyimpan pengaturan tema");
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi untuk mengupload logo
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
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ logo_path: filePath })
        .eq('id', organization.id);
      
      if (updateError) throw updateError;
      
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

  return {
    themeSettings,
    logoUrl,
    isLoading,
    isSaving,
    saveThemeSettings,
    uploadLogo,
    isAdmin
  };
};
