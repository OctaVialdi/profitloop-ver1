
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
  profile_image?: string | null;
  created_at_formatted?: string;
}

export interface Organization {
  id: string;
  name: string;
  business_field: string | null;
  employee_count: number | null;
  address: string | null;
  phone: string | null;
  logo_path: string | null;
  theme_settings: any;
  subscription_status?: string;
  subscription_plan_id?: string;
  trial_end_date?: string;
  trial_expired?: boolean;
  trial_start_date?: string;
  creator_email?: string;
  grace_period_end?: string;
}

export interface UserPreferences {
  dark_mode?: boolean;
  [key: string]: any;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug?: string;
  price: number;
  max_members: number;
  features: Record<string, any> | null;
  direct_payment_url?: string;
  deskripsi?: string;
  is_active: boolean;
  stripe_price_id?: string;
  created_at?: string;
}

export type OrganizationData = {
  organization: Organization | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isTrialActive?: boolean;
  daysLeftInTrial?: number;
  hasPaidSubscription?: boolean;
  refreshData: () => Promise<void>;
};
