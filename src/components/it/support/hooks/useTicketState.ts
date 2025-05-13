
import { useState } from "react";
import { Ticket } from "../types";

export function useTicketState() {
  // State for tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<{id: string, name: string}[]>([]);
  
  // UI state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);

  return {
    // Ticket data
    tickets,
    setTickets,
    loading,
    setLoading,
    employees,
    setEmployees,
    
    // UI state
    selectedTicket,
    setSelectedTicket,
    showDetailDialog,
    setShowDetailDialog,
    showEditDialog,
    setShowEditDialog,
    showNewTicketDialog,
    setShowNewTicketDialog
  };
}
