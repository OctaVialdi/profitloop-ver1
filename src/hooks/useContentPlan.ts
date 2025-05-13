
import { useState, useEffect, useCallback } from 'react';
import { format, differenceInDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Types definitions
export interface ContentPlanItem {
  id: string;
  post_date: string;
  content_type_id?: string;
  pic_id?: string;
  service_id?: string;
  sub_service_id?: string;
  title?: string;
  content_pillar_id?: string;
  brief?: string;
  status?: string;
  revision_count: number;
  approved: boolean;
  completion_date?: string;
  pic_production_id?: string;
  google_drive_link?: string;
  production_status?: string;
  production_revision_count: number;
  production_completion_date?: string;
  production_approved: boolean;
  production_approved_date?: string;
  post_link?: string;
  done: boolean;
  actual_post_date?: string;
  on_time_status?: string;
  status_content?: string;
  [key: string]: any;
}

interface ContentType {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
}

interface Service {
  id: string;
  name: string;
}

interface SubService {
  id: string;
  name: string;
  service_id: string;
}

interface ContentPillar {
  id: string;
  name: string;
  funnel_stage?: string; // Added funnel_stage as an optional property
}

// Mock data functions
const generateMockData = () => {
  // Content Types
  const contentTypes: ContentType[] = [
    { id: 'ct1', name: 'Blog Post' },
    { id: 'ct2', name: 'Social Media Post' },
    { id: 'ct3', name: 'Video' },
    { id: 'ct4', name: 'Infographic' },
    { id: 'ct5', name: 'Podcast' },
  ];

  // Team Members - Updated to include proper roles and departments
  const teamMembers: TeamMember[] = [
    { id: 'tm1', name: 'John Doe', department: 'Marketing', role: 'Content Planner' },
    { id: 'tm2', name: 'Jane Smith', department: 'Marketing', role: 'Content Planner' },
    { id: 'tm3', name: 'Mike Johnson', department: 'Creative', role: 'Produksi' },
    { id: 'tm4', name: 'Sarah Davis', department: 'Creative', role: 'Produksi' },
    { id: 'tm5', name: 'Robert Wilson', department: 'Creative', role: 'Designer' },
    { id: 'tm6', name: 'Fajar', department: 'Marketing', role: 'Content Planner' },
    { id: 'tm7', name: 'Fajar Budiansyah', department: 'Marketing', role: 'Content Planner' },
  ];

  // Services
  const services: Service[] = [
    { id: 's1', name: 'Digital Marketing' },
    { id: 's2', name: 'Branding' },
    { id: 's3', name: 'Web Development' },
  ];

  // Sub Services
  const subServices: SubService[] = [
    { id: 'ss1', name: 'SEO', service_id: 's1' },
    { id: 'ss2', name: 'Social Media', service_id: 's1' },
    { id: 'ss3', name: 'Email Marketing', service_id: 's1' },
    { id: 'ss4', name: 'Logo Design', service_id: 's2' },
    { id: 'ss5', name: 'Visual Identity', service_id: 's2' },
    { id: 'ss6', name: 'Frontend', service_id: 's3' },
    { id: 'ss7', name: 'Backend', service_id: 's3' },
  ];

  // Content Pillars with funnel_stage property
  const contentPillars: ContentPillar[] = [
    { id: 'cp1', name: 'Education', funnel_stage: 'top' },
    { id: 'cp2', name: 'Entertainment', funnel_stage: 'middle' },
    { id: 'cp3', name: 'Inspiration', funnel_stage: 'middle' },
    { id: 'cp4', name: 'Promotion', funnel_stage: 'bottom' },
  ];

  // Sample content plans
  const today = new Date();
  const contentPlans: ContentPlanItem[] = [
    {
      id: uuidv4(),
      post_date: format(today, 'yyyy-MM-dd'),
      content_type_id: 'ct2',
      pic_id: 'tm1',
      service_id: 's1',
      sub_service_id: 'ss2',
      title: 'Social Media Best Practices 2025',
      content_pillar_id: 'cp1',
      brief: 'Create a post about the top social media best practices for 2025. Include https://docs.google.com/document/d/1234567890 for details.',
      status: 'Butuh Di Review',
      revision_count: 0,
      approved: true,
      completion_date: format(today, 'yyyy-MM-dd HH:mm'),
      pic_production_id: 'tm3',
      google_drive_link: 'https://drive.google.com/file/d/1234567890',
      production_status: 'Request Revisi',
      production_revision_count: 1,
      production_completion_date: format(today, 'yyyy-MM-dd HH:mm'),
      production_approved: false,
      production_approved_date: undefined,
      post_link: '',
      done: false,
      actual_post_date: undefined,
      on_time_status: '',
      status_content: '',
    },
    {
      id: uuidv4(),
      post_date: format(new Date(today.getTime() + 86400000), 'yyyy-MM-dd'),
      content_type_id: 'ct1',
      pic_id: 'tm6', // Using Fajar as PIC
      service_id: 's2',
      sub_service_id: 'ss4',
      title: 'Logo Design Trends for Startups',
      content_pillar_id: 'cp3',
      brief: 'Write a comprehensive blog post about logo design trends for startups in 2025.',
      status: '',
      revision_count: 0,
      approved: false,
      completion_date: undefined,
      pic_production_id: '',
      google_drive_link: '',
      production_status: '',
      production_revision_count: 0,
      production_completion_date: undefined,
      production_approved: false,
      production_approved_date: undefined,
      post_link: '',
      done: false,
      actual_post_date: undefined,
      on_time_status: '',
      status_content: '',
    },
  ];

  return {
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    contentPlans,
  };
};

export function useContentPlan() {
  const [contentPlans, setContentPlans] = useState<ContentPlanItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be API calls
        const mockData = generateMockData();
        setContentTypes(mockData.contentTypes);
        setTeamMembers(mockData.teamMembers);
        setServices(mockData.services);
        setSubServices(mockData.subServices);
        setContentPillars(mockData.contentPillars);
        setContentPlans(mockData.contentPlans);
        
        // Calculate on-time status for each item
        const updatedPlans = mockData.contentPlans.map(plan => {
          if (plan.actual_post_date && plan.post_date) {
            const days = differenceInDays(new Date(plan.actual_post_date), new Date(plan.post_date));
            plan.on_time_status = days <= 0 ? "Ontime" : `Late [${days}] Day/s`;
          }
          return plan;
        });
        
        setContentPlans(updatedPlans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a new content plan
  const addContentPlan = useCallback((newPlan: Partial<ContentPlanItem>) => {
    setContentPlans(prevPlans => [
      ...prevPlans,
      {
        id: uuidv4(),
        post_date: new Date().toISOString().split('T')[0],
        revision_count: 0,
        production_revision_count: 0,
        approved: false,
        production_approved: false,
        done: false,
        status: '',
        production_status: '',
        ...newPlan
      }
    ]);
    return Promise.resolve();
  }, []);

  // Update a content plan
  const updateContentPlan = useCallback((id: string, updates: Partial<ContentPlanItem>) => {
    setContentPlans(prevPlans => 
      prevPlans.map(plan => {
        if (plan.id === id) {
          const updatedPlan = { ...plan, ...updates };

          // Calculate on-time status if we have both dates
          if (updatedPlan.actual_post_date && updatedPlan.post_date) {
            const days = differenceInDays(new Date(updatedPlan.actual_post_date), new Date(updatedPlan.post_date));
            updatedPlan.on_time_status = days <= 0 ? "Ontime" : `Late [${days}] Day/s`;
          } else {
            updatedPlan.on_time_status = '';
          }

          return updatedPlan;
        }
        return plan;
      })
    );
    return Promise.resolve();
  }, []);

  // Delete a content plan
  const deleteContentPlan = useCallback((id: string) => {
    setContentPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    return Promise.resolve();
  }, []);

  // Reset revision counter
  const resetRevisionCounter = useCallback((id: string, field: 'revision_count' | 'production_revision_count') => {
    updateContentPlan(id, { [field]: 0 });
  }, [updateContentPlan]);

  // Filter team members by role
  const getFilteredTeamMembers = useCallback((role: string) => {
    return teamMembers.filter(member => member.role === role);
  }, [teamMembers]);

  // Filter sub services by service
  const getFilteredSubServices = useCallback((serviceId: string) => {
    return subServices.filter(subService => subService.service_id === serviceId);
  }, [subServices]);

  // Format date for display
  const formatDisplayDate = useCallback((dateString: string | undefined, includeTime: boolean = false) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return includeTime 
        ? format(date, "dd MMM yyyy - HH:mm")
        : format(date, "dd MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }, []);

  return {
    contentPlans,
    contentTypes,
    teamMembers,
    services,
    subServices,
    contentPillars,
    loading,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredTeamMembers,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate
  };
}
