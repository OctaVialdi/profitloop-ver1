
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
  email?: string;
  token?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  // Add missing properties that are being used in useMagicLink.ts
  accessToken?: string;
  refreshToken?: string;
  errorCode?: string | null;
  errorDescription?: string | null;
  type?: string;
}

export interface MagicLinkResult {
  // Change to match the return value in useMagicLink.ts
  isLoading: boolean; // Changed from loading to isLoading
  error: string | null;
  success?: boolean; // Added success property
  organizationName?: string; // Added organizationName property
  sendMagicLink?: (params: MagicLinkParams) => Promise<void>;
}
