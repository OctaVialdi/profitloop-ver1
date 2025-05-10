
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function usePaymentStatus(organizationId: string | null) {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'canceled' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!organizationId) return;
      
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      
      if (success === 'true') {
        setStatus('success');
        setIsProcessing(true);
        
        try {
          // Call check-trial-expiration to refresh subscription status
          await supabase.functions.invoke('check-trial-expiration');
          toast.success('Pembayaran berhasil! Langganan Anda telah diaktifkan.');
        } catch (error) {
          console.error('Error refreshing subscription status:', error);
        } finally {
          setIsProcessing(false);
        }
      } else if (canceled === 'true') {
        setStatus('canceled');
        toast.error('Pembayaran dibatalkan. Anda dapat mencoba lagi nanti.');
      }
      
      // Clear payment status from URL after processing
      if (success || canceled) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };

    checkPaymentStatus();
  }, [searchParams, organizationId]);

  return { status, isProcessing };
}
