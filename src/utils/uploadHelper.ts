
import { supabase } from '@/integrations/supabase/client';
import { ensureBucketExists, uploadFileToBucket } from '@/integrations/supabase/storage';
import { toast } from '@/components/ui/use-toast';

export async function uploadProfilePhoto(file: File, organizationId: string, kolId: string) {
  try {
    // Ensure the KOL photos bucket exists
    const { success, error: bucketError } = await ensureBucketExists('kol-photos', true);
    
    if (!success) {
      console.error('Error ensuring bucket exists:', bucketError);
      throw new Error(bucketError || 'Failed to prepare storage');
    }
    
    // Create a unique path for the file
    const fileExt = file.name.split('.').pop();
    const filePath = `${organizationId}/${kolId}/${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { url, error } = await uploadFileToBucket(
      'kol-photos',
      filePath,
      file
    );
    
    if (error) {
      throw error;
    }
    
    return { url, filePath };
  } catch (error: any) {
    console.error('Error uploading profile photo:', error);
    toast({
      title: "Upload Failed",
      description: error.message || "Could not upload photo",
      variant: "destructive",
    });
    return { error };
  }
}

export async function deleteProfilePhoto(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from('kol-photos')
      .remove([filePath]);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting profile photo:', error);
    toast({
      title: "Delete Failed",
      description: error.message || "Could not delete photo",
      variant: "destructive",
    });
    return { error, success: false };
  }
}
