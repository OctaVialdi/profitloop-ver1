
import { useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { 
  createNewTicket, 
  updateTicket, 
  deleteTicket 
} from '@/services/ticketService';
import { Ticket, TicketFormData } from '../types';
import { showToast, showSuccessToast, showErrorToast } from '@/utils/toastUtils';

export function useTicketModification(refreshTickets: () => Promise<void>) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { organization } = useOrganization();

  // Create a new ticket
  async function handleCreateTicket(formData: TicketFormData): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsCreating(true);
    try {
      // Add organization ID to the ticket data
      const ticketData = {
        ...formData,
        organization_id: organization.id
      };
      
      await createNewTicket(ticketData);
      
      showSuccessToast("Ticket created successfully");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to create ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  // Update an existing ticket
  async function handleUpdateTicket(ticketId: string, updates: Partial<Ticket>): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsUpdating(true);
    try {
      await updateTicket(ticketId, updates, organization.id);
      
      showSuccessToast("Ticket updated successfully");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error updating ticket:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to update ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  }

  // Delete a ticket
  async function handleDeleteTicket(ticketId: string): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsDeleting(true);
    try {
      await deleteTicket(ticketId, organization.id);
      
      showSuccessToast("Ticket deleted successfully");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error deleting ticket:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to delete ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isCreating,
    isUpdating,
    isDeleting,
    handleCreateTicket,
    handleUpdateTicket,
    handleDeleteTicket
  };
}
