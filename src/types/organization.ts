import { Json } from "./supabase";

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
  business_field: string;
  employee_count: number;
  address: string;
  phone: string;
  subscription_plan_id: string;
  trial_start_date: string;
  trial_end_date: string;
  grace_period_end: string;
  trial_expired: boolean;
  subscription_status: string;
  created_at: string;
  theme_settings: Json;
  logo_path: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  max_members: number | null;
  features: Record<string, any> | null;
  is_active: boolean;
  created_at?: string;
}

export interface UserPreferences {
  dark_mode?: boolean;
  [key: string]: any;
}

export type OrganizationData = {
  organization: Organization | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  refreshData: () => Promise<void>;
  isTrialActive?: boolean;
  daysLeftInTrial?: number;
  hasPaidSubscription?: boolean;
  subscriptionPlan?: SubscriptionPlan | null;
};
