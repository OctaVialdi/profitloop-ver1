
import { supabase } from '@/integrations/supabase/client';

export const uploadProfilePhoto = async (
  file: File,
  organizationId: string,
  kolId: string
) => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${organizationId}/${kolId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase
      .storage
      .from('kol-photos')
      .upload(filePath, file);
    
    if (uploadError) {
      return { error: uploadError };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('kol-photos')
      .getPublicUrl(filePath);
    
    return {
      url: publicUrl,
      filePath,
      error: null
    };
  } catch (error) {
    console.error('Error in uploadProfilePhoto:', error);
    return {
      url: null,
      filePath: null,
      error
    };
  }
};

export const deleteProfilePhoto = async (filePath: string) => {
  try {
    const { error } = await supabase
      .storage
      .from('kol-photos')
      .remove([filePath]);
    
    return { error };
  } catch (error) {
    console.error('Error in deleteProfilePhoto:', error);
    return { error };
  }
};
