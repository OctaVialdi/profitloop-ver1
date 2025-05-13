
import { ContentPlanItem, TeamMember, SubService } from './types';
import { format, parseISO } from 'date-fns';

export function getContentPlansWithFormattedData(contentPlans: ContentPlanItem[]): ContentPlanItem[] {
  return contentPlans.map(item => {
    const postDate = item.post_date ? new Date(item.post_date) : null;
    const actualPostDate = item.actual_post_date ? new Date(item.actual_post_date) : null;
    
    let onTimeStatus = '';
    if (postDate && actualPostDate) {
      onTimeStatus = postDate >= actualPostDate ? 'On Time' : 'Late';
    }
    
    let statusContent = '';
    if (item.status === 'Done' && !item.done) {
      statusContent = 'Waiting For Upload';
    } else if (item.done) {
      statusContent = 'Done';
    }
    
    return {
      ...item,
      on_time_status: onTimeStatus,
      status_content: item.status_content || statusContent
    };
  });
}

export function getFilteredTeamMembers(teamMembers: TeamMember[], department: string): TeamMember[] {
  if (!department || department === 'all') {
    return teamMembers;
  }
  return teamMembers.filter(member => 
    member.department?.toLowerCase() === department.toLowerCase() ||
    member.job_position?.toLowerCase() === department.toLowerCase());
}

export function getFilteredSubServices(subServices: SubService[], serviceId: string): SubService[] {
  if (!serviceId) {
    return [];
  }
  return subServices.filter(subService => subService.service_id === serviceId);
}

export function formatDisplayDate(dateString: string | null, includeTime: boolean = false): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, includeTime ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString?.toString() || '';
  }
}
