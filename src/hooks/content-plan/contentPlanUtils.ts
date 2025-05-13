
import { format, parseISO, differenceInDays } from 'date-fns';
import { ContentPlanItem, TeamMember, SubService } from './types';

export const getContentPlansWithFormattedData = (contentPlans: ContentPlanItem[]): ContentPlanItem[] => {
  return contentPlans.map(plan => {
    // Calculate on time status
    let onTimeStatus = '';
    if (plan.actual_post_date && plan.post_date) {
      const actualDate = new Date(plan.actual_post_date);
      const plannedDate = new Date(plan.post_date);
      
      if (actualDate <= plannedDate) {
        onTimeStatus = 'On Time';
      } else {
        const diffDays = differenceInDays(actualDate, plannedDate);
        onTimeStatus = `Late [${diffDays}] Day/s`;
      }
    }

    return {
      ...plan,
      on_time_status: onTimeStatus
    };
  });
};

export const getFilteredTeamMembers = (teamMembers: TeamMember[], jobPosition: string): TeamMember[] => {
  return teamMembers.filter(member => member.job_position === jobPosition);
};

export const getFilteredSubServices = (subServices: SubService[], serviceId: string): SubService[] => {
  return subServices.filter(subService => subService.service_id === serviceId);
};

export const formatDisplayDate = (dateString: string | null, includeTime: boolean = false): string => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return includeTime 
      ? format(date, "dd MMM yyyy - HH:mm") 
      : format(date, "dd MMM yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "";
  }
};

export const extractLink = (text: string | null): string | null => {
  if (!text) return null;
  const regex = /(https?:\/\/\S+)/g;
  const match = text.match(regex);
  return match ? match[0] : null;
};

export const truncateText = (text: string | null, maxLength: number = 25): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
