
import { formatDisplayDate } from './contentPlanUtils';
import { getContentPlansWithFormattedData } from './contentPlanUtils';
import { ContentPlanHookReturn } from './types';
import { useFetchContentPlan } from './hooks/useFetchContentPlan';
import { useMutateContentPlan } from './hooks/useMutateContentPlan';
import { useTeamMembersFilter } from './hooks/useTeamMembersFilter';
import { useCallback, useMemo } from 'react';

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

  // Memoize team member getter functions
  const memoizedGetContentPlannerTeamMembers = useCallback(() => 
    getContentPlannerTeamMembers(teamMembers),
    [teamMembers, getContentPlannerTeamMembers]
  );
  
  const memoizedGetCreativeTeamMembers = useCallback(() => 
    getCreativeTeamMembers(teamMembers),
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
