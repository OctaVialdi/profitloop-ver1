
import { useState, useEffect, useCallback } from 'react';
import { fetchTickets, fetchTicketById } from '@/services/ticketService';
import { useOrganization } from '@/hooks/useOrganization';
import { Ticket } from '../types';
import { showToast } from '@/utils/toastUtils';

export function useTicketFetching() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useOrganization();

  const loadTickets = useCallback(async () => {
    if (!organization?.id) {
      console.error("No organization ID available");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedTickets = await fetchTickets(organization.id);
      setTickets(fetchedTickets);
    } catch (err: any) {
      console.error("Error fetching tickets:", err);
      setError(err.message || "Failed to load tickets");
      showToast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (organization?.id) {
      loadTickets();
    }
  }, [organization?.id, loadTickets]);

  const getTicketById = useCallback(async (ticketId: string): Promise<Ticket | null> => {
    if (!organization?.id) return null;
    
    try {
      return await fetchTicketById(ticketId, organization.id);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      return null;
    }
  }, [organization?.id]);

  return {
    tickets,
    loading,
    error,
    refreshTickets: loadTickets,
    getTicketById
  };
}
