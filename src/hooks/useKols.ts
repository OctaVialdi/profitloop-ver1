import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/utils/uploadHelper';

export interface Kol {
  id: string;
  full_name: string;
  category: string;
  total_followers: number;
  engagement_rate: number;
  is_active: boolean;
  photo_url?: string;
  photo_path?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
  platforms?: Array<string>;
  rates?: Array<{
    platform: string;
    currency: string;
    min_rate: number;
    max_rate: number;
  }>;
}

export type NewKolData = Omit<Kol, 'id' | 'created_at' | 'updated_at'>;

export const useKols = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [kols, setKols] = useState<Kol[]>([]);
  const { organization } = useOrganization();
  
  // Fetch kols when organization is available
  const fetchKols = useCallback(async () => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching KOLs for organization:", organization.id);
      const { data, error } = await supabase
        .from('data_kol')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log("Fetched KOLs:", data);
      setKols(data || []);
    } catch (error) {
      console.error('Error fetching KOLs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch KOLs data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id]);
  
  const addKol = useCallback(async (kolData: Omit<NewKolData, 'organization_id'>) => {
    if (!organization?.id) return null;
    
    setIsLoading(true);
    try {
      // Prepare the data with organization_id
      const newKol: NewKolData = {
        ...kolData,
        organization_id: organization.id,
      };
      
      console.log("Adding new KOL:", newKol);
      const { data, error } = await supabase
        .from('data_kol')
        .insert([newKol])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'KOL has been added successfully',
      });
      
      console.log("Added KOL successfully:", data);
      
      // Add KOL to local state
      setKols(prevKols => [data, ...prevKols]);
      
      return data;
    } catch (error: any) {
      console.error('Error adding KOL:', error);
      toast({
        title: 'Error',
        description: `Failed to add KOL: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id]);
  
  const updateKol = useCallback(async (id: string, updates: Partial<Kol>) => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('data_kol')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'KOL has been updated successfully',
      });
      
      // Update the local state with the updated KOL
      setKols(prevKols => prevKols.map(kol => kol.id === id ? data : kol));
      
      return data;
    } catch (error: any) {
      console.error('Error updating KOL:', error);
      toast({
        title: 'Error',
        description: `Failed to update KOL: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);
  
  const deleteKol = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const kolToDelete = kols.find(kol => kol.id === id);
      
      // If KOL has a photo, delete it from storage first
      if (kolToDelete?.photo_path) {
        await deleteProfilePhoto(kolToDelete.photo_path);
      }
      
      const { error } = await supabase
        .from('data_kol')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'KOL has been deleted successfully',
      });
      
      // Update the local state by removing the deleted KOL
      setKols(prevKols => prevKols.filter(kol => kol.id !== id));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting KOL:', error);
      toast({
        title: 'Error',
        description: `Failed to delete KOL: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [kols]);

  const uploadKolPhoto = useCallback(async (id: string, file: File) => {
    if (!organization?.id) return null;

    setIsUploading(true);
    try {
      const { url, filePath, error } = await uploadProfilePhoto(
        file, 
        organization.id, 
        id
      );

      if (error) {
        throw error;
      }

      if (!url || !filePath) {
        throw new Error("Failed to upload photo");
      }

      // Update KOL record with the photo URL and path
      const { data, error: updateError } = await supabase
        .from('data_kol')
        .update({
          photo_url: url,
          photo_path: filePath
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Profile photo uploaded successfully',
      });

      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === id ? { ...kol, photo_url: url, photo_path: filePath } : kol
      ));

      return data;
    } catch (error: any) {
      console.error('Error uploading KOL photo:', error);
      toast({
        title: 'Error',
        description: `Failed to upload photo: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [organization?.id]);

  const removeKolPhoto = useCallback(async (id: string) => {
    setIsUploading(true);
    try {
      // Find the KOL to get the photo path
      const kolToUpdate = kols.find(kol => kol.id === id);
      
      if (!kolToUpdate?.photo_path) {
        throw new Error("No photo to delete");
      }

      // Delete from storage
      const { error: deleteError } = await deleteProfilePhoto(kolToUpdate.photo_path);
      
      if (deleteError) {
        throw deleteError;
      }

      // Update KOL record to remove photo references
      const { data, error: updateError } = await supabase
        .from('data_kol')
        .update({
          photo_url: null,
          photo_path: null
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Profile photo removed successfully',
      });

      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === id ? { ...kol, photo_url: null, photo_path: null } : kol
      ));

      return data;
    } catch (error: any) {
      console.error('Error removing KOL photo:', error);
      toast({
        title: 'Error',
        description: `Failed to remove photo: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [kols]);

  const addPlatform = useCallback(async (
    kolId: string, 
    platformData: {
      platform: string;
      handle: string;
      profile_url: string;
      followers: number;
      engagement: number;
    }
  ) => {
    setIsUpdating(true);
    try {
      // Get current KOL
      const kol = kols.find(k => k.id === kolId);
      if (!kol) {
        throw new Error("KOL not found");
      }

      // Create or update platforms array
      const currentPlatforms = kol.platforms || [];
      const newPlatforms = [...currentPlatforms, platformData.platform];
      
      // Update KOL with new platform
      const { data, error } = await supabase
        .from('data_kol')
        .update({
          platforms: newPlatforms,
          // Update followers if provided
          ...(platformData.followers && { total_followers: Number(kol.total_followers) + Number(platformData.followers) })
        })
        .eq('id', kolId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Platform added successfully',
      });
      
      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === kolId ? data : kol
      ));
      
      return data;
    } catch (error: any) {
      console.error('Error adding platform:', error);
      toast({
        title: 'Error',
        description: `Failed to add platform: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [kols]);

  const addRateCard = useCallback(async (
    kolId: string, 
    rateData: {
      platform: string;
      currency: string;
      min_rate: number;
      max_rate: number;
    }
  ) => {
    setIsUpdating(true);
    try {
      // Get current KOL
      const kol = kols.find(k => k.id === kolId);
      if (!kol) {
        throw new Error("KOL not found");
      }

      // Create or update rates array
      const currentRates = kol.rates || [];
      const newRates = [...currentRates, rateData];
      
      // Update KOL with new rate card
      const { data, error } = await supabase
        .from('data_kol')
        .update({
          rates: newRates
        })
        .eq('id', kolId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Rate card added successfully',
      });
      
      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === kolId ? data : kol
      ));
      
      return data;
    } catch (error: any) {
      console.error('Error adding rate card:', error);
      toast({
        title: 'Error',
        description: `Failed to add rate card: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [kols]);
  
  // Initial fetch when the component mounts and has organization data
  useEffect(() => {
    if (organization?.id) {
      fetchKols();
    }
  }, [organization?.id, fetchKols]);
  
  return {
    kols,
    isLoading,
    isDeleting,
    isUpdating,
    isUploading,
    fetchKols,
    addKol,
    updateKol,
    deleteKol,
    uploadKolPhoto,
    removeKolPhoto,
    addPlatform,
    addRateCard
  };
};
