
import { Ticket } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth";
import { useOrganization } from "@/hooks/useOrganization";
import {
  createTicket,
  updateTicket,
  deleteTicket,
  mapUiTicketToDbTicket
} from "@/services/ticketService";

export function useTicketOperations(
  tickets: Ticket[], 
  setTickets: (tickets: Ticket[]) => void,
  selectedTicket: Ticket | null,
  setSelectedTicket: (ticket: Ticket | null) => void,
  setShowDetailDialog: (show: boolean) => void,
  setShowEditDialog: (show: boolean) => void,
  setShowNewTicketDialog: (show: boolean) => void,
  employees: { id: string, name: string }[]
) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { organization } = useOrganization();

  // Function to handle viewing a ticket
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailDialog(true);
  };

  // Function to handle editing a ticket
  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowEditDialog(true);
  };

  // Function to handle deleting a ticket
  const handleDeleteTicket = async (ticket: Ticket) => {
    // Show confirm dialog
    if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
      try {
        // Remove ticket from database
        const success = await deleteTicket(ticket.id);
        
        if (success) {
          // Remove ticket from local state
          setTickets(tickets.filter((t) => t.id !== ticket.id));
          
          // Show notification
          toast({
            title: "Ticket Deleted",
            description: `Ticket ${ticket.id} has been deleted.`,
            variant: "destructive",
          });
        } else {
          throw new Error("Failed to delete ticket");
        }
      } catch (error) {
        console.error("Error deleting ticket:", error);
        toast({
          title: "Error",
          description: "Failed to delete ticket. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Function to handle approving a ticket
  const handleApproveTicket = async (ticket?: Ticket) => {
    const ticketToUpdate = ticket || selectedTicket;
    if (!ticketToUpdate) return;
    
    try {
      // Update ticket status in database
      const updated = await updateTicket(ticketToUpdate.id, {
        status: "In Progress"
      });
      
      if (updated) {
        // Update ticket status in state
        const updatedTicket: Ticket = { 
          ...ticketToUpdate, 
          status: "In Progress",
        };
        
        // Update tickets list
        setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
        
        // Close dialog if it was opened
        if (!ticket) {
          setShowDetailDialog(false);
        }
        
        // Show notification
        toast({
          title: "Ticket Approved",
          description: `Ticket ${ticketToUpdate.id} has been approved.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error approving ticket:", error);
      toast({
        title: "Error",
        description: "Failed to approve ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle rejecting a ticket
  const handleRejectTicket = async (ticket?: Ticket) => {
    const ticketToUpdate = ticket || selectedTicket;
    if (!ticketToUpdate) return;
    
    try {
      // Update ticket status in database
      const updated = await updateTicket(ticketToUpdate.id, {
        status: "Rejected"
      });
      
      if (updated) {
        // Update ticket status in state
        const updatedTicket: Ticket = { 
          ...ticketToUpdate, 
          status: "Rejected", 
        };
        
        // Update tickets list
        setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
        
        // Close dialog if it was opened
        if (!ticket) {
          setShowDetailDialog(false);
        }
        
        // Show notification
        toast({
          title: "Ticket Rejected",
          description: `Ticket ${ticketToUpdate.id} has been rejected.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to reject ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle closing a ticket
  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      // Update ticket status in database
      const updated = await updateTicket(selectedTicket.id, {
        status: "Retired"
      });
      
      if (updated) {
        // Update ticket status in state
        const updatedTicket: Ticket = { 
          ...selectedTicket, 
          status: "Retired",
        };
        
        // Update tickets list
        setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
        
        // Close dialog
        setShowDetailDialog(false);
        
        // Show notification
        toast({
          title: "Ticket Closed",
          description: `Ticket ${selectedTicket.id} has been closed.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast({
        title: "Error",
        description: "Failed to close ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle marking a ticket as resolved
  const handleMarkAsResolved = async (ticket?: Ticket) => {
    const ticketToUpdate = ticket || selectedTicket;
    if (!ticketToUpdate) return;
    
    try {
      // Update ticket status in database
      const updated = await updateTicket(ticketToUpdate.id, {
        status: "Resolved"
      });
      
      if (updated) {
        // Update ticket status and resolution in state
        const updatedTicket: Ticket = { 
          ...ticketToUpdate, 
          status: "Resolved",
          resolution: { 
            time: "2h 30m", 
            type: "completed" 
          }
        };
        
        // Update tickets list
        setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
        
        // Close dialog if it was opened
        if (!ticket) {
          setShowDetailDialog(false);
        }
        
        // Show notification
        toast({
          title: "Ticket Resolved",
          description: `Ticket ${ticketToUpdate.id} has been marked as resolved.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast({
        title: "Error",
        description: "Failed to resolve ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved
  };
}
