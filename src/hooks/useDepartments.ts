
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

export const useDepartments = () => {
  const { toast } = useToast();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      // Get unique organization_name values from employee_employment table
      const { data, error } = await supabase
        .from("employee_employment")
        .select("organization_name")
        .eq("organization_name", "organization_name") // This forces distinct values
        .not("organization_name", "is", null) // Only non-null values
        .order("organization_name");

      if (error) throw error;

      // Extract unique organization names using Set
      const uniqueDepartments = Array.from(
        new Set(data?.map(item => item.organization_name).filter(Boolean) || [])
      );

      setDepartments(uniqueDepartments);
      return uniqueDepartments;
    } catch (error: any) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch departments",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchDepartments();
    }
  }, [organization?.id]);

  return {
    loading,
    departments,
    fetchDepartments
  };
};
