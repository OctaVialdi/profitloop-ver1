
export interface ContentPlanItem {
  id: string;
  post_date: string;
  content_type_id: string;
  content_type: { name: string } | string | null;
  pic_id: string;
  pic: { name: string } | string | null;
  service_id: string;
  service: { name: string } | string | null;
  sub_service_id: string | null;
  sub_service: { name: string } | string | null;
  title: string;
  content_pillar_id: string | null;
  content_pillar: { name: string } | string | null;
  brief: string | null;
  status: string;
  revision_count: number;
  approved: boolean;
  completion_date: string | null;
  pic_production_id: string | null;
  pic_production: { name: string } | string | null;
  google_drive_link: string | null;
  production_status: string;
  production_revision_count: number;
  production_completion_date: string | null;
  production_approved: boolean;
  production_approved_date: string | null;
  post_link: string | null;
  done: boolean;
  actual_post_date: string | null;
  status_content: string | null;
  on_time_status?: string;
  created_at: string;
  updated_at: string;
  organization_id: string | null;
}

export interface ContentType {
  id: string;
  name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  job_position: string;
  organization_id?: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  name: string;
  service_id: string;
}

export interface ContentPillar {
  id: string;
  name: string;
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
  addContentPlan: (newPlan: Partial<ContentPlanItem>) => Promise<ContentPlanItem | null>;
  updateContentPlan: (id: string, updates: Partial<ContentPlanItem>) => Promise<boolean>;
  deleteContentPlan: (id: string) => Promise<boolean>;
  getFilteredTeamMembers: (department: string) => TeamMember[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  // New specialized functions
  getTeamMembersByJobPosition: (jobPosition: string) => TeamMember[];
  getContentPlanners: () => TeamMember[];
  getCreativeTeamMembers: () => TeamMember[];
}
