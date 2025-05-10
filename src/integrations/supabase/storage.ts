
import { supabase } from "./client";
import { toast } from "sonner";

// Helper function to check if a storage bucket exists
export async function checkBucketExists(bucketName: string): Promise<boolean> {
  try {
    // Using listBuckets instead of getBucket for more reliable bucket existence check
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking bucket existence:", error.message);
      return false;
    }
    
    return buckets.some(bucket => bucket.name === bucketName);
  } catch (error) {
    console.error('Error checking if bucket exists:', error);
    return false;
  }
}

// Create storage bucket if it doesn't exist
export async function createBucket(bucketName: string, isPublic: boolean = false): Promise<{ success: boolean, error?: string }> {
  try {
    // First check if the user has permissions to create buckets
    const { data: userInfo, error: userError } = await supabase.auth.getUser();
    if (userError || !userInfo || !userInfo.user) {
      console.error('User not authenticated:', userError?.message || 'No user data');
      toast.error("Authentication required for storage operations");
      return { success: false, error: "Authentication required" };
    }
    
    const exists = await checkBucketExists(bucketName);
    
    if (!exists) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
      });
      
      if (error) {
        if (error.message.includes('Permission denied')) {
          console.log(`Insufficient permissions to create the '${bucketName}' bucket.`);
          toast.warning(`You don't have permission to create storage buckets. Please contact your administrator to create the '${bucketName}' bucket.`);
        } else if (error.message.includes('already exists')) {
          console.log(`Bucket '${bucketName}' already exists.`);
          return { success: true }; // Consider it a success if bucket already exists
        } else {
          console.error(`Error creating ${bucketName} bucket:`, error);
          toast.error(`Failed to create ${bucketName} bucket: ${error.message}`);
        }
        return { success: false, error: error.message };
      }
      
      console.log(`Successfully created '${bucketName}' bucket.`);
      return { success: true };
    }
    
    return { success: true }; // Bucket already exists
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error";
    console.error(`Error creating ${bucketName} bucket:`, errorMessage);
    toast.error("Storage initialization failed. Please try again.");
    return { success: false, error: errorMessage };
  }
}

// Function to check if a bucket exists and create it if needed
export async function ensureBucketExists(bucketName: string, isPublic: boolean = false): Promise<{ success: boolean, error?: string }> {
  try {
    // First check if the user has permissions
    const { data: userInfo, error: userError } = await supabase.auth.getUser();
    if (userError || !userInfo || !userInfo.user) {
      console.error('User not authenticated:', userError?.message || 'No user data');
      toast.error("Authentication required for storage operations");
      return { success: false, error: "Authentication required" };
    }
    
    const exists = await checkBucketExists(bucketName);
    
    if (!exists) {
      return await createBucket(bucketName, isPublic);
    }
    
    return { success: true };
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error";
    console.error(`Error ensuring ${bucketName} bucket exists:`, errorMessage);
    toast.error("Storage initialization failed. Please try again.");
    return { success: false, error: errorMessage };
  }
}

// Function to get the URL for an uploaded file with improved error handling
export async function getUploadFileURL(filePath: string, file: File, bucketName: string = 'company_documents'): Promise<string | null> {
  try {
    // Verify bucket exists first
    const bucketExists = await checkBucketExists(bucketName);
    
    if (!bucketExists) {
      toast.error(`Storage bucket '${bucketName}' not found. Contact your administrator.`);
      return null;
    }
    
    // Get the public URL
    const response = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    // Check if response has data with publicUrl
    if (!response || !response.data || !response.data.publicUrl) {
      console.error("Error getting URL for file:", response);
      toast.error("Failed to generate file URL");
      return null;
    }

    return response.data.publicUrl;
  } catch (error: any) {
    console.error('Error getting upload URL:', error.message || error);
    toast.error("Failed to process file upload");
    return null;
  }
}

// Function to upload a file to a specific bucket
export async function uploadFileToBucket(
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  try {
    // Verify bucket exists first
    const bucketExists = await checkBucketExists(bucketName);
    
    if (!bucketExists) {
      // Just log the issue rather than trying to create the bucket
      console.log(`Storage bucket '${bucketName}' does not exist.`);
      return { 
        url: null, 
        error: new Error(`Storage bucket '${bucketName}' not found. Contact your administrator.`) 
      };
    }
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
      
    if (uploadError) {
      return { url: null, error: uploadError };
    }
    
    // Get the URL
    const response = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    if (!response || !response.data || !response.data.publicUrl) {
      return { 
        url: null, 
        error: new Error("Failed to generate file URL") 
      };
    }
    
    return { url: response.data.publicUrl, error: null };
  } catch (error: any) {
    return { 
      url: null, 
      error: error instanceof Error ? error : new Error(error.message || "Unknown error") 
    };
  }
}
