
import { useState, useEffect } from "react";
import { ContentType, Service, SubService, ContentPillar } from "./types";

export const useContentMetadata = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [productionTeam, setProductionTeam] = useState<any[]>([]);
  
  // Load metadata from localStorage
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
      } else {
        // Default content pillars if none exist
        const defaultPillars = [
          { id: "1", name: "Awareness" },
          { id: "2", name: "Consideration" },
          { id: "3", name: "Decision" },
          { id: "4", name: "Loyalty" }
        ];
        setContentPillars(defaultPillars);
        localStorage.setItem("marketingContentPillars", JSON.stringify(defaultPillars));
      }

      // Load content planners and production team
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
          
          // Filter for Creative department employees with Production role
          const production = allEmployees.filter(
            (emp: any) => emp.organization === "Creative" && 
                      emp.jobPosition === "Produksi"
          );
          setProductionTeam(production);
        } catch (e) {
          console.error("Error parsing employees from localStorage:", e);
        }
      }
    };

    loadData();
  }, []);

  // Get filtered sub-services for a specific service
  const getFilteredSubServices = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };

  return {
    contentTypes,
    services,
    subServices,
    contentPillars,
    contentPlanners,
    productionTeam,
    getFilteredSubServices
  };
};
