
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
  // Add profile_image field that was missing
  profile_image?: string | null;
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
  logo_path: string | null;
  theme_settings: any;
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
};
