
import { supabase } from './client';

/**
 * Ensures a storage bucket exists, creating it if necessary
 * 
 * @param bucketName The name of the bucket to ensure exists
 * @param isPublic Whether the bucket should be public or private
 * @returns A boolean indicating success
 */
export async function ensureBucketExists(bucketName: string, isPublic: boolean = false): Promise<boolean> {
  try {
    // First check if the bucket already exists
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error checking if bucket exists:', getBucketsError);
      return false;
    }
    
    // If bucket already exists, we're done
    if (buckets?.find(bucket => bucket.name === bucketName)) {
      return true;
    }
    
    // Bucket doesn't exist, create it
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
    });
    
    if (createBucketError) {
      console.error('Error creating bucket:', createBucketError);
      return false;
    }
    
    // If public bucket, update bucket policy
    if (isPublic) {
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 1);
      
      // This will fail with a 404 because dummy.txt doesn't exist, but it's just to check permissions
      if (policyError && !policyError.message.includes('404')) {
        console.error('Error setting bucket policy:', policyError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception ensuring bucket exists:', error);
    return false;
  }
}
