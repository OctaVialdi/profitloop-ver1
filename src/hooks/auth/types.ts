
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
