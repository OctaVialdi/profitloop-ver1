
import { useState, useEffect } from "react";

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

export interface ContentItem {
  id: string;
  postDate: string | undefined;
  contentType: string;
  isSelected: boolean;
  pic: string;
  service: string;
  subService: string;
  title: string;
  contentPillar: string;
  brief: string;
  status: string;
  revisionCount: number;
  isApproved: boolean;
  completionDate: string | undefined;
  // New fields
  picProduction: string;
  googleDriveLink: string;
  productionStatus: string;
  productionRevisionCount: number;
  productionCompletionDate: string | undefined;
  productionApproved: boolean;
  productionApprovedDate: string | undefined;
  downloadLinkFile: string;
  postLink: string;
  isDone: boolean;
  actualPostDate: string | undefined;
  onTimeStatus: string;
  contentStatus: string;
}

export const useContentManagement = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [productionTeam, setProductionTeam] = useState<any[]>([]);
  
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
    
    // Load previously saved content items
    const storedItems = localStorage.getItem("contentItems");
    if (storedItems) {
      try {
        setContentItems(JSON.parse(storedItems));
      } catch (e) {
        console.error("Error parsing content items from localStorage:", e);
      }
    }
  }, []);

  // Save content items to localStorage whenever they change
  useEffect(() => {
    if (contentItems.length > 0) {
      localStorage.setItem("contentItems", JSON.stringify(contentItems));
    }
  }, [contentItems]);

  // Add a new content item
  const addContentItem = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const newItem: ContentItem = {
      id: `${Date.now()}`,
      postDate: today,
      contentType: contentTypes.length > 0 ? contentTypes[0].id : "",
      isSelected: false,
      pic: "",
      service: "",
      subService: "",
      title: "",
      contentPillar: "",
      brief: "",
      status: "none",
      revisionCount: 0,
      isApproved: false,
      completionDate: undefined,
      // New fields with default values
      picProduction: "",
      googleDriveLink: "",
      productionStatus: "none",
      productionRevisionCount: 0,
      productionCompletionDate: undefined,
      productionApproved: false,
      productionApprovedDate: undefined,
      downloadLinkFile: "",
      postLink: "",
      isDone: false,
      actualPostDate: undefined,
      onTimeStatus: "",
      contentStatus: "none"
    };
    setContentItems([...contentItems, newItem]);
  };

  // Update a content item
  const updateContentItem = (itemId: string, updates: Partial<ContentItem>) => {
    setContentItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  // Reset revision counter for a specific item
  const resetRevisionCounter = (itemId: string) => {
    setContentItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, revisionCount: 0 } : item
      )
    );
  };
  
  // Reset production revision counter for a specific item
  const resetProductionRevisionCounter = (itemId: string) => {
    setContentItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, productionRevisionCount: 0 } : item
      )
    );
  };

  // Delete content items by IDs
  const deleteContentItems = (itemIds: string[]) => {
    setContentItems(prevItems => 
      prevItems.filter(item => !itemIds.includes(item.id))
    );
  };

  // Toggle selection of an item
  const toggleSelectItem = (itemId: string) => {
    setContentItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // Select all items
  const selectAllItems = (selected: boolean) => {
    setContentItems(prevItems =>
      prevItems.map(item => ({ ...item, isSelected: selected }))
    );
  };

  // Get filtered sub-services for a specific service
  const getFilteredSubServices = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };
  
  // Calculate on-time status
  const calculateOnTimeStatus = (postDate: string | undefined, actualPostDate: string | undefined) => {
    if (!postDate || !actualPostDate) return "";
    
    const plannedDate = new Date(postDate);
    const actualDate = new Date(actualPostDate);
    
    // Reset hours to compare dates only
    plannedDate.setHours(0, 0, 0, 0);
    actualDate.setHours(0, 0, 0, 0);
    
    if (actualDate <= plannedDate) {
      return "On Time";
    } else {
      // Calculate days difference
      const diffTime = Math.abs(actualDate.getTime() - plannedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Late [${diffDays}] Day${diffDays > 1 ? 's' : ''}`;
    }
  };

  return {
    contentTypes,
    services,
    subServices,
    contentItems,
    contentPlanners,
    contentPillars,
    productionTeam,
    addContentItem,
    updateContentItem,
    resetRevisionCounter,
    resetProductionRevisionCounter,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    getFilteredSubServices,
    calculateOnTimeStatus
  };
};
