
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface Reprimand {
  id: string;
  organization_id: string;
  employee_id: string;
  employee_name: string; // Added this field
  department?: string;
  reprimand_type: string;
  date: string;
  details?: string;
  status: 'Active' | 'Resolved' | 'Appealed';
  escalation_level: number;
  evidence_attachments?: any[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReprimandFilter {
  department?: string[];
  reprimand_type?: string[];
  status?: string[];
  startDate?: string;
  endDate?: string;
}

export const fetchReprimands = async (organizationId: string, filters?: ReprimandFilter) => {
  try {
    let query = supabase
      .from('reprimands')
      .select(`
        *,
        employees!reprimands_employee_id_fkey(id, name, email, role)
      `)
      .eq('organization_id', organizationId);

    // Apply filters if provided
    if (filters) {
      if (filters.reprimand_type && filters.reprimand_type.length > 0 && !filters.reprimand_type.includes('All')) {
        query = query.in('reprimand_type', filters.reprimand_type);
      }

      if (filters.status && filters.status.length > 0 && !filters.status.includes('All')) {
        query = query.in('status', filters.status);
      }

      // Date range filter
      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    // Transform data to include employee name
    return data.map(item => ({
      ...item,
      employee_name: item.employees?.name || 'Unknown',
      department: item.employees?.role || 'Unknown'
    })) as Reprimand[];
  } catch (error: any) {
    console.error('Error fetching reprimands:', error);
    toast.error('Failed to load reprimands data');
    return [];
  }
};

export const fetchReprimandById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('reprimands')
      .select(`
        *,
        employees!reprimands_employee_id_fkey(id, name, email, role)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      employee_name: data.employee_name || data.employees?.name || 'Unknown',
      department: data.employees?.role || 'Unknown'
    } as Reprimand;
  } catch (error: any) {
    console.error('Error fetching reprimand:', error);
    toast.error('Failed to load reprimand details');
    return null;
  }
};

export const fetchEmployeeReprimands = async (employeeId: string) => {
  try {
    const { data, error } = await supabase
      .from('reprimands')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });

    if (error) throw error;
    
    return data as Reprimand[];
  } catch (error: any) {
    console.error('Error fetching employee reprimands:', error);
    toast.error('Failed to load employee reprimands');
    return [];
  }
};

export const createReprimand = async (reprimand: Omit<Reprimand, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('reprimands')
      .insert({
        ...reprimand,
        id: uuidv4()
      })
      .select();

    if (error) throw error;
    
    toast.success('Reprimand record created successfully');
    return data[0] as Reprimand;
  } catch (error: any) {
    console.error('Error creating reprimand:', error);
    toast.error('Failed to create reprimand record');
    return null;
  }
};

export const updateReprimand = async (id: string, updates: Partial<Reprimand>) => {
  try {
    const { data, error } = await supabase
      .from('reprimands')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    toast.success('Reprimand record updated successfully');
    return data[0] as Reprimand;
  } catch (error: any) {
    console.error('Error updating reprimand:', error);
    toast.error('Failed to update reprimand record');
    return null;
  }
};

export const deleteReprimand = async (id: string) => {
  try {
    const { error } = await supabase
      .from('reprimands')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Reprimand record deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting reprimand:', error);
    toast.error('Failed to delete reprimand record');
    return false;
  }
};

export const appealReprimand = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('reprimands')
      .update({ status: 'Appealed' })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    toast.success('Appeal submitted successfully');
    return data[0] as Reprimand;
  } catch (error: any) {
    console.error('Error submitting appeal:', error);
    toast.error('Failed to submit appeal');
    return null;
  }
};

export const getReprimandStats = async (organizationId: string) => {
  try {
    const { data, error } = await supabase
      .from('reprimands')
      .select('reprimand_type, status, date')
      .eq('organization_id', organizationId);

    if (error) throw error;

    // Calculate stats
    const totalCount = data.length;
    const activeCount = data.filter(item => item.status === 'Active').length;
    const resolvedCount = data.filter(item => item.status === 'Resolved').length;
    const appealedCount = data.filter(item => item.status === 'Appealed').length;

    // Count by type
    const byType: Record<string, number> = {};
    data.forEach(item => {
      byType[item.reprimand_type] = (byType[item.reprimand_type] || 0) + 1;
    });

    // Group by month for trend analysis
    const byMonth: Record<string, number> = {};
    data.forEach(item => {
      const month = new Date(item.date).toISOString().substring(0, 7); // YYYY-MM format
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    return {
      total: totalCount,
      active: activeCount,
      resolved: resolvedCount,
      appealed: appealedCount,
      byType,
      byMonth
    };
  } catch (error: any) {
    console.error('Error fetching reprimand stats:', error);
    toast.error('Failed to load statistics');
    return {
      total: 0,
      active: 0,
      resolved: 0,
      appealed: 0,
      byType: {},
      byMonth: {}
    };
  }
};
