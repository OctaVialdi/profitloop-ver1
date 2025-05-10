
import { Json } from "@/integrations/supabase/types";

// Define the UserPreferences interface
export interface UserPreferences {
  theme?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  [key: string]: any;
}

// Define UserProfile interface
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  organization_id: string;
  role: string;
  created_at: string;
  profile_image?: string;
  invited_by?: string;
  preferences: UserPreferences;
  has_seen_welcome: boolean;
  last_active: string;
  timezone: string;
}

// Define Organization interface with logo_path
export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  business_field: string;
  employee_count: number;
  trial_start_date: string;
  trial_end_date: string;
  trial_expired: boolean;
  subscription_status: string;
  subscription_plan_id: string;
  created_at: string;
  theme_settings: Json;
  logo_path: string | null;
  grace_period_end?: string | null;
}

// Define SubscriptionPlan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  max_members: number;
  features: {
    storage: string;
    members: string;
    support: string;
    advanced_analytics: boolean;
    [key: string]: any;
  };
  is_active: boolean;
}

// Define OrganizationData interface for the hook
export interface OrganizationData {
  organization: Organization | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  hasPaidSubscription: boolean;
  subscriptionPlan: SubscriptionPlan | null;
}
