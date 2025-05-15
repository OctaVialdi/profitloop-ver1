
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

export interface BudgetCategory {
  name: string;
  current: number;
  total: number;
  usedPercentage: number;
  status: "safe" | "warning" | "over";
}

export function useBudgetData() {
  const [budgetView, setBudgetView] = useState("current");
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const { organization } = useOrganization();

  // Handle budget view change
  const handleBudgetViewChange = (value: string) => {
    setBudgetView(value);
  };

  // Fetch department names from employee data
  useEffect(() => {
    const fetchDepartmentNames = async () => {
      try {
        if (!organization?.id) return;
        
        // Get unique department names from employee_employment table
        const { data: employmentData, error: employmentError } = await supabase
          .from("employee_employment")
          .select("organization_name")
          .eq("organization_id", organization.id)
          .not("organization_name", "is", null);
        
        if (employmentError) throw employmentError;
        
        // Extract unique department names
        const uniqueDepartments = new Set<string>();
        employmentData?.forEach((emp) => {
          if (emp.organization_name) {
            uniqueDepartments.add(emp.organization_name);
          }
        });
        
        // If no departments found, use default ones
        const departments = uniqueDepartments.size > 0 
          ? Array.from(uniqueDepartments) 
          : ["Marketing", "IT", "Operations", "HR"];
        
        // Create budget data for each department
        const budgetData: BudgetCategory[] = departments.map((dept, index) => {
          // Generate some demo data based on department name
          // In a real app, this would come from your budget database
          const total = (index + 1) * 15000000;
          const current = Math.min(total * (Math.random() * 0.8 + 0.1), total);
          const usedPercentage = Math.round((current / total) * 100);
          
          // Set status based on used percentage
          let status: "safe" | "warning" | "over" = "safe";
          if (usedPercentage > 80) {
            status = "over";
          } else if (usedPercentage > 50) {
            status = "warning";
          }
          
          return {
            name: dept,
            current,
            total,
            usedPercentage,
            status
          };
        });
        
        setBudgetCategories(budgetData);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };
    
    fetchDepartmentNames();
  }, [organization?.id]);

  return {
    budgetView,
    budgetCategories,
    handleBudgetViewChange
  };
}
