
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "./types";

export default function useTicketSystem(initialTickets: Ticket[] = []) {
  const { toast } = useToast();
  
  // State for tickets
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  
  // UI state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [uploadingForTicket, setUploadingForTicket] = useState<string | undefined>(undefined);
  
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
  const handleDeleteTicket = (ticket: Ticket) => {
    // Show confirm dialog
    if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
      // Remove ticket from list
      setTickets(tickets.filter((t) => t.id !== ticket.id));
      
      // Show notification
      toast({
        title: "Ticket Deleted",
        description: `Ticket ${ticket.id} has been deleted.`,
        variant: "destructive",
      });
    }
  };

  // Function to handle approving a ticket
  const handleApproveTicket = (ticket?: Ticket) => {
    const ticketToUpdate = ticket || selectedTicket;
    if (!ticketToUpdate) return;
    
    // Update ticket status
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
  };

  // Function to handle rejecting a ticket
  const handleRejectTicket = (ticket?: Ticket) => {
    const ticketToUpdate = ticket || selectedTicket;
    if (!ticketToUpdate) return;
    
    // Update ticket status
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
  };

  // Function to handle closing a ticket
  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    
    // Update ticket status
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
  };

  // Function to handle marking a ticket as resolved
  const handleMarkAsResolved = (ticket?: Ticket) => {
    const ticketToUpdate = ticket || selectedTicket;
    if (!ticketToUpdate) return;
    
    // Update ticket status and resolution
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
  };

  // Function to handle updating a ticket
  const handleUpdateTicket = (updatedTicket: Ticket) => {
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
  };

  // Function to handle creating a new ticket
  const handleCreateTicket = (newTicket: Partial<Ticket>) => {
    // Generate ticket ID
    const ticketId = `T-${String(tickets.length + 1).padStart(3, '0')}`;
    
    // Create new ticket object
    const ticket: Ticket = {
      id: ticketId,
      title: newTicket.title || "Untitled Ticket",
      description: newTicket.description,
      department: newTicket.department || "IT",
      category: newTicket.category || { name: "Software", icon: "💻" },
      priority: newTicket.priority || "Medium",
      status: newTicket.status || "Received",
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      response: { time: "0m", type: "fast" },
      resolution: { time: null, type: null },
      assignee: newTicket.assignee || "Unassigned",
    };
    
    // Add ticket to list
    setTickets([ticket, ...tickets]);
    
    // Close dialog
    setShowNewTicketDialog(false);
    
    // Show notification
    toast({
      title: "Ticket Created",
      description: `Ticket ${ticketId} has been created.`,
      variant: "default",
    });
  };

  // Function to handle file uploads
  const handleFileUpload = (files: File[]) => {
    // Handle file uploads here (in a real app, you would upload to a server)
    console.log("Files to upload:", files);
    
    // Show notification
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) have been uploaded${uploadingForTicket ? ` for ticket ${uploadingForTicket}` : ''}.`,
      variant: "default",
    });
    
    // Close dialog
    setShowFileUploadDialog(false);
    setUploadingForTicket(undefined);
  };

  // Function to handle uploading files for a specific ticket
  const handleUploadForTicket = (ticketId: string) => {
    setUploadingForTicket(ticketId);
    setShowFileUploadDialog(true);
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
    showFileUploadDialog,
    setShowFileUploadDialog,
    uploadingForTicket,
    setUploadingForTicket,
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved,
    handleUpdateTicket,
    handleCreateTicket,
    handleFileUpload,
    handleUploadForTicket,
  };
}
