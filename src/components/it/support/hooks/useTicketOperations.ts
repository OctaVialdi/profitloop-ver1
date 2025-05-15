
import { useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { 
  approveTicket as approveTicketService,
  rejectTicket as rejectTicketService,
  closeTicket as closeTicketService,
  resolveTicket as resolveTicketService
} from '@/services/ticketService';
import { Ticket, TicketStatus } from '../types';
import { showToast, showSuccessToast, showErrorToast } from '@/utils/toastUtils';

export function useTicketOperations(refreshTickets: () => Promise<void>) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { organization } = useOrganization();

  // Approve a ticket
  async function handleApproveTicket(ticketId: string): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsProcessing(true);
    try {
      // First check if we're allowed to approve this ticket
      const updates: Partial<Ticket> = {
        status: TicketStatus.APPROVED,
        approved_at: new Date().toISOString(),
      };
      
      await approveTicketService(ticketId, updates, organization.id);
      
      showSuccessToast("Ticket approved successfully");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error approving ticket:", err);
      showToast({
        title: "Error", 
        description: err.message || "Failed to approve ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }

  // Reject a ticket
  async function handleRejectTicket(ticketId: string, reason?: string): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsProcessing(true);
    try {
      const updates: Partial<Ticket> = {
        status: TicketStatus.REJECTED,
        rejection_reason: reason || "No reason provided",
      };
      
      await rejectTicketService(ticketId, updates, organization.id);
      
      showSuccessToast("Ticket rejected");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error rejecting ticket:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to reject ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }

  // Close a ticket
  async function handleCloseTicket(ticketId: string, resolution?: string): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsProcessing(true);
    try {
      const updates: Partial<Ticket> = {
        status: TicketStatus.CLOSED,
        resolution: resolution || "Closed without specific resolution",
        closed_at: new Date().toISOString(),
      };
      
      await closeTicketService(ticketId, updates, organization.id);
      
      showSuccessToast("Ticket closed successfully");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error closing ticket:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to close ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }

  // Mark a ticket as resolved
  async function handleMarkAsResolved(ticketId: string, resolution: string): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsProcessing(true);
    try {
      const updates: Partial<Ticket> = {
        status: TicketStatus.RESOLVED,
        resolution: resolution || "Marked as resolved",
        resolved_at: new Date().toISOString(),
      };
      
      await resolveTicketService(ticketId, updates, organization.id);
      
      showSuccessToast("Ticket marked as resolved");
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error marking ticket as resolved:", err);
      showToast({
        title: "Error",
        description: err.message || "Failed to mark ticket as resolved",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }

  // Update ticket status
  async function updateTicketStatus(ticketId: string, status: TicketStatus, message?: string): Promise<boolean> {
    if (!organization?.id) {
      showErrorToast("Organization not found");
      return false;
    }

    setIsProcessing(true);
    try {
      const updates: Partial<Ticket> = {
        status,
        status_update_message: message,
        updated_at: new Date().toISOString(),
      };
      
      // Use the appropriate service method based on the status
      switch (status) {
        case TicketStatus.APPROVED:
          await approveTicketService(ticketId, updates, organization.id);
          break;
        case TicketStatus.REJECTED:
          await rejectTicketService(ticketId, updates, organization.id);
          break;
        case TicketStatus.CLOSED:
          await closeTicketService(ticketId, updates, organization.id);
          break;
        case TicketStatus.RESOLVED:
          await resolveTicketService(ticketId, updates, organization.id);
          break;
        default:
          throw new Error(`Unsupported status transition: ${status}`);
      }
      
      showSuccessToast(`Ticket status updated to ${status}`);
      await refreshTickets();
      return true;
    } catch (err: any) {
      console.error("Error updating ticket status:", err);
      showToast({
        title: "Error", 
        description: err.message || "Failed to update ticket status",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    isProcessing,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved,
    updateTicketStatus
  };
}
