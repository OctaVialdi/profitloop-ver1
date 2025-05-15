
import { supabase } from "@/integrations/supabase/client";

export const uploadFileToBucket = async (
  bucketName: string,
  filePath: string,
  file: File
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { 
      data, 
      url: urlData.publicUrl,
      error: null 
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return {
      data: null,
      url: null,
      error
    };
  }
};

export const deleteFile = async (
  bucketName: string,
  filePath: string
) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return { success: false, error };
  }
};
