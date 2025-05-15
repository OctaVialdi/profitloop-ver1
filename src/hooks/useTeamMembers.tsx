
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from "@/hooks/use-toast";

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  job_position: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
}

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useOrganization();

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!organization?.id) {
        setError('No organization ID found');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('team_members_digital_marketing')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (fetchError) throw fetchError;

      setTeamMembers(data || []);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'Failed to fetch team members');
      toast("Error", {
        description: "Failed to fetch team members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      if (!organization?.id) {
        throw new Error('No organization ID found');
      }

      const { data, error: insertError } = await supabase
        .from('team_members_digital_marketing')
        .insert({
          ...memberData,
          organization_id: organization.id,
        })
        .select();

      if (insertError) throw insertError;

      toast("Success", {
        description: "Team member has been added successfully"
      });
      
      fetchTeamMembers();
      return data?.[0];
    } catch (err: any) {
      console.error('Error adding team member:', err);
      toast("Error", {
        description: err.message || "Failed to add team member",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTeamMember = async (id: string, memberData: Partial<TeamMember>) => {
    try {
      setLoading(true);
      
      if (!organization?.id) {
        throw new Error('No organization ID found');
      }

      const { data, error: updateError } = await supabase
        .from('team_members_digital_marketing')
        .update(memberData)
        .eq('id', id)
        .eq('organization_id', organization.id)
        .select();

      if (updateError) throw updateError;

      toast("Success", {
        description: "Team member has been updated successfully"
      });
      
      fetchTeamMembers();
      return data?.[0];
    } catch (err: any) {
      console.error('Error updating team member:', err);
      toast("Error", {
        description: err.message || "Failed to update team member",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      setLoading(true);
      
      if (!organization?.id) {
        throw new Error('No organization ID found');
      }

      const { error: deleteError } = await supabase
        .from('team_members_digital_marketing')
        .delete()
        .eq('id', id)
        .eq('organization_id', organization.id);

      if (deleteError) throw deleteError;

      toast("Success", {
        description: "Team member has been deleted successfully"
      });
      
      fetchTeamMembers();
      return true;
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      toast("Error", {
        description: err.message || "Failed to delete team member",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchTeamMembers();
    }
  }, [organization?.id]);

  return {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
};
