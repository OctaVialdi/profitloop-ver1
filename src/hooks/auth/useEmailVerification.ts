
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export function useEmailVerification() {
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const navigate = useNavigate();

  const resendVerificationEmail = async (
    email: string, 
    password?: string, 
    additionalState?: Record<string, any>
  ) => {
    if (!email) {
      toast.error('Email is required to resend verification');
      return;
    }

    setResendingVerification(true);

    try {
      // Send OTP email for verification
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Verification email sent. Please check your inbox.');
      
      // Navigate to verification page with relevant state
      navigate('/auth/verify', { 
        state: { 
          email, 
          ...additionalState 
        } 
      });
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  return {
    isEmailUnverified,
    setIsEmailUnverified,
    resendingVerification,
    resendVerificationEmail
  };
}
