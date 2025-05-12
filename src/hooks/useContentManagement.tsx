
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

export interface ContentItem {
  id: string;
  postDate?: string;
  contentType: string;
  pic?: string;
  service?: string;
  subService?: string;
  title?: string;
  contentPillar?: string;
  brief?: string;
  status?: string;
  revisionCount?: number;
  isApproved?: boolean;
  completionDate?: string;
  isSelected?: boolean;
  picProduction?: string;
  googleDriveLink?: string;
  productionStatus?: string;
  productionRevisionCount?: number;
  productionCompletionDate?: string;
  productionApproved?: boolean;
  productionApprovedDate?: string;
  postLink?: string;
  isDone?: boolean;
  actualPostDate?: string;
  contentStatus?: string;
}

export const useContentManagement = () => {
  const { employees } = useEmployees();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [contentPlanners, setContentPlanners] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<LegacyEmployee | null>(null);

  // Load content types from localStorage
  useEffect(() => {
    const storedTypes = localStorage.getItem("marketingContentTypes");
    if (storedTypes) {
      setContentTypes(JSON.parse(storedTypes));
    } else {
      // Default content types if none exist
      const defaultTypes = [
        { id: "1", name: "Image Post" },
        { id: "2", name: "Video Post" },
        { id: "3", name: "Story" },
        { id: "4", name: "Carousel" }
      ];
      setContentTypes(defaultTypes);
      localStorage.setItem("marketingContentTypes", JSON.stringify(defaultTypes));
    }
    
    // Load content items if they exist
    const storedItems = localStorage.getItem("marketingContentItems");
    if (storedItems) {
      setContentItems(JSON.parse(storedItems));
    }

    // Load services from localStorage
    const storedServices = localStorage.getItem("marketingServices");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Default services if none exist
      const defaultServices = [
        { id: "1", name: "Social Media Management" },
        { id: "2", name: "Content Creation" },
        { id: "3", name: "SEO" }
      ];
      setServices(defaultServices);
      localStorage.setItem("marketingServices", JSON.stringify(defaultServices));
    }

    // Load subServices from localStorage
    const storedSubServices = localStorage.getItem("marketingSubServices");
    if (storedSubServices) {
      setSubServices(JSON.parse(storedSubServices));
    } else {
      // Default subServices if none exist
      const defaultSubServices = [
        { id: "1", serviceId: "1", name: "Instagram" },
        { id: "2", serviceId: "1", name: "Facebook" },
        { id: "3", serviceId: "2", name: "Video Production" },
        { id: "4", serviceId: "2", name: "Graphic Design" },
        { id: "5", serviceId: "3", name: "On-page SEO" },
        { id: "6", serviceId: "3", name: "Off-page SEO" }
      ];
      setSubServices(defaultSubServices);
      localStorage.setItem("marketingSubServices", JSON.stringify(defaultSubServices));
    }

    // Load content pillars from localStorage
    const storedPillars = localStorage.getItem("marketingContentPillars");
    if (storedPillars) {
      setContentPillars(JSON.parse(storedPillars));
    } else {
      // Default content pillars if none exist
      const defaultPillars = [
        { id: "1", name: "Educational" },
        { id: "2", name: "Inspirational" },
        { id: "3", name: "Promotional" },
        { id: "4", name: "Entertainment" }
      ];
      setContentPillars(defaultPillars);
      localStorage.setItem("marketingContentPillars", JSON.stringify(defaultPillars));
    }
  }, []);

  // Load content planners from employees
  useEffect(() => {
    if (employees.length > 0) {
      const planners = employees
        .map(convertToLegacyFormat)
        .filter(emp => emp.organization === "Digital Marketing" && emp.jobPosition === "Content Planner");
      
      setContentPlanners(planners);
    }
  }, [employees]);

  // Save content items when they change
  useEffect(() => {
    if (contentItems.length > 0) {
      localStorage.setItem("marketingContentItems", JSON.stringify(contentItems));
    }
  }, [contentItems]);

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

  const addContentItem = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const newItem: ContentItem = {
      id: `content-${Date.now()}`,
      postDate: today,
      contentType: contentTypes.length > 0 ? contentTypes[0].id : "none",
      isSelected: false,
      pic: "none",
      service: "none",
      subService: "none",
      status: "none",
      revisionCount: 0,
      isApproved: false,
      productionStatus: "none",
      productionRevisionCount: 0,
      productionApproved: false,
      isDone: false,
      contentStatus: "none"
    };
    
    setContentItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const deleteContentItems = (ids: string[]) => {
    setContentItems(prev => prev.filter(item => !ids.includes(item.id)));
  };

  const toggleSelectItem = (id: string) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const selectAllItems = (selected: boolean) => {
    setContentItems(prev => 
      prev.map(item => ({ ...item, isSelected: selected }))
    );
  };

  const resetRevisionCounter = (id: string) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, revisionCount: 0 } : item
      )
    );
  };

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
    currentUser,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    resetRevisionCounter,
    getFilteredSubServices
  };
};
