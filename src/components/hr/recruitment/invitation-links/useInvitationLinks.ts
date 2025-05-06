
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InvitationLink, JobPosition } from './types';

// Application base URL - change this to your domain in production
const APPLICATION_BASE_URL = "https://app.profitloop.id";

export function useInvitationLinks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch invitation links and job positions when the component loads
  useEffect(() => {
    fetchInvitationLinks();
    fetchJobPositions();
  }, []);
  
  const fetchInvitationLinks = async () => {
    setIsRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      const { data: links, error } = await supabase
        .from('recruitment_links')
        .select(`
          id, 
          job_position_id,
          token,
          created_at,
          expires_at,
          clicks,
          submissions,
          status,
          job_positions(title)
        `)
        .eq('organization_id', profileData.organization_id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (links) {
        const formattedLinks: InvitationLink[] = links.map(link => ({
          id: link.id,
          position: link.job_positions?.title || 'General Application',
          link: `${APPLICATION_BASE_URL}/apply/${link.token}`,
          createdAt: new Date(link.created_at).toLocaleDateString(),
          expiresAt: link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'N/A',
          clicks: link.clicks || 0,
          submissions: link.submissions || 0,
          status: link.status as 'active' | 'expired' | 'disabled'
        }));
        
        setInvitationLinks(formattedLinks);
      }
    } catch (error: any) {
      console.error("Error fetching invitation links:", error);
      toast.error("Failed to fetch invitation links");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const fetchJobPositions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      const { data, error } = await supabase
        .from('job_positions')
        .select('id, title')
        .eq('status', 'active')
        .eq('organization_id', profileData.organization_id);
        
      if (error) throw error;
      
      if (data) {
        setJobPositions(data);
      }
    } catch (error: any) {
      console.error("Error fetching job positions:", error);
      toast.error("Failed to fetch job positions");
    }
  };

  const handleGenerateLink = async (selectedPosition: string, expirationPeriod: string) => {
    if (!selectedPosition) {
      toast.error("Please select a position");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the user's organization ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      // Call the Supabase function to generate a link
      const { data, error } = await supabase.rpc(
        'generate_recruitment_link',
        { 
          p_organization_id: profileData.organization_id,
          p_job_position_id: selectedPosition,
          p_expires_in_days: parseInt(expirationPeriod)
        }
      );
      
      if (error) throw error;
      
      toast.success("New invitation link generated");
      await fetchInvitationLinks(); // Refresh the list
      setIsDialogOpen(false);
      
    } catch (error: any) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate link");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invitationLinks,
    jobPositions,
    isRefreshing,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    fetchInvitationLinks,
    handleGenerateLink
  };
}
