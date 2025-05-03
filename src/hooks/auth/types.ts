
// Types for magic link parameters
export interface MagicLinkParams {
  token?: string | null;
  email?: string | null;
  errorCode?: string | null;
  errorDescription?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  type?: string | null;
  redirectTo?: string | null;
}

// Types for magic link result
export interface MagicLinkResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  organizationName: string;
}
