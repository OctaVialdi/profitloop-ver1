
import { supabase } from "./client";

// Helper function to check if a storage bucket exists
export async function checkBucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      return false;
    }
    return !!data;
  } catch (error) {
    console.error('Error checking if bucket exists:', error);
    return false;
  }
}

// Create storage bucket if it doesn't exist
export async function createAssetImagesBucket(): Promise<boolean> {
  try {
    const exists = await checkBucketExists('asset_images');
    
    if (!exists) {
      const { error } = await supabase.storage.createBucket('asset_images', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
      });
      
      if (error) {
        console.error('Error creating asset_images bucket:', error);
        return false;
      }
      
      // Create public bucket policy to allow viewing images without authentication
      const { error: policyError } = await supabase.storage.from('asset_images').createSignedUrl('dummy', 1);
      if (policyError && !policyError.message.includes('object not found')) {
        console.error('Error creating policy for asset_images bucket:', policyError);
        return false;
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating asset_images bucket:', error);
    return false;
  }
}
