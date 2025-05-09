
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
        
        // Use the new RPC function we created
        const { data, error: rpcError } = await supabase
          .rpc('get_subscription_audit_logs', { org_id: organizationId });
        
        if (rpcError) {
          console.error("Error fetching subscription logs:", rpcError);
          throw rpcError;
        }
        
        if (data) {
          setLogs(data as SubscriptionAuditLog[]);
        } else {
          setLogs([]);
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
