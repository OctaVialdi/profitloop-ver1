
import { supabase } from "@/integrations/supabase/client";

/**
 * Melakukan hard logout: menghapus session di Supabase dan membersihkan storage lokal
 */
export const hardLogout = async () => {
  // Sign out dari semua perangkat
  await supabase.auth.signOut({ scope: 'global' });
  
  // Hapus storage lokal (opsional, tergantung kebutuhan)
  localStorage.clear();
  sessionStorage.clear();
  
  // Return true untuk konfirmasi logout berhasil
  return true;
};

/**
 * Memeriksa apakah profile user valid dan lengkap
 */
export const validateUserProfile = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error validating user profile:", error);
      return { valid: false, profile: null };
    }
    
    // Profile dianggap valid jika ada data dan memiliki organization_id
    return { 
      valid: !!profile && !!profile.organization_id,
      profile
    };
  } catch (err) {
    console.error("Exception validating user profile:", err);
    return { valid: false, profile: null };
  }
};
