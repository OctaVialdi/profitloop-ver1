
import { supabase } from './client';

/**
 * Ensures a storage bucket exists, creating it if necessary
 * 
 * @param bucketName The name of the bucket to ensure exists
 * @param isPublic Whether the bucket should be public or private
 * @returns A boolean indicating success
 */
export async function ensureBucketExists(bucketName: string, isPublic: boolean = false): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if the bucket already exists
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error checking if bucket exists:', getBucketsError);
      return { success: false, error: getBucketsError.message };
    }
    
    // If bucket already exists, we're done
    if (buckets?.find(bucket => bucket.name === bucketName)) {
      return { success: true };
    }
    
    // Bucket doesn't exist, create it
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
    });
    
    if (createBucketError) {
      console.error('Error creating bucket:', createBucketError);
      return { success: false, error: createBucketError.message };
    }
    
    // If public bucket, update bucket policy
    if (isPublic) {
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 1);
      
      // This will fail with a 404 because dummy.txt doesn't exist, but it's just to check permissions
      if (policyError && !policyError.message.includes('404')) {
        console.error('Error setting bucket policy:', policyError);
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Exception ensuring bucket exists:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Uploads a file to a specified bucket
 * 
 * @param bucketName The name of the bucket to upload to
 * @param filePath The path/name for the file in the bucket
 * @param file The file to upload
 * @returns Object containing the URL and any error that occurred
 */
export async function uploadFileToBucket(
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<{ url?: string; error?: Error }> {
  try {
    // Upload the file to the specified bucket path
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return { error: uploadError };
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Exception uploading file:', error);
    return { error: error };
  }
}
