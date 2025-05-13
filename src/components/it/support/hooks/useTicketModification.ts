
import { Ticket } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/auth";
import { useOrganization } from "@/hooks/useOrganization";
import {
  createTicket,
  updateTicket,
  mapUiTicketToDbTicket
} from "@/services/ticketService";

export function useTicketModification(
  tickets: Ticket[], 
  setTickets: (tickets: Ticket[]) => void,
  setShowEditDialog: (show: boolean) => void,
  setShowNewTicketDialog: (show: boolean) => void,
  employees: { id: string, name: string }[]
) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { organization } = useOrganization();

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
    handleUpdateTicket,
    handleCreateTicket
  };
}

// Helper function moved from ticket service
import { mapDbTicketToUiTicket } from "@/services/ticketService";
