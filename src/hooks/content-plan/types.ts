
export interface ContentPlanItem {
  id: string;
  title?: string;
  brief?: string;
  status?: string;
  progress?: number;
  post_date?: string;
  actual_post_date?: string;
  pic_id?: string;
  pic_production_id?: string;
  google_drive_link?: string;
  post_link?: string;
  content_type_id?: string;
  service_id?: string;
  sub_service_id?: string;
  content_pillar_id?: string;
  production_status?: string;
  status_content?: string;
  organization_id?: string;
  on_time_status?: string;
  revision_count?: number;
  production_revision_count?: number;
  content_type?: { name: string } | null;
  service?: { name: string } | null;
  sub_service?: { name: string } | null;
  content_pillar?: { name: string } | null;
  pic?: { name: string } | null;
  pic_production?: { name: string } | null;
}

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  organization_id?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
}

export interface SubService {
  id: string;
  name: string;
  service_id: string;
  description?: string;
  organization_id?: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
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
}
