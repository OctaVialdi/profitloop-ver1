
import { formatDisplayDate } from './contentPlanUtils';
import { getContentPlansWithFormattedData } from './contentPlanUtils';
import { ContentPlanHookReturn } from './types';
import { useFetchContentPlan } from './hooks/useFetchContentPlan';
import { useMutateContentPlan } from './hooks/useMutateContentPlan';
import { useTeamMembersFilter } from './hooks/useTeamMembersFilter';

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
  } = useMutateContentPlan(fetchContentPlans);

  // Team members filter hooks
  const {
    getFilteredTeamMembers,
    getFilteredSubServices,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  } = useTeamMembersFilter(teamMembers, subServices);

  // Format content plans with computed fields
  const contentPlans = getContentPlansWithFormattedData(rawContentPlans);

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
    getContentPlannerTeamMembers: () => getContentPlannerTeamMembers(teamMembers),
    getCreativeTeamMembers: () => getCreativeTeamMembers(teamMembers)
  };
}
