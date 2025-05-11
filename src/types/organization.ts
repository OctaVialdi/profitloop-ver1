
export interface Organization {
  id: string;
  name: string;
  creator_email?: string | null;
  business_field?: string | null;
  employee_count?: number;
  address?: string | null;
  phone?: string | null;
  logo_path?: string | null;
  theme_settings?: ThemeSettings;
  trial_expired?: boolean;
  subscription_status?: 'trial' | 'active' | 'expired';
  subscription_plan_id?: string | null;
  trial_start_date?: string | null;
  trial_end_date?: string | null;
  grace_period_end?: string | null;
  stripe_customer_id?: string | null;
  billing_email?: string | null;
}

export interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  sidebar_color: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  deskripsi?: string;
  max_members?: number;
  price: number;
  price_per_member?: number;
  features: Record<string, any> | null;
  is_active: boolean;
  direct_payment_url?: string | null;
  slug?: string | null;
  stripe_price_id?: string | null;
  created_at?: string;
}

export interface OrganizationData {
  organization: Organization | null;
  userProfile: any | null;
  isLoading: boolean;
  error: Error | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  subscriptionPlan: SubscriptionPlan | null;
  refreshData: () => Promise<void>;
  isTrialActive?: boolean;
  daysLeftInTrial?: number | null;
  hasPaidSubscription?: boolean;
}

export interface BillingPaymentMethod {
  type: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  last4?: string;
  name?: string;
}

export interface BillingInvoiceAddress {
  companyName?: string;
  taxId?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emailBilling?: string;
}

export interface BillingSettings {
  id?: string;
  organization_id: string;
  payment_method?: BillingPaymentMethod | null;
  invoice_address?: BillingInvoiceAddress | null;
  last_payment_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_plan_id?: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: string;
  invoice_number: string;
  invoice_pdf_url?: string;
  due_date: string;
  payment_details?: {
    method?: string;
    planName?: string;
    billingName?: string;
    last4?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceHistoryResponse {
  invoices: Invoice[];
  total_count: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  profile_image?: string | null;
  timezone?: string | null;
  role?: string | null;
  organization_id?: string | null;
  email_verified?: boolean;
  has_seen_welcome?: boolean;
  invited_by?: string | null;
  preferences?: Record<string, any> | null;
  created_at?: string | null;
  last_active?: string | null;
}
