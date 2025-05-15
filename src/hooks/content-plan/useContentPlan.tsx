
import { formatDisplayDate } from './contentPlanUtils';
import { getContentPlansWithFormattedData } from './contentPlanUtils';
import { ContentPlanHookReturn } from './types';
import { useFetchContentPlan } from './hooks/useFetchContentPlan';
import { useMutateContentPlan } from './hooks/useMutateContentPlan';
import { useTeamMembersFilter } from './hooks/useTeamMembersFilter';
import { useCallback, useMemo } from 'react';
import { LegacyEmployee } from '@/hooks/useEmployees';

export function useContentPlan(): ContentPlanHookReturn {
  // Fetch content plan data
  const {
    contentPlans: rawContentPlans,
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans
  } = useFetchContentPlan();

  // Content plan mutation hooks
  const {
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    resetRevisionCounter
  } = useMutateContentPlan();

  // Team members filter hooks
  const {
    getFilteredTeamMembers,
    getFilteredSubServices,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  } = useTeamMembersFilter(teamMembers, subServices);

  // Memoize content plans with computed fields
  const contentPlans = useMemo(() => 
    getContentPlansWithFormattedData(rawContentPlans),
    [rawContentPlans]
  );

  // Update the return type specification for these functions
  const memoizedGetContentPlannerTeamMembers = useCallback((): LegacyEmployee[] => 
    getContentPlannerTeamMembers(teamMembers) as LegacyEmployee[],
    [teamMembers, getContentPlannerTeamMembers]
  );
  
  const memoizedGetCreativeTeamMembers = useCallback((): LegacyEmployee[] => 
    getCreativeTeamMembers(teamMembers) as LegacyEmployee[],
    [teamMembers, getCreativeTeamMembers]
  );

  return {
    contentPlans,
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers: memoizedGetContentPlannerTeamMembers,
    getCreativeTeamMembers: memoizedGetCreativeTeamMembers
  };
}
