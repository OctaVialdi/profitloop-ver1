
import { ContentPlanItem, SubService } from './types';
import { format, parseISO } from 'date-fns';

// Filter subservices by service ID
export function getFilteredSubServices(subServices: SubService[], serviceId: string): SubService[] {
  return subServices.filter(subService => subService.service_id === serviceId);
}

// Format the date for display
export function formatDisplayDate(dateString: string | null, includeTime: boolean = false): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, includeTime ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy');
  } catch (err) {
    console.error('Error formatting date:', err);
    return dateString;
  }
}

// Process content plans and add computed fields
export function getContentPlansWithFormattedData(contentPlans: ContentPlanItem[]): ContentPlanItem[] {
  return contentPlans.map(plan => {
    // Calculate on-time status
    let onTimeStatus = '';
    if (plan.done && plan.post_date && plan.actual_post_date) {
      const postDate = new Date(plan.post_date);
      const actualDate = new Date(plan.actual_post_date);
      
      onTimeStatus = actualDate <= postDate ? 'On Time' : 'Late';
    }

    // Calculate status content based on production status and approval
    let statusContent = '';
    if (plan.production_approved) {
      statusContent = 'Approved';
    } else if (plan.production_status && plan.production_status.length > 0) {
      statusContent = plan.production_status;
    } else {
      statusContent = 'Pending';
    }

    return {
      ...plan,
      on_time_status: onTimeStatus,
      status_content: statusContent
    };
  });
}
