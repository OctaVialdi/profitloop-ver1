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
  social_media?: Array<{
    id: string;
    kol_id: string;
    platform: string;
    handle: string;
    profile_url: string;
    followers: number;
    engagement_rate: number;
  }>;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    purchases: number;
    revenue: number;
    cost: number;
    conversion_rate: number;
    roi: number;
  };
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

      // For each KOL, fetch associated platforms and rates
      if (data && data.length > 0) {
        const kolsWithDetails = await Promise.all(
          data.map(async (kol) => {
            // Fetch social media platforms for this KOL
            const { data: socialMediaData, error: socialMediaError } = await supabase
              .from('kol_social_media')
              .select('*')
              .eq('kol_id', kol.id);

            if (socialMediaError) {
              console.error('Error fetching social media for KOL:', socialMediaError);
              return { ...kol, social_media: [] };
            }

            // Fetch rates for this KOL
            const { data: ratesData, error: ratesError } = await supabase
              .from('kol_rates')
              .select('*')
              .eq('kol_id', kol.id);

            if (ratesError) {
              console.error('Error fetching rates for KOL:', ratesError);
              return { 
                ...kol, 
                social_media: socialMediaData || [],
                rates: [] 
              };
            }

            // Fetch metrics for this KOL
            const { data: metricsData, error: metricsError } = await supabase
              .from('kol_metrics')
              .select('*')
              .eq('kol_id', kol.id)
              .order('created_at', { ascending: false })
              .limit(1);

            if (metricsError) {
              console.error('Error fetching metrics for KOL:', metricsError);
            }

            // Update platforms array based on social media entries
            let platforms = socialMediaData ? socialMediaData.map(item => item.platform) : [];
            
            return { 
              ...kol, 
              social_media: socialMediaData || [],
              platforms: platforms,
              rates: ratesData || [],
              metrics: metricsData && metricsData.length > 0 ? metricsData[0] : null
            };
          })
        );
        
        setKols(kolsWithDetails);
      } else {
        setKols(data || []);
      }
      
      console.log("Fetched KOLs:", data);
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
      // First, insert into kol_social_media table
      const { data: socialData, error: socialError } = await supabase
        .from('kol_social_media')
        .insert({
          kol_id: kolId,
          platform: platformData.platform,
          handle: platformData.handle,
          profile_url: platformData.profile_url,
          followers: platformData.followers,
          engagement_rate: platformData.engagement
        })
        .select()
        .single();
        
      if (socialError) {
        throw socialError;
      }

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

      // Insert metrics data
      if (platformData.engagement > 0 || platformData.followers > 0) {
        const { data: metricsData, error: metricsError } = await supabase
          .from('kol_metrics')
          .insert({
            kol_id: kolId,
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
            purchases: 0,
            revenue: 0,
            cost: 0,
            conversion_rate: 0,
            roi: 0
          })
          .select();

        if (metricsError) {
          console.error('Error adding metrics:', metricsError);
        }
      }
      
      toast({
        title: 'Success',
        description: 'Platform added successfully',
      });

      // After successful update, fetch the updated KOL data with all platforms
      const updatedKol = await fetchKolWithDetails(kolId);
      
      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === kolId ? updatedKol : kol
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
      // First insert into kol_rates table
      const { data: rateRecord, error: rateInsertError } = await supabase
        .from('kol_rates')
        .insert({
          kol_id: kolId,
          platform: rateData.platform,
          currency: rateData.currency,
          min_rate: rateData.min_rate,
          max_rate: rateData.max_rate
        })
        .select()
        .single();
        
      if (rateInsertError) {
        throw rateInsertError;
      }
      
      toast({
        title: 'Success',
        description: 'Rate card added successfully',
      });
      
      // Fetch the updated KOL with all details
      const updatedKol = await fetchKolWithDetails(kolId);
      
      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === kolId ? updatedKol : kol
      ));
      
      return updatedKol;
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
  }, []);

  const updateMetrics = useCallback(async (
    kolId: string,
    metricData: {
      likes?: number;
      comments?: number;
      shares?: number;
      clicks?: number;
      purchases?: number;
      revenue?: number;
      cost?: number;
    }
  ) => {
    setIsUpdating(true);
    try {
      // Check if metrics exist for this KOL
      const { data: existingMetrics, error: checkError } = await supabase
        .from('kol_metrics')
        .select('*')
        .eq('kol_id', kolId);
      
      let metricsId;
      
      if (checkError) {
        throw checkError;
      }
      
      // Calculate derived metrics
      const clicks = metricData.clicks || 0;
      const purchases = metricData.purchases || 0;
      const revenue = metricData.revenue || 0;
      const cost = metricData.cost || 0;
      
      const conversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;
      const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
      
      if (existingMetrics && existingMetrics.length > 0) {
        // Update existing metrics
        metricsId = existingMetrics[0].id;
        const { data: updatedMetrics, error: updateError } = await supabase
          .from('kol_metrics')
          .update({
            ...metricData,
            conversion_rate: conversionRate,
            roi: roi,
            // Fix: Convert Date to ISO string
            updated_at: new Date().toISOString()
          })
          .eq('id', metricsId)
          .select()
          .single();
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: 'Success',
          description: 'Metrics updated successfully',
        });
        
        return updatedMetrics;
      } else {
        // Create new metrics
        const { data: newMetrics, error: insertError } = await supabase
          .from('kol_metrics')
          .insert({
            kol_id: kolId,
            ...metricData,
            conversion_rate: conversionRate,
            roi: roi
          })
          .select()
          .single();
          
        if (insertError) {
          throw insertError;
        }
        
        toast({
          title: 'Success',
          description: 'Metrics added successfully',
        });
        
        metricsId = newMetrics.id;
        return newMetrics;
      }
      
      // After successful update, fetch the updated KOL with all details
      const updatedKol = await fetchKolWithDetails(kolId);
      
      // Update local state
      setKols(prevKols => prevKols.map(kol => 
        kol.id === kolId ? updatedKol : kol
      ));
      
    } catch (error: any) {
      console.error('Error updating metrics:', error);
      toast({
        title: 'Error',
        description: `Failed to update metrics: ${error.message}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);
  
  // Helper function to fetch a single KOL with all its details
  const fetchKolWithDetails = async (kolId: string) => {
    try {
      // Fetch the KOL base data
      const { data: kolData, error: kolError } = await supabase
        .from('data_kol')
        .select('*')
        .eq('id', kolId)
        .single();
        
      if (kolError) {
        throw kolError;
      }
      
      // Fetch social media platforms
      const { data: socialMediaData, error: socialMediaError } = await supabase
        .from('kol_social_media')
        .select('*')
        .eq('kol_id', kolId);
        
      if (socialMediaError) {
        throw socialMediaError;
      }
      
      // Fetch rates
      const { data: ratesData, error: ratesError } = await supabase
        .from('kol_rates')
        .select('*')
        .eq('kol_id', kolId);
        
      if (ratesError) {
        throw ratesError;
      }
      
      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('kol_metrics')
        .select('*')
        .eq('kol_id', kolId)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (metricsError) {
        throw metricsError;
      }
      
      // Combine all the data
      return {
        ...kolData,
        social_media: socialMediaData || [],
        platforms: socialMediaData ? socialMediaData.map(sm => sm.platform) : [],
        rates: ratesData || [],
        metrics: metricsData && metricsData.length > 0 ? metricsData[0] : null
      };
    } catch (error) {
      console.error('Error fetching KOL details:', error);
      throw error;
    }
  };
  
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
    addRateCard,
    updateMetrics
  };
};
