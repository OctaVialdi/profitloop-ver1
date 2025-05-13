
import { ContentPlanItem, TeamMember, SubService } from './types';

// Format display date
export const formatDisplayDate = (dateString: string | null, includeTime: boolean = false): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

// Add on-time status to content plans
export const getContentPlansWithFormattedData = (contentPlans: ContentPlanItem[]): ContentPlanItem[] => {
  return contentPlans.map(plan => {
    // Calculate on_time_status if both dates are available
    const onTimeStatus = plan.actual_post_date && plan.post_date
      ? new Date(plan.actual_post_date) <= new Date(plan.post_date)
        ? 'On Time'
        : 'Late'
      : '';
    
    return {
      ...plan,
      on_time_status: onTimeStatus
    };
  });
};

// Filter team members by job position
export const getFilteredTeamMembers = (teamMembers: TeamMember[], jobPosition: string): TeamMember[] => {
  return teamMembers.filter(member => member.job_position === jobPosition);
};

// Filter sub-services by service ID
export const getFilteredSubServices = (subServices: SubService[], serviceId: string): SubService[] => {
  return subServices.filter(subService => subService.service_id === serviceId);
};

// Helper for extracting links from text
export const extractLink = (text: string | null): string | null => {
  if (!text) return null;
  const regex = /(https?:\/\/\S+)/g;
  const match = text.match(regex);
  return match ? match[0] : null;
};

// Helper for truncating text
export const truncateText = (text: string | null, maxLength: number = 25): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
