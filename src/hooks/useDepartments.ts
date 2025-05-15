
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

export const useDepartments = () => {
  const { toast } = useToast();
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      // Get unique departments from employee data
      const { data, error } = await supabase
        .from("org_structure")
        .select("name")
        .eq("organization_id", organizationId)
        .eq("type", "department");

      if (error) throw error;

      // Extract unique department names
      const uniqueDepartments = Array.from(
        new Set(data?.map(item => item.name).filter(Boolean) || [])
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
    if (organizationId) {
      fetchDepartments();
    }
  }, [organizationId]);

  return {
    loading,
    departments,
    fetchDepartments
  };
};
