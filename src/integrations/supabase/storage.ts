import { supabase } from "@/integrations/supabase/client";

export const ensureBucketExists = async (
  bucketName: string,
  isPublic: boolean = true
) => {
  try {
    // First check if the bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking for existing buckets:', listError);
      return { success: false, error: listError.message };
    }
    
    const bucketExists = existingBuckets.some(bucket => bucket.name === bucketName);
    
    // If bucket already exists, return success
    if (bucketExists) {
      return { success: true };
    }
    
    // Otherwise create the bucket
    const { data, error } = await supabase.storage.createBucket(
      bucketName,
      {
        public: isPublic,
        fileSizeLimit: 10485760, // 10MB
      }
    );
    
    if (error) {
      // If error contains "already exists", consider it a success
      if (error.message.includes('already exists')) {
        return { success: true };
      }
      
      // If error indicates row-level security policy violation
      // (this happens when user doesn't have bucket creation permission
      // but the bucket likely exists)
      if (error.message.includes('row-level security policy')) {
        return { 
          success: false, 
          error: 'Permission denied: row-level security policy'
        };
      }
      
      console.error('Error creating bucket:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error ensuring bucket exists:', err);
    return { success: false, error: err.message };
  }
};

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
