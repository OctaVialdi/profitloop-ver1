
import { ContentPlanItem, TeamMember, SubService } from './types';
import { format } from 'date-fns';

// Format date for display
export const formatDisplayDate = (dateString: string | null, includeTime: boolean = false): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return includeTime 
      ? format(date, 'dd MMM yyyy HH:mm')
      : format(date, 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Calculate on-time status
export const calculateOnTimeStatus = (item: ContentPlanItem): string => {
  if (!item.post_date || !item.actual_post_date) return 'Unknown';
  
  const plannedDate = new Date(item.post_date);
  const actualDate = new Date(item.actual_post_date);
  
  // Reset hours to compare just the dates
  plannedDate.setHours(0, 0, 0, 0);
  actualDate.setHours(0, 0, 0, 0);
  
  if (actualDate.getTime() === plannedDate.getTime()) {
    return 'On Time';
  } else if (actualDate.getTime() < plannedDate.getTime()) {
    return 'Early';
  } else {
    return 'Late';
  }
};

// Process content plans to include on-time status
export const getContentPlansWithFormattedData = (contentPlans: ContentPlanItem[]): ContentPlanItem[] => {
  return contentPlans.map(plan => {
    let onTimeStatus = 'N/A';
    
    if (plan.done && plan.actual_post_date && plan.post_date) {
      onTimeStatus = calculateOnTimeStatus(plan);
    }
    
    return {
      ...plan,
      on_time_status: onTimeStatus,
    };
  });
};

// Filter team members by department
export const getFilteredTeamMembers = (teamMembers: TeamMember[], department: string): TeamMember[] => {
  if (!department || department === 'all') {
    return teamMembers;
  }
  return teamMembers.filter(member => member.department.toLowerCase() === department.toLowerCase());
};

// Filter sub-services by service ID
export const getFilteredSubServices = (subServices: SubService[], serviceId: string): SubService[] => {
  if (!serviceId) {
    return [];
  }
  return subServices.filter(subService => subService.service_id === serviceId);
};
