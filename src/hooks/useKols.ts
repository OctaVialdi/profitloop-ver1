import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationSetup } from './useOrganizationSetup';

export interface Kol {
  id: string;
  name: string;
  category: string;
  followers: number;
  engagement: number;
  status: string;
  score: number;
  avatar: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface KolSocialMedia {
  id: string;
  kol_id: string;
  platform: string;
  username: string; // This is named 'handle' in the database
  profile_url: string;
  followers: number;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
}

export interface KolRate {
  id: string;
  kol_id: string;
  platform: string;
  currency: string;
  min_rate: number;
  max_rate: number;
  created_at: string;
  updated_at: string;
}

export interface KolMetrics {
  id: string;
  kol_id: string;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  purchases: number;
  revenue: number;
  cost: number;
  created_at: string;
  updated_at: string;
}

export const useKols = () => {
  const [kols, setKols] = useState<Kol[]>([]);
  const [socialMedia, setSocialMedia] = useState<KolSocialMedia[]>([]);
  const [rates, setRates] = useState<KolRate[]>([]);
  const [metrics, setMetrics] = useState<KolMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { organization } = useOrganizationSetup();

  const fetchKols = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('kols')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setKols(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error fetching KOLs",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSocialMedia = async (kolId?: string) => {
    try {
      const query = supabase.from('kol_social_media').select('*');
      
      if (kolId) {
        query.eq('kol_id', kolId);
      }
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      // Map 'handle' field to 'username' for compatibility
      const mappedData: KolSocialMedia[] = (data || []).map(item => ({
        ...item,
        username: item.handle || '',
      })) as KolSocialMedia[];
      
      setSocialMedia(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error fetching social media data",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return [];
    }
  };
  
  const fetchRates = async (kolId?: string) => {
    try {
      const query = supabase.from('kol_rates').select('*');
      
      if (kolId) {
        query.eq('kol_id', kolId);
      }
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      setRates(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error fetching rate data",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return [];
    }
  };
  
  const fetchMetrics = async (kolId?: string) => {
    try {
      const query = supabase.from('kol_metrics').select('*');
      
      if (kolId) {
        query.eq('kol_id', kolId);
      }
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      setMetrics(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error fetching metrics data",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return [];
    }
  };

  const createKol = async (kol: Omit<Kol, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('kols')
        .insert(kol)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "KOL created",
        description: "KOL has been created successfully",
      });
      
      await fetchKols();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error creating KOL",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const updateKol = async (id: string, updates: Partial<Kol>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('kols')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "KOL updated",
        description: "KOL has been updated successfully",
      });
      
      await fetchKols();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error updating KOL",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteKol = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('kols')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "KOL deleted",
        description: "KOL has been deleted successfully",
      });
      
      await fetchKols();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error deleting KOL",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Social Media CRUD
  const addSocialMedia = async (socialMedia: Omit<KolSocialMedia, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Map username to handle for database compatibility
      const dbSocialMedia = {
        ...socialMedia,
        handle: socialMedia.username,
      };
      
      // Remove username as it's not in the database schema
      delete (dbSocialMedia as any).username;
      
      const { data, error } = await supabase
        .from('kol_social_media')
        .insert(dbSocialMedia)
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Social Media Added",
        description: "Social media platform has been added successfully",
      });
      
      // Fetch updated data with correct mapping
      await fetchSocialMedia(socialMedia.kol_id);
      
      // Map back for the return type
      const mappedData: KolSocialMedia[] = (data || []).map(item => ({
        ...item,
        username: item.handle || '',
      })) as KolSocialMedia[];
      
      return mappedData;
    } catch (err) {
      toast({
        title: "Error adding social media",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    }
  };
  
  const updateSocialMedia = async (id: string, updates: Partial<KolSocialMedia>) => {
    try {
      // Create a copy for database update
      const dbUpdates = { ...updates };
      
      // Map username to handle if it exists in updates
      if (updates.username !== undefined) {
        (dbUpdates as any).handle = updates.username;
        delete (dbUpdates as any).username;
      }
      
      const { data, error } = await supabase
        .from('kol_social_media')
        .update(dbUpdates)
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Social Media Updated",
        description: "Social media information has been updated successfully",
      });
      
      if (data && data.length > 0) {
        await fetchSocialMedia(data[0].kol_id);
      }
      
      // Map back for the return type
      const mappedData: KolSocialMedia[] = (data || []).map(item => ({
        ...item,
        username: item.handle || '',
      })) as KolSocialMedia[];
      
      return mappedData;
    } catch (err) {
      toast({
        title: "Error updating social media",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    }
  };
  
  const deleteSocialMedia = async (id: string, kolId: string) => {
    try {
      const { error } = await supabase
        .from('kol_social_media')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Social Media Deleted",
        description: "Social media platform has been removed successfully",
      });
      
      await fetchSocialMedia(kolId);
      return true;
    } catch (err) {
      toast({
        title: "Error deleting social media",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Rates CRUD
  const addRate = async (rate: Omit<KolRate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('kol_rates')
        .insert(rate)
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Rate Card Added",
        description: "Rate card has been added successfully",
      });
      
      await fetchRates(rate.kol_id);
      return data;
    } catch (err) {
      toast({
        title: "Error adding rate card",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    }
  };
  
  const updateRate = async (id: string, updates: Partial<KolRate>) => {
    try {
      const { data, error } = await supabase
        .from('kol_rates')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Rate Card Updated",
        description: "Rate card information has been updated successfully",
      });
      
      if (data && data.length > 0) {
        await fetchRates(data[0].kol_id);
      }
      return data;
    } catch (err) {
      toast({
        title: "Error updating rate card",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    }
  };
  
  const deleteRate = async (id: string, kolId: string) => {
    try {
      const { error } = await supabase
        .from('kol_rates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Rate Card Deleted",
        description: "Rate card has been removed successfully",
      });
      
      await fetchRates(kolId);
      return true;
    } catch (err) {
      toast({
        title: "Error deleting rate card",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Metrics CRUD
  const addOrUpdateMetrics = async (metrics: Omit<KolMetrics, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Check if metrics exist for this KOL
      const { data: existingMetrics } = await supabase
        .from('kol_metrics')
        .select('id')
        .eq('kol_id', metrics.kol_id)
        .maybeSingle();
      
      let data;
      if (existingMetrics) {
        // Update existing metrics
        const { data: updateData, error: updateError } = await supabase
          .from('kol_metrics')
          .update(metrics)
          .eq('id', existingMetrics.id)
          .select();
          
        if (updateError) throw updateError;
        data = updateData;
        
        toast({
          title: "Metrics Updated",
          description: "Metrics have been updated successfully",
        });
      } else {
        // Insert new metrics
        const { data: insertData, error: insertError } = await supabase
          .from('kol_metrics')
          .insert(metrics)
          .select();
          
        if (insertError) throw insertError;
        data = insertData;
        
        toast({
          title: "Metrics Added",
          description: "Metrics have been added successfully",
        });
      }
      
      await fetchMetrics(metrics.kol_id);
      return data;
    } catch (err) {
      toast({
        title: "Error saving metrics",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
      return null;
    }
  };
  
  useEffect(() => {
    if (organization?.id) {
      fetchKols();
    }
  }, [organization?.id]);
  
  return {
    kols,
    socialMedia,
    rates,
    metrics,
    loading,
    error,
    fetchKols,
    fetchSocialMedia,
    fetchRates,
    fetchMetrics,
    createKol,
    updateKol,
    deleteKol,
    addSocialMedia,
    updateSocialMedia,
    deleteSocialMedia,
    addRate,
    updateRate,
    deleteRate,
    addOrUpdateMetrics
  };
};
