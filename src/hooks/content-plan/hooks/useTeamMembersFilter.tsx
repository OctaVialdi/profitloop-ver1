
import { LegacyEmployee } from '@/hooks/useEmployees';
import { SubService } from '../types';
import { getFilteredSubServices } from '../contentPlanUtils';

export interface TeamMembersFilterReturn {
  getFilteredTeamMembers: (position: string) => LegacyEmployee[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  getContentPlannerTeamMembers: (teamMembers: LegacyEmployee[]) => LegacyEmployee[];
  getCreativeTeamMembers: (teamMembers: LegacyEmployee[]) => LegacyEmployee[];
}

export function useTeamMembersFilter(
  teamMembers: LegacyEmployee[], 
  subServices: SubService[]
): TeamMembersFilterReturn {
  // Filter employees by job position
  const getFilteredTeamMembers = (position: string): LegacyEmployee[] => {
    return teamMembers.filter(member => 
      member.jobPosition === position
    );
  };

  // Modified function to match the required signature in ContentPlanHookReturn
  const getFilteredSubServicesWrapper = (serviceId: string): SubService[] => {
    return getFilteredSubServices(subServices, serviceId);
  };

  // Utility function to get only Content Planner team members from the list
  const getContentPlannerTeamMembers = (teamMembers: LegacyEmployee[]) => {
    return teamMembers.filter(member => 
      member.jobPosition === "Content Planner");
  };
  
  // Utility function to get only Creative team members from the list
  const getCreativeTeamMembers = (teamMembers: LegacyEmployee[]) => {
    return teamMembers.filter(member => 
      member.jobPosition === "Creative");
  };

  return {
    getFilteredTeamMembers,
    getFilteredSubServices: getFilteredSubServicesWrapper,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  };
}
