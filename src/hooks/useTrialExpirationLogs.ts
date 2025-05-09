
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrialExpirationLog {
  id: string;
  organization_id: string;
  action: string;
  created_at: string;
  data: any;
}

export function useTrialExpirationLogs(organizationId: string | null) {
  const [logs, setLogs] = useState<TrialExpirationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        // Fetch logs from subscription_audit_logs table
        const { data, error } = await supabase
          .from('subscription_audit_logs')
          .select('*')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        setLogs(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching trial expiration logs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [organizationId]);

  return { logs, loading, error };
}
