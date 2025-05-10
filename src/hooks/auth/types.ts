
import { Session, User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSignInResult {
  data: {
    user: User | null;
    session: Session | null;
  } | null;
  error: Error | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface MagicLinkParams {
  email?: string;
  token?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  accessToken?: string;
  refreshToken?: string;
  errorCode?: string | null;
  errorDescription?: string | null;
  type?: string;
}

export interface MagicLinkResult {
  isLoading: boolean;
  error: string | null;
  success?: boolean;
  organizationName?: string;
  sendMagicLink?: (params: MagicLinkParams) => Promise<void>;
}
