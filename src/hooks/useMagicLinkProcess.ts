
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export function useMagicLinkProcess(): MagicLinkResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState<string | undefined>(undefined);

  const sendMagicLink = async ({ email, redirectTo }: MagicLinkParams) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email) {
        setError('Email is required');
        return;
      }

      const { error: sendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (sendError) {
        throw sendError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Error sending magic link:', err);
      setError(err.message || 'Failed to send magic link');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    organizationName,
    sendMagicLink,
  };
}
