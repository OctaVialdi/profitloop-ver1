
import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/organization';
import { subscriptionService } from '@/services/subscriptionService';

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const plansData = await subscriptionService.getSubscriptionPlans();
        setPlans(plansData);
      } catch (err: any) {
        console.error('Error fetching subscription plans:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  return { plans, isLoading, error };
}
