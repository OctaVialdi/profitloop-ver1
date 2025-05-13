
import { ContentPlanItem, SubService } from './types';
import { format, parseISO } from 'date-fns';

// Function to format a date for display
export const formatDisplayDate = (dateString: string | null, includeTime: boolean = false): string => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, includeTime ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Process content plans and add computed fields
export const getContentPlansWithFormattedData = (contentPlans: ContentPlanItem[]): ContentPlanItem[] => {
  return contentPlans.map(plan => {
    // Compute on-time status
    let onTimeStatus = '';
    if (plan.post_date && plan.actual_post_date) {
      const postDate = new Date(plan.post_date);
      const actualDate = new Date(plan.actual_post_date);
      
      onTimeStatus = actualDate <= postDate ? 'On Time' : 'Late';
    }
    
    return {
      ...plan,
      on_time_status: onTimeStatus
    };
  });
};

// Filter sub-services by service ID
export const getFilteredSubServices = (subServices: SubService[], serviceId: string): SubService[] => {
  if (!serviceId) return [];
  return subServices.filter(subService => subService.service_id === serviceId);
};

// Extract links from text
export const extractLink = (text: string | null): string | null => {
  if (!text) return null;
  
  // Simple regex to match URLs
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(urlRegex);
  
  return matches && matches.length > 0 ? matches[0] : null;
};
