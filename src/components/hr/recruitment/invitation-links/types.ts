
export interface InvitationLink {
  id: string;
  position: string;
  link: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
  submissions: number;
  status: 'active' | 'expired' | 'disabled';
}

export interface JobPosition {
  id: string;
  title: string;
}
