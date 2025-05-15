
import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "@/hooks/use-toast";

type Department = string;

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useOrganization();

  const fetchDepartments = useCallback(async () => {
    if (!organization?.id) {
      console.log("No organization ID available to fetch departments");
      return;
    }

    try {
      setLoading(true);
      
      // Get unique department values from expenses
      const { data: expenseDepts, error: expenseError } = await supabase
        .from('expenses')
        .select('department')
        .eq('organization_id', organization.id)
        .not('department', 'is', null);
      
      if (expenseError) throw expenseError;
      
      // Get unique department values from org_structure
      const { data: orgDepts, error: orgError } = await supabase
        .from('org_structure')
        .select('name')
        .eq('organization_id', organization.id)
        .eq('type', 'department')
        .not('name', 'is', null);
      
      if (orgError) throw orgError;
      
      // Combine and deduplicate departments
      const deptSet = new Set<string>();
      
      expenseDepts?.forEach(item => {
        if (item.department) deptSet.add(item.department);
      });
      
      orgDepts?.forEach(item => {
        if (item.name) deptSet.add(item.name);
      });
      
      // Default departments if none found
      if (deptSet.size === 0) {
        deptSet.add('IT');
        deptSet.add('Marketing');
        deptSet.add('Sales');
        deptSet.add('Finance');
        deptSet.add('HR');
      }
      
      setDepartments(Array.from(deptSet).sort());
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      setError(err.message);
      toast.error("Failed to load departments: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [organization?.id]);

  // Fetch departments on initial load
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, error, fetchDepartments };
};
