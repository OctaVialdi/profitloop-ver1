
export interface InvitationLink {
  id: string;
  position: string;
  link: string;
  previewLink?: string;
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

export interface LinkType {
  type: 'preview' | 'direct';
  label: string;
  description: string;
  icon: React.ReactNode;
}
