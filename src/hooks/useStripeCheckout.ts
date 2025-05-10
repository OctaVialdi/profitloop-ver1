
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const initiateCheckout = async (planId: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call the create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });

      if (error) throw error;

      if (data && data.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast.error('Failed to initiate checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { initiateCheckout, isLoading };
}
