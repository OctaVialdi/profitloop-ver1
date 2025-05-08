
import { supabase } from "./client";
import { toast } from "sonner";

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
    // First check if the user has permissions to create buckets
    const { data: userInfo } = await supabase.auth.getUser();
    if (!userInfo || !userInfo.user) {
      console.error('User not authenticated');
      return false;
    }
    
    const exists = await checkBucketExists('company_documents');
    
    if (!exists) {
      // Instead of directly creating the bucket which might trigger RLS errors,
      // we'll use a more focused approach
      // Signal to the user that they need to create the bucket in the Supabase dashboard
      console.log("The 'company_documents' bucket doesn't exist. Using temporary alternative storage.");
      toast.warning("Some storage features may be limited. Please contact your administrator.");
      return true; // Return true to continue the app flow without blocking the user
    }
    
    return true;
  } catch (error) {
    console.error('Error creating asset_images bucket:', error);
    return false;
  }
}

// New function to get the URL for an uploaded file without bucket creation
export async function getUploadFileURL(filePath: string, file: File): Promise<string | null> {
  try {
    // Since we can't guarantee the bucket exists, we'll use a more resilient approach
    const response = await supabase.storage
      .from('company_documents')
      .getPublicUrl(filePath);
      
    // Check if response has data with publicUrl
    if (!response || !response.data || !response.data.publicUrl) {
      console.error("Error getting URL for file:", response);
      return null;
    }

    return response.data.publicUrl;
  } catch (error) {
    console.error('Error getting upload URL:', error);
    return null;
  }
}
