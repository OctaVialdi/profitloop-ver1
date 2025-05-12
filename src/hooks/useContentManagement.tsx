
import { useState, useEffect, useMemo } from 'react';
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
  parentId: string;
  name: string;
}

export interface ContentPillar {
  id: string;
  name: string;
}

export interface PIC {
  id: string;
  name: string;
  employeeId: string;
}

export interface ContentItem {
  id: string;
  postDate: string;
  contentType: string;
  pic?: string;
  service?: string;
  subService?: string;
  title?: string;
  contentPillar?: string;
  brief?: string;
  status?: string;
  revisions?: number;
  approved?: boolean;
  completionDate?: string;
  isSelected?: boolean;
}

export const useContentManagement = () => {
  const { employees } = useEmployees();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [subServicesList, setSubServicesList] = useState<SubService[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [currentUser, setCurrentUser] = useState<LegacyEmployee | null>(null);
  const [picList, setPICList] = useState<PIC[]>([]);

  // Check if current user is a marketing manager
  const isManager = useMemo(() => {
    return currentUser?.jobPosition?.toLowerCase().includes("manager") && 
           currentUser?.organization === "Digital Marketing";
  }, [currentUser]);

  // Load data from localStorage
  useEffect(() => {
    // Load content types
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
    
    // Load services
    const storedServices = localStorage.getItem("marketingServices");
    if (storedServices) {
      setServicesList(JSON.parse(storedServices));
    } else {
      const defaultServices: Service[] = [];
      localStorage.setItem("marketingServices", JSON.stringify(defaultServices));
    }
    
    // Load subservices
    const storedSubServices = localStorage.getItem("marketingSubServices");
    if (storedSubServices) {
      setSubServicesList(JSON.parse(storedSubServices));
    } else {
      const defaultSubServices: SubService[] = [];
      localStorage.setItem("marketingSubServices", JSON.stringify(defaultSubServices));
    }
    
    // Load content pillars
    const storedPillars = localStorage.getItem("contentPillars");
    if (storedPillars) {
      setContentPillars(JSON.parse(storedPillars));
    } else {
      const defaultPillars: ContentPillar[] = [];
      localStorage.setItem("contentPillars", JSON.stringify(defaultPillars));
    }
    
    // Load content items if they exist
    const storedItems = localStorage.getItem("marketingContentItems");
    if (storedItems) {
      setContentItems(JSON.parse(storedItems));
    }
  }, []);

  // Save content items when they change
  useEffect(() => {
    if (contentItems.length > 0) {
      localStorage.setItem("marketingContentItems", JSON.stringify(contentItems));
    }
  }, [contentItems]);

  // Get current user and PICs
  useEffect(() => {
    if (employees.length > 0) {
      const marketingEmployees = employees
        .map(convertToLegacyFormat)
        .filter(employee => employee.organization === "Digital Marketing");
      
      // Find content planners for PIC dropdown
      const contentPlanners = marketingEmployees
        .filter(employee => employee.jobPosition?.includes("Content Planner"))
        .map(employee => ({
          id: employee.id,
          name: employee.name,
          employeeId: employee.employeeId || employee.employee_id || ""
        }));
      
      setPICList(contentPlanners);
      
      // Set current user
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
      contentType: contentTypes.length > 0 ? contentTypes[0].id : "",
      isSelected: false
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

  // Service management functions
  const addService = (name: string) => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name
    };
    
    setServicesList(prev => [...prev, newService]);
    localStorage.setItem("marketingServices", JSON.stringify([...servicesList, newService]));
    return newService;
  };

  const deleteService = (id: string) => {
    // Delete service and all related sub-services
    setServicesList(prev => prev.filter(service => service.id !== id));
    setSubServicesList(prev => prev.filter(subService => subService.parentId !== id));
    
    // Update localStorage
    const updatedServices = servicesList.filter(service => service.id !== id);
    const updatedSubServices = subServicesList.filter(subService => subService.parentId !== id);
    
    localStorage.setItem("marketingServices", JSON.stringify(updatedServices));
    localStorage.setItem("marketingSubServices", JSON.stringify(updatedSubServices));
  };

  // SubService management functions
  const addSubService = (name: string, parentId: string) => {
    const newSubService: SubService = {
      id: `subservice-${Date.now()}`,
      parentId,
      name
    };
    
    setSubServicesList(prev => [...prev, newSubService]);
    localStorage.setItem("marketingSubServices", JSON.stringify([...subServicesList, newSubService]));
    return newSubService;
  };

  const deleteSubService = (id: string) => {
    setSubServicesList(prev => prev.filter(subService => subService.id !== id));
    
    // Update localStorage
    const updatedSubServices = subServicesList.filter(subService => subService.id !== id);
    localStorage.setItem("marketingSubServices", JSON.stringify(updatedSubServices));
  };

  // Content pillar management functions
  const addContentPillar = (name: string) => {
    const newPillar: ContentPillar = {
      id: `pillar-${Date.now()}`,
      name
    };
    
    setContentPillars(prev => [...prev, newPillar]);
    localStorage.setItem("contentPillars", JSON.stringify([...contentPillars, newPillar]));
    return newPillar;
  };

  const deleteContentPillar = (id: string) => {
    setContentPillars(prev => prev.filter(pillar => pillar.id !== id));
    
    // Update localStorage
    const updatedPillars = contentPillars.filter(pillar => pillar.id !== id);
    localStorage.setItem("contentPillars", JSON.stringify(updatedPillars));
  };

  return {
    contentTypes,
    servicesList,
    subServicesList,
    contentPillars,
    contentItems,
    currentUser,
    picList,
    isManager,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems,
    addService,
    deleteService,
    addSubService,
    deleteSubService,
    addContentPillar,
    deleteContentPillar
  };
};
