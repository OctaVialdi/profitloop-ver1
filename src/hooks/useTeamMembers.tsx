import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useOrganization } from '@/hooks/useOrganization';
import { supabase } from "@/integrations/supabase/client";

export type TeamMember = {
  id: string;
  name: string;
  department: string;
  role: string;
  job_position: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
};

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { organization } = useOrganization();

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!organization?.id) {
        throw new Error('Organization ID is required to fetch team members');
      }
      
      console.log('Fetching team members for organization:', organization.id);
      
      const { data, error } = await supabase
        .from('team_members_digital_marketing')
        .select('*')
        .eq('organization_id', organization.id);
      
      if (error) {
        throw error;
      }
      
      console.log('Team members fetched:', data);
      setTeamMembers(data || []);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err);
      toast("Error", {
        description: `Failed to load team members: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async (newMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!organization?.id) {
        throw new Error('Organization ID is required to add team member');
      }
      
      // Ensure organization_id is set
      const memberWithOrg = {
        ...newMember,
        organization_id: organization.id
      };
      
      console.log('Adding team member with data:', memberWithOrg);
      
      const { data, error } = await supabase
        .from('team_members_digital_marketing')
        .insert(memberWithOrg)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast("Success", {
        description: "Team member added successfully",
      });
      
      await fetchTeamMembers();
      return data;
    } catch (err: any) {
      console.error('Error adding team member:', err);
      toast("Error", {
        description: `Failed to add team member: ${err.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      console.log(`Updating team member ${id} with:`, updates);
      
      const { data, error } = await supabase
        .from('team_members_digital_marketing')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast("Success", {
        description: "Team member updated successfully",
      });
      
      await fetchTeamMembers();
      return data;
    } catch (err: any) {
      console.error('Error updating team member:', err);
      toast("Error", {
        description: `Failed to update team member: ${err.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      console.log(`Deleting team member ${id}`);
      
      const { error } = await supabase
        .from('team_members_digital_marketing')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast("Success", {
        description: "Team member deleted successfully",
      });
      
      await fetchTeamMembers();
      return true;
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      toast("Error", {
        description: `Failed to delete team member: ${err.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchTeamMembers();
    }
  }, [organization?.id]);

  return {
    teamMembers,
    isLoading,
    error,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  };
}
