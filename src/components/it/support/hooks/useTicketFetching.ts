
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { fetchTickets, fetchEmployees } from "@/services/ticketService";

export function useTicketFetching(setTickets: Function, setLoading: Function, setEmployees: Function) {
  const { toast } = useToast();
  const { organization } = useOrganization();

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

  return {
    loadTickets,
    loadEmployees
  };
}

// Helper function moved from ticket service
import { mapDbTicketToUiTicket } from "@/services/ticketService";
