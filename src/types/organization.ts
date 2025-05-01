
export interface Organization {
  id: string;
  name: string;
  business_field: string | null;
  employee_count: number | null;
  address: string | null;
  phone: string | null;
  subscription_plan_id: string | null;
  trial_end_date: string | null;
  trial_expired: boolean | null;
  theme_settings: Record<string, any> | null;
  logo_path: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  max_members: number | null;
  price: number | null;
  features: Record<string, any> | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  organization_id: string | null;
  role: 'super_admin' | 'admin' | 'employee' | null;
  invited_by: string | null;
  timezone: string | null; // Added timezone property
  preferences: Record<string, any> | null; // Added preferences property
}

export interface OrganizationData {
  organization: Organization | null;
  subscriptionPlan: SubscriptionPlan | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  hasPaidSubscription: boolean;
  refreshData: () => Promise<void>;
}
