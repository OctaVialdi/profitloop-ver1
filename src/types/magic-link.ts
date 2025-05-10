
export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  token: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  used_at: string | null;
}
