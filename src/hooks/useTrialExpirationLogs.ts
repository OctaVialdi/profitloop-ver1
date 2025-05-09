
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionAuditLog } from '@/types/subscription';

export function useTrialExpirationLogs(organizationId: string | null) {
  const [logs, setLogs] = useState<SubscriptionAuditLog[]>([]);
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
        
        // Use custom RPC function as workaround since the table might not exist in the TypeScript types
        const { data, error } = await supabase
          .rpc('get_subscription_audit_logs', { org_id: organizationId })
          .limit(50);
        
        if (error) {
          // Fallback - try to query the table directly despite TypeScript errors
          console.log("Falling back to direct query:", error);
          const directQuery = await supabase
            .from('subscription_audit_logs')
            .select('*')
            .eq('organization_id', organizationId)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (directQuery.error) throw directQuery.error;
          setLogs(directQuery.data as unknown as SubscriptionAuditLog[]);
        } else {
          setLogs(data as SubscriptionAuditLog[]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching trial expiration logs:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        // Set empty logs to prevent UI errors
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [organizationId]);

  return { logs, loading, error };
}
