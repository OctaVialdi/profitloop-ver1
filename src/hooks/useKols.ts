
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';

export interface Kol {
  id: string;
  full_name: string;
  category: string;
  total_followers: number;
  engagement_rate: number;
  is_active: boolean;
  photo_url?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export type NewKolData = Omit<Kol, 'id' | 'created_at' | 'updated_at'>;

export const useKols = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kols, setKols] = useState<Kol[]>([]);
  const { organization } = useOrganization();
  
  // Fetch kols when organization is available
  const fetchKols = useCallback(async () => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_kol')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
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
      
      // Refresh the KOL list
      await fetchKols();
      
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
  }, [organization?.id, fetchKols]);
  
  const updateKol = useCallback(async (id: string, updates: Partial<Kol>) => {
    setIsLoading(true);
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
      
      // Refresh the KOL list
      await fetchKols();
      
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
      setIsLoading(false);
    }
  }, [fetchKols]);
  
  const deleteKol = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
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
      
      // Refresh the KOL list
      await fetchKols();
      
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
      setIsLoading(false);
    }
  }, [fetchKols]);
  
  // Initial fetch when the component mounts and has organization data
  useEffect(() => {
    if (organization?.id) {
      fetchKols();
    }
  }, [organization?.id, fetchKols]);
  
  return {
    kols,
    isLoading,
    fetchKols,
    addKol,
    updateKol,
    deleteKol,
  };
};
