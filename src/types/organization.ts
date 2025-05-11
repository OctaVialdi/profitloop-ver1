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
  theme_settings: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    sidebar_color: string;
  } | any; // Adding 'any' to handle Json type from database
  subscription_status?: string;
  subscription_plan_id?: string;
  subscription_plan_name?: string; // Added for SubscriptionManagement.tsx
  subscription_price?: number; // Added for SubscriptionManagement.tsx
  subscription_end_date?: string; // Added for SubscriptionManagement.tsx
  subscription_id?: string; // Added for SubscriptionManagement.tsx
  trial_end_date?: string;
  trial_expired?: boolean;
  trial_start_date?: string;
  creator_email?: string;
  grace_period_end?: string;
  stripe_customer_id?: string; // Added new field for Midtrans integration
  billing_email?: string; // Added new field for billing email
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
  features: Record<string, any> | null | any; // Added 'any' to handle Json type
  direct_payment_url?: string;
  deskripsi?: string;
  is_active: boolean;
  stripe_price_id?: string;
  created_at?: string;
  current?: boolean; // Added for UI display
  popular?: boolean; // Added for UI display
  price_per_member?: number | null; // Added for per-member pricing
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
  subscriptionPlan?: SubscriptionPlan | null;  // Added to store current plan details
  refreshData: () => Promise<void>;
};
