
export interface MagicLinkParams {
  token: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  errorCode: string | null;
  errorDescription: string | null;
  type: string | null;
  redirectTo: string | null;
}

export interface MagicLinkResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  organizationName: string;
}
