
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
      
      // Get distinct organization_name values from employee_employment table
      const { data, error } = await supabase
        .from("employee_employment")
        .select("organization_name")
        .not("organization_name", "is", null)
        .order("organization_name");

      if (error) throw error;

      // Extract unique department names using Set
      const uniqueDepartments = Array.from(
        new Set(data?.map(item => item.organization_name).filter(Boolean) || [])
      );
      
      // If no departments found, provide some default ones
      if (uniqueDepartments.length === 0) {
        const defaultDepartments = ["Finance", "Marketing", "Operations", "Human Resources", "IT"];
        setDepartments(defaultDepartments);
        return defaultDepartments;
      }

      setDepartments(uniqueDepartments);
      return uniqueDepartments;
    } catch (error: any) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch departments",
        variant: "destructive",
      });
      
      // Return default departments on error
      const defaultDepartments = ["Finance", "Marketing", "Operations", "Human Resources", "IT"];
      setDepartments(defaultDepartments);
      return defaultDepartments;
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
