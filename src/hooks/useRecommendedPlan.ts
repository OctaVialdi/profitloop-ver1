
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/types/organization';

export function useRecommendedPlan() {
  const [recommendedPlan, setRecommendedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecommendedPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get an active plan with direct_payment_url set, preferring the ones with price > 0
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .not('direct_payment_url', 'is', null)
          .order('price', { ascending: false })
          .limit(1);

        if (error) {
          throw new Error(`Error fetching recommended plan: ${error.message}`);
        }

        // If we found a plan with direct_payment_url
        if (data && data.length > 0) {
          // Parse features from JSON if needed
          const plan = data[0];
          const features = typeof plan.features === 'string' 
            ? JSON.parse(plan.features) 
            : plan.features;
          
          setRecommendedPlan({
            ...plan,
            features: features as Record<string, any> | null
          });
        } else {
          // Fallback: get any active plan if none has direct_payment_url
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true)
            .order('price', { ascending: false })
            .limit(1);
            
          if (fallbackError) {
            throw new Error(`Error fetching fallback plan: ${fallbackError.message}`);
          }
          
          if (fallbackData && fallbackData.length > 0) {
            const plan = fallbackData[0];
            const features = typeof plan.features === 'string' 
              ? JSON.parse(plan.features) 
              : plan.features;
            
            setRecommendedPlan({
              ...plan,
              features: features as Record<string, any> | null
            });
          }
        }
      } catch (err) {
        console.error("Error in useRecommendedPlan:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedPlan();
  }, []);

  return { recommendedPlan, loading, error };
}
