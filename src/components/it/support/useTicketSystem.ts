
import { useTicketState } from "./hooks/useTicketState";
import { useTicketFetching } from "./hooks/useTicketFetching";
import { useTicketOperations } from "./hooks/useTicketOperations";
import { useTicketModification } from "./hooks/useTicketModification";

export default function useTicketSystem() {
  // Get the state
  const {
    tickets,
    setTickets,
    loading,
    setLoading,
    employees,
    setEmployees,
    selectedTicket,
    setSelectedTicket,
    showDetailDialog,
    setShowDetailDialog,
    showEditDialog,
    setShowEditDialog,
    showNewTicketDialog,
    setShowNewTicketDialog
  } = useTicketState();

  // Setup data fetching
  const { loadTickets, loadEmployees } = useTicketFetching(setTickets, setLoading, setEmployees);

  // Setup ticket operations
  const {
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved
  } = useTicketOperations(
    tickets,
    setTickets,
    selectedTicket,
    setSelectedTicket,
    setShowDetailDialog,
    setShowEditDialog,
    setShowNewTicketDialog,
    employees
  );

  // Setup ticket modification operations
  const {
    handleUpdateTicket,
    handleCreateTicket
  } = useTicketModification(
    tickets,
    setTickets,
    setShowEditDialog,
    setShowNewTicketDialog,
    employees
  );

  return {
    // State
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
    
    // Operations
    handleViewTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleApproveTicket,
    handleRejectTicket,
    handleCloseTicket,
    handleMarkAsResolved,
    handleUpdateTicket,
    handleCreateTicket,
    
    // Data
    loading,
    employees
  };
}
