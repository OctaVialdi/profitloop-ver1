
import { supabase } from "./client";

/**
 * Result type for storage operations
 */
export interface StorageResult {
  success: boolean;
  error?: string;
}

/**
 * Ensures that a storage bucket exists
 */
export const ensureBucketExists = async (bucketName: string, isPublic: boolean = false): Promise<StorageResult> => {
  try {
    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);

    // If bucket doesn't exist, create it
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10485760 // 10MB limit
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
        return { success: false, error: error.message };
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error checking/creating bucket:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload a file to a specific Supabase storage bucket
 * 
 * @param bucketName Storage bucket name
 * @param filePath Path where file will be stored
 * @param file File to upload
 * @param options Optional upload options
 */
export const uploadFileToBucket = async (
  bucketName: string, 
  filePath: string, 
  file: File,
  options?: { cacheControl?: string; upsert?: boolean }
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Ensure bucket exists
    await ensureBucketExists(bucketName, true);
    
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert ?? true
      });
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    if (!urlData.publicUrl) {
      throw new Error('Could not get public URL for uploaded file');
    }
    
    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error(`Error uploading file to ${bucketName}/${filePath}:`, error);
    return {
      success: false,
      error: error.message || 'File upload failed'
    };
  }
};
