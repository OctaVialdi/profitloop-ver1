
import { supabase } from "./client";

/**
 * Ensures that a storage bucket exists
 */
export const ensureBucketExists = async (bucketName: string, isPublic: boolean = false) => {
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
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
    return false;
  }
};
