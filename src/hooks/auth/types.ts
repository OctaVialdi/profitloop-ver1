
import { Session, User } from "@supabase/supabase-js";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isLoading: boolean;
  loginError: string | null;
  session: Session | null;
  user: User | null;
}

export interface AuthSignInResult {
  data: {
    session?: Session | null;
    user?: User | null;
  } | null;
  error: Error | null;
}

// Add missing MagicLink related interfaces
export interface MagicLinkParams {
  token?: string | null;
  email?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  errorCode?: string | null;
  errorDescription?: string | null;
  type?: string | null;
  redirectTo?: string | null;
}

export interface MagicLinkResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  organizationName: string;
}
