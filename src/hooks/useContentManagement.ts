
import { useState, useEffect } from 'react';
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from "@/hooks/useEmployees";

export interface ContentType {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  serviceId: string;
  name: string;
}

export interface ContentPillar {
  id: string;
  name: string;
}

export const useContentManagement = () => {
  const { employees } = useEmployees();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [currentUser, setCurrentUser] = useState<LegacyEmployee | null>(null);
  
  // Load content types, services, and sub-services from localStorage
  useEffect(() => {
    const loadData = () => {
      // Load content types
      const storedContentTypes = localStorage.getItem("marketingContentTypes");
      if (storedContentTypes) {
        try {
          setContentTypes(JSON.parse(storedContentTypes));
        } catch (e) {
          console.error("Error parsing content types from localStorage:", e);
        }
      }

      // Load services
      const storedServices = localStorage.getItem("marketingServices");
      if (storedServices) {
        try {
          setServices(JSON.parse(storedServices));
        } catch (e) {
          console.error("Error parsing services from localStorage:", e);
        }
      }

      // Load sub-services
      const storedSubServices = localStorage.getItem("marketingSubServices");
      if (storedSubServices) {
        try {
          setSubServices(JSON.parse(storedSubServices));
        } catch (e) {
          console.error("Error parsing sub-services from localStorage:", e);
        }
      }

      // Load content pillars
      const storedContentPillars = localStorage.getItem("marketingContentPillars");
      if (storedContentPillars) {
        try {
          setContentPillars(JSON.parse(storedContentPillars));
        } catch (e) {
          console.error("Error parsing content pillars from localStorage:", e);
        }
      }

      // Load content planners (employees with jobPosition "Content Planner")
      const storedEmployeesJson = localStorage.getItem('employees');
      if (storedEmployeesJson) {
        try {
          const allEmployees = JSON.parse(storedEmployeesJson);
          // Filter for Digital Marketing employees with Content Planner position
          const planners = allEmployees.filter(
            (emp: any) => emp.organization === "Digital Marketing" && 
                      emp.jobPosition === "Content Planner"
          );
          setContentPlanners(planners);
        } catch (e) {
          console.error("Error parsing employees from localStorage:", e);
        }
      }
    };

    loadData();
  }, []);

  // Get current user
  useEffect(() => {
    if (employees.length > 0) {
      const marketingEmployees = employees
        .map(convertToLegacyFormat)
        .filter(employee => employee.organization === "Digital Marketing");
      
      const manager = marketingEmployees.find(
        employee => employee.jobPosition?.toLowerCase().includes("manager")
      );
      
      if (manager) {
        setCurrentUser(manager);
      } else if (marketingEmployees.length > 0) {
        // Default to first marketing employee if no manager exists
        setCurrentUser(marketingEmployees[0]);
      }
    }
  }, [employees]);

  // Get filtered sub-services for a specific service
  const getFilteredSubServices = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };

  return {
    contentTypes,
    services,
    subServices,
    contentPlanners,
    contentPillars,
    currentUser,
    getFilteredSubServices
  };
};
