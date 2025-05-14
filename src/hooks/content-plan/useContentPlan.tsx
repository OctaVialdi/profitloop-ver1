
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';
import { ContentPlanItem, ContentType, Service, SubService, ContentPillar } from './types';
import { formatDisplayDate, getFilteredSubServices } from './contentPlanUtils';
import { useFetchContentPlan } from './hooks/useFetchContentPlan';
import { useMutateContentPlan } from './hooks/useMutateContentPlan';
import { LegacyEmployee } from '@/hooks/useEmployees';

export const useContentPlan = () => {
  const { organization } = useOrganization();
  
  // Use existing hooks for data fetching and mutations
  const {
    contentPlans,
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans
  } = useFetchContentPlan();

  const {
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    resetRevisionCounter
  } = useMutateContentPlan();

  // Filter team members by job position
  const getContentPlannerTeamMembers = useCallback((): LegacyEmployee[] => {
    // Convert teamMembers to LegacyEmployee format
    return teamMembers.filter(member => 
      member.job_position?.toLowerCase().includes('content') || 
      member.department?.toLowerCase().includes('marketing')
    ).map(member => ({
      id: member.id,
      name: member.name,
      jobPosition: member.job_position || '',
      organization: member.department || '',
      role: member.role || ''
    }));
  }, [teamMembers]);

  const getCreativeTeamMembers = useCallback((): LegacyEmployee[] => {
    // Convert teamMembers to LegacyEmployee format
    return teamMembers.filter(member => 
      member.job_position?.toLowerCase().includes('creative') || 
      member.job_position?.toLowerCase().includes('design')
    ).map(member => ({
      id: member.id,
      name: member.name,
      jobPosition: member.job_position || '',
      organization: member.department || '',
      role: member.role || ''
    }));
  }, [teamMembers]);

  return {
    contentPlans,
    contentTypes,
    services,
    subServices,
    contentPillars,
    teamMembers,
    loading,
    error,
    fetchContentPlans,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredSubServices: (serviceId: string) => getFilteredSubServices(subServices, serviceId),
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  };
};
