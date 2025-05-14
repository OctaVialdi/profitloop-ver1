
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganizationSetup } from '../useOrganizationSetup';
import { ContentPlan } from './types';
import { useFetchContentPlan } from './hooks/useFetchContentPlan';
import { useMutateContentPlan } from './hooks/useMutateContentPlan';
import { useTeamMembersFilter } from './hooks/useTeamMembersFilter';

export function useContentPlan() {
  const { organization } = useOrganizationSetup();
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { fetchContentPlans } = useFetchContentPlan(setContentPlans, setIsLoading, setError);
  const { addContentPlan, updateContentPlan, deleteContentPlan } = useMutateContentPlan();
  const { filteredMembers, filterMembers } = useTeamMembersFilter();
  
  useEffect(() => {
    if (organization?.id) {
      fetchContentPlans(organization.id);
    }
  }, [organization?.id, fetchContentPlans]);
  
  return {
    contentPlans,
    isLoading,
    error,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    filteredMembers,
    filterMembers
  };
}
