
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/hooks/useOrganization';
import { Ticket } from '@/components/it/support/types';

// Interface for our DB ticket model
export interface SupportTicket {
  id: string;
  title: string;
  description?: string;
  department: string;
  category: string;
  category_icon?: string;
  priority: string;
  status: string;
  created_at: string;
  assignee?: string;
  assignee_id?: string;
  organization_id: string;
  related_asset?: string;
  created_by?: string;
  updated_at?: string;
}

// Fetch all tickets for the current organization
export const fetchTickets = async (): Promise<SupportTicket[]> => {
  try {
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return tickets || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
};

// Create a new ticket
export const createTicket = async (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>): Promise<SupportTicket | null> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert(ticket)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    return null;
  }
};

// Update an existing ticket
export const updateTicket = async (id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    return null;
  }
};

// Delete a ticket
export const deleteTicket = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return false;
  }
};

// Fetch employees for assignee dropdown
export const fetchEmployees = async (): Promise<{ id: string, name: string }[]> => {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, name')
      .eq('status', 'Active')
      .order('name');
      
    if (error) {
      throw error;
    }
    return employees || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

// Map database ticket to UI ticket model
export const mapDbTicketToUiTicket = (dbTicket: SupportTicket): Ticket => {
  return {
    id: dbTicket.id,
    title: dbTicket.title,
    description: dbTicket.description || "",
    department: dbTicket.department,
    category: { 
      name: dbTicket.category, 
      icon: dbTicket.category_icon || ""
    },
    priority: dbTicket.priority as "High" | "Medium" | "Low", // Added type assertion
    status: dbTicket.status as "In Progress" | "Resolved" | "Pending" | "Received" | "Open" | "Maintenance" | "Retired" | "Rejected", // Added type assertion
    createdAt: new Date(dbTicket.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }),
    response: { time: "N/A", type: "medium" },
    resolution: { time: null, type: null },
    assignee: dbTicket.assignee || "Unassigned",
    relatedAsset: dbTicket.related_asset
  };
};

// Map UI ticket to database model
export const mapUiTicketToDbTicket = (
  uiTicket: Partial<Ticket>, 
  organizationId: string, 
  userId?: string
): Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: uiTicket.title || "",
    description: uiTicket.description,
    department: uiTicket.department || "",
    category: uiTicket.category?.name || "",
    category_icon: uiTicket.category?.icon,
    priority: uiTicket.priority || "Medium",
    status: uiTicket.status || "Received",
    assignee: uiTicket.assignee,
    assignee_id: undefined, // This would be set when selecting from employee dropdown
    organization_id: organizationId,
    related_asset: uiTicket.relatedAsset,
    created_by: userId
  };
};
