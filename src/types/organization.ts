
export interface UserPreferences {
  dark_mode?: boolean;
  marketing_emails?: boolean;
  notification_emails?: boolean;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  organization_id?: string;
  role?: string;
  email_verified?: boolean;
  has_seen_welcome?: boolean;
  last_active?: string;
  created_at?: string;
  invited_by?: string;
  timezone?: string;
  preferences: UserPreferences;
}

export interface Organization {
  id: string;
  name: string;
  business_field?: string;
  address?: string;
  phone?: string;
  employee_count?: number;
  trial_end_date?: string;
  trial_expired?: boolean;
  subscription_status?: string;
  subscription_plan_id?: string;
  logo_path?: string;
  theme_settings?: {
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    sidebar_color?: string;
  };
  created_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  max_members?: number;
  features?: Record<string, any>;
  created_at?: string;
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
