
export interface SubscriptionAuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: string;
  data: any;
  created_at: string;
}

export interface TrialExtensionRequest {
  id: string;
  organization_id: string;
  user_id: string;
  reason: string;
  contact_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  review_notes?: string;
}

export interface SubscriptionStatus {
  id: string;
  organization_id: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  plan_id: string;
  trial_end_date: string | null;
  trial_start_date: string | null;
  subscription_id: string | null;
  created_at: string;
  updated_at: string;
}
