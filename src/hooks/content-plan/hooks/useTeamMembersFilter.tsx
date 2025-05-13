
import { TeamMember, SubService } from '../types';
import { getFilteredTeamMembers, getFilteredSubServices } from '../contentPlanUtils';

export interface TeamMembersFilterReturn {
  getFilteredTeamMembers: (department: string) => TeamMember[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  getContentPlannerTeamMembers: (teamMembers: TeamMember[]) => TeamMember[];
  getCreativeTeamMembers: (teamMembers: TeamMember[]) => TeamMember[];
}

export function useTeamMembersFilter(
  teamMembers: TeamMember[], 
  subServices: SubService[]
): TeamMembersFilterReturn {
  // Modified function to match the required signature in ContentPlanHookReturn
  const getFilteredTeamMembersWrapper = (department: string): TeamMember[] => {
    return getFilteredTeamMembers(teamMembers, department);
  };

  // Modified function to match the required signature in ContentPlanHookReturn
  const getFilteredSubServicesWrapper = (serviceId: string): SubService[] => {
    return getFilteredSubServices(subServices, serviceId);
  };

  // Utility function to get only Content Planner team members from the list
  const getContentPlannerTeamMembers = (teamMembers: TeamMember[]) => {
    return teamMembers.filter(member => 
      member.job_position === "Content Planner" || member.department === "Content Planner");
  };
  
  // Utility function to get only Creative team members from the list
  const getCreativeTeamMembers = (teamMembers: TeamMember[]) => {
    return teamMembers.filter(member => 
      member.job_position === "Creative" || member.department === "Creative" || member.role === "Produksi");
  };

  return {
    getFilteredTeamMembers: getFilteredTeamMembersWrapper,
    getFilteredSubServices: getFilteredSubServicesWrapper,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  };
}
