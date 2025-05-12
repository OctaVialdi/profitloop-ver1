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
  picProduction: string;
  googleDriveLink: string;
  productionStatus: string;
  productionRevisionCount: number;
  productionCompletionDate: string | undefined;
  productionApproved: boolean;
  productionApprovedDate: string | undefined;
  postLink: string;
  isDone: boolean;
  actualPostDate: string | undefined;
  contentStatus: string;
}

export const useContentManagement = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  
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
      contentType: "",
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
      picProduction: "",
      googleDriveLink: "",
      productionStatus: "none",
      productionRevisionCount: 0,
      productionCompletionDate: undefined,
      productionApproved: false,
      productionApprovedDate: undefined,
      postLink: "",
      isDone: false,
      actualPostDate: undefined,
      contentStatus: ""
    };
    setContentItems([newItem, ...contentItems]);
  };

  // Update a content item
  const updateContentItem = (itemId: string, updates: Partial<ContentItem>) => {
    // Increment revision count if changing status to "revisi"
    if (updates.status === "revisi") {
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && currentItem.status !== "revisi") {
        updates.revisionCount = (currentItem.revisionCount || 0) + 1;
      }
    }
    
    // Increment production revision count if changing status to "revisi"
    if (updates.productionStatus === "revisi") {
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && currentItem.productionStatus !== "revisi") {
        updates.productionRevisionCount = (currentItem.productionRevisionCount || 0) + 1;
      }
    }
    
    // Set completion date if status is changing to "review" and there's no completion date yet
    if (updates.status === "review") {
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && !currentItem.completionDate) {
        updates.completionDate = new Date().toISOString();
      }
    } else if (updates.status && updates.status !== "review") {
      // Clear completion date if status is changing away from "review"
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && currentItem.status === "review") {
        updates.completionDate = undefined;
      }
    }
    
    // Set production completion date if status is changing to "review" and there's no completion date yet
    if (updates.productionStatus === "review") {
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && !currentItem.productionCompletionDate) {
        updates.productionCompletionDate = new Date().toISOString();
      }
    } else if (updates.productionStatus && updates.productionStatus !== "review") {
      // Clear production completion date if status is changing away from "review"
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && currentItem.productionStatus === "review") {
        updates.productionCompletionDate = undefined;
      }
    }

    // Set production approved date if productionApproved is changing to true
    if (updates.productionApproved === true) {
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && !currentItem.productionApprovedDate) {
        updates.productionApprovedDate = new Date().toISOString();
      }
    } else if (updates.productionApproved === false) {
      // Clear production approved date if productionApproved is changing to false
      updates.productionApprovedDate = undefined;
    }
    
    // Set actual post date when postLink is added
    if (updates.postLink && updates.postLink.trim() !== '') {
      const currentItem = contentItems.find(item => item.id === itemId);
      if (currentItem && (!currentItem.postLink || currentItem.postLink.trim() === '')) {
        updates.actualPostDate = new Date().toISOString();
      }
    } else if (updates.postLink === '') {
      updates.actualPostDate = undefined;
    }
    
    // Check if brief is being changed, and if so, reset status
    if (updates.brief !== undefined) {
      updates.status = "none";
    }

    // Check if googleDriveLink is being changed, and if so, reset productionStatus
    if (updates.googleDriveLink !== undefined) {
      updates.productionStatus = "none";
    }
    
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

  return {
    contentTypes,
    services,
    subServices,
    contentItems,
    contentPlanners,
    contentPillars,
    addContentItem,
    updateContentItem,
    resetRevisionCounter,
    resetProductionRevisionCounter,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    getFilteredSubServices
  };
};
