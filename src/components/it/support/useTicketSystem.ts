
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "./types";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { 
  fetchTickets, 
  createTicket, 
  updateTicket, 
  deleteTicket, 
  mapDbTicketToUiTicket, 
  mapUiTicketToDbTicket,
  fetchEmployees
} from "@/services/ticketService";

export default function useTicketSystem() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { organization } = useOrganization();
  
  // State for tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<{id: string, name: string}[]>([]);
  
  // UI state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  
  // Load tickets and employees on component mount
  useEffect(() => {
    if (organization) {
      loadTickets();
      loadEmployees();
    }
  }, [organization]);

  // Function to load tickets from Supabase
  const loadTickets = async () => {
    setLoading(true);
    try {
      const dbTickets = await fetchTickets();
      const mappedTickets = dbTickets.map(mapDbTicketToUiTicket);
      setTickets(mappedTickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to load employees for assignee dropdown
  const loadEmployees = async () => {
    try {
      const employeeList = await fetchEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };
  
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

  // Function to handle updating a ticket
  const handleUpdateTicket = async (updatedTicket: Ticket) => {
    if (!organization) return;
    
    try {
      // Map UI ticket to database model
      const dbTicket = {
        title: updatedTicket.title,
        description: updatedTicket.description,
        department: updatedTicket.department,
        category: updatedTicket.category.name,
        category_icon: updatedTicket.category.icon,
        priority: updatedTicket.priority,
        status: updatedTicket.status,
        assignee: updatedTicket.assignee,
        // Find the employee ID that matches the selected assignee name
        assignee_id: employees.find(emp => emp.name === updatedTicket.assignee)?.id,
        related_asset: updatedTicket.relatedAsset
      };
      
      // Update ticket in database
      const updated = await updateTicket(updatedTicket.id, dbTicket);
      
      if (updated) {
        // Update tickets list
        setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
        
        // Close dialog
        setShowEditDialog(false);
        
        // Show notification
        toast({
          title: "Ticket Updated",
          description: `Ticket ${updatedTicket.id} has been updated.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle creating a new ticket
  const handleCreateTicket = async (newTicket: Partial<Ticket>) => {
    if (!organization || !user) return;
    
    try {
      // Map UI ticket to database model
      const dbTicket = mapUiTicketToDbTicket(
        newTicket, 
        organization.id,
        user.id
      );
      
      // Find the employee ID that matches the selected assignee name
      if (newTicket.assignee && newTicket.assignee !== "Unassigned") {
        const employee = employees.find(emp => emp.name === newTicket.assignee);
        if (employee) {
          dbTicket.assignee_id = employee.id;
        }
      }
      
      // Create ticket in database
      const created = await createTicket(dbTicket);
      
      if (created) {
        // Map the created ticket back to UI model
        const uiTicket = mapDbTicketToUiTicket(created);
        
        // Add ticket to list
        setTickets([uiTicket, ...tickets]);
        
        // Close dialog
        setShowNewTicketDialog(false);
        
        // Show notification
        toast({
          title: "Ticket Created",
          description: `Ticket ${uiTicket.id} has been created.`,
          variant: "default",
        });
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    tickets,
    setTickets,
    selectedTicket,
    setSelectedTicket,
    showDetailDialog,
    setShowDetailDialog,
    showEditDialog,
    setShowEditDialog,
    showNewTicketDialog,
    setShowNewTicketDialog,
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved,
    handleUpdateTicket,
    handleCreateTicket,
    loading,
    employees
  };
}
