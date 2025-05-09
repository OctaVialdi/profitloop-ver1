
import { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  isLoading: boolean;
  loginError: string | null;
  session: Session | null;
  user: User | null;
  authInitialized?: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSignInResult {
  data: any;
  error: Error | null;
}

export interface MagicLinkParams {
  email: string;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface MagicLinkResult {
  loading: boolean;
  error: string | null;
  sendMagicLink: (params: MagicLinkParams) => Promise<void>;
}
