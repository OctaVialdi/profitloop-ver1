
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

// Add the missing AuthCredentials interface
export interface AuthCredentials {
  email: string;
  password: string;
}

// Add the missing AuthSignInResult interface
export interface AuthSignInResult {
  data: any | null;
  error: Error | null;
}

export interface AuthState {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}
