
import { supabase } from "./client";
import { toast } from "sonner";

// Helper function to check if a storage bucket exists
export async function checkBucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error("Error checking bucket existence:", error.message);
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
    // First check if the user has permissions to create buckets
    const { data: userInfo, error: userError } = await supabase.auth.getUser();
    if (userError || !userInfo || !userInfo.user) {
      console.error('User not authenticated:', userError?.message || 'No user data');
      toast.error("Authentication required for storage operations");
      return false;
    }
    
    const exists = await checkBucketExists('company_documents');
    
    if (!exists) {
      // Instead of directly creating the bucket which might trigger RLS errors,
      // we'll use a more focused approach
      // Signal to the user that they need to create the bucket in the Supabase dashboard
      console.log("The 'company_documents' bucket doesn't exist. Using temporary alternative storage.");
      toast.warning("Some storage features may be limited. Please contact your administrator to create a 'company_documents' bucket.");
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating asset_images bucket:', error.message || error);
    toast.error("Storage initialization failed. Please try again.");
    return false;
  }
}

// Function to get the URL for an uploaded file with improved error handling
export async function getUploadFileURL(filePath: string, file: File): Promise<string | null> {
  try {
    // Verify bucket exists first
    const bucketExists = await checkBucketExists('company_documents');
    
    if (!bucketExists) {
      toast.error("Storage bucket 'company_documents' not found. Contact your administrator.");
      return null;
    }
    
    // Get the public URL
    const response = await supabase.storage
      .from('company_documents')
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
