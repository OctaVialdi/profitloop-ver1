export interface ContentPlanItem {
  id: string;
  post_date: string | null;
  content_type_id: string | null;
  pic_id: string | null;
  service_id: string | null;
  sub_service_id: string | null;
  title: string | null;
  content_pillar_id: string | null;
  brief: string | null;
  status: string;
  revision_count: number;
  approved: boolean;
  completion_date: string | null;
  pic_production_id: string | null;
  google_drive_link: string | null;
  production_status: string;
  production_revision_count: number;
  production_completion_date: string | null;
  production_approved: boolean;
  production_approved_date: string | null;
  post_link: string | null;
  done: boolean;
  actual_post_date: string | null;
  organization_id: string | null;
  
  // Virtual/computed fields
  on_time_status?: string;
  status_content?: string;
  
  // Populated references - now with nullable fields to handle errors
  content_type?: {
    id: string;
    name: string;
  } | null;
  pic?: {
    id: string;
    name: string;
    job_position: string;
    department: string;
  } | null;
  service?: {
    id: string;
    name: string;
  } | null;
  sub_service?: {
    id: string;
    name: string;
  } | null;
  content_pillar?: {
    id: string;
    name: string;
  } | null;
  pic_production?: {
    id: string;
    name: string;
    job_position: string;
    department: string;
  } | null;
}

export interface ContentType {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  job_position: string;
  department: string;
  role?: string;
  organization_id: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  service_id: string;
  name: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  funnel_stage?: string;
}

export interface ContentPlanHookReturn {
  contentPlans: ContentPlanItem[];
  contentTypes: ContentType[];
  teamMembers: TeamMember[];
  services: Service[];
  subServices: SubService[];
  contentPillars: ContentPillar[];
  loading: boolean;
  error: Error | null;
  fetchContentPlans: () => Promise<void>;
  addContentPlan: (newPlan: Partial<ContentPlanItem>) => Promise<any>;
  updateContentPlan: (id: string, updates: Partial<ContentPlanItem>) => Promise<boolean>;
  deleteContentPlan: (id: string) => Promise<boolean>;
  getFilteredTeamMembers: (department: string) => TeamMember[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  getContentPlannerTeamMembers: () => TeamMember[];
  getCreativeTeamMembers: () => TeamMember[];
}
