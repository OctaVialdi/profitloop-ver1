
export interface UserProfile {
  id: string;
  organization_id?: string;
  role?: string;
  email?: string;
  full_name?: string;
  timezone?: string;
  preferences?: UserPreferences;
  created_at?: string;
  last_active?: string;
  // Newly added formatted timestamp field
  created_at_formatted?: string;
}

export interface Organization {
  id: string;
  name: string;
  business_field: string | null;
  employee_count: number | null;
  address: string | null;
  phone: string | null;
  subscription_plan_id: string | null;
  trial_start_date: string | null;
  trial_end_date: string | null;
  trial_expired: boolean;
  logo_path: string | null;
  theme_settings: any;
  subscription_status: 'trial' | 'active' | 'expired';
  grace_period_end: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  max_members: number;
  price: number;
  features: any;
}

export interface UserPreferences {
  dark_mode?: boolean;
  [key: string]: any;
}

export type OrganizationData = {
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
};
