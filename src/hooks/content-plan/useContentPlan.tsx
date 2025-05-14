
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useContentPlan = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContentPlan = async () => {
      try {
        setLoading(true);
        // Replace this with actual content plan fetching from Supabase
        const { data, error } = await supabase
          .from('content_plan')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        console.error('Error loading content plan:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentPlan();
  }, []);

  return { data, loading, error };
};
