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

export interface ContentPlanner {
  id: string;
  name: string;
  email: string;
}

export interface ContentPillar {
  id: string;
  name: string;
}

export interface ContentItem {
  id: string;
  postDate: string;
  contentType: string;
  pic: string;
  service: string;
  subService: string;
  title: string;
  contentPillar: string;
  brief: string;
  status: string;
  revisions: number;
  approved: boolean;
  completionDate: string | null;
  isSelected?: boolean;
}

export const useContentManagement = () => {
  const { employees } = useEmployees();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [contentPlanners, setContentPlanners] = useState<ContentPlanner[]>([]);
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [currentUser, setCurrentUser] = useState<LegacyEmployee | null>(null);
  
  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      // Load content types
      const storedContentTypes = localStorage.getItem("marketingContentTypes");
      if (storedContentTypes) {
        try {
          setContentTypes(JSON.parse(storedContentTypes));
        } catch (e) {
          console.error("Error parsing content types from localStorage:", e);
          // Initialize with defaults if parsing fails
          setDefaultContentTypes();
        }
      } else {
        // Initialize with defaults if no data exists
        setDefaultContentTypes();
      }

      // Load services
      const storedServices = localStorage.getItem("marketingServices");
      if (storedServices) {
        try {
          setServices(JSON.parse(storedServices));
        } catch (e) {
          console.error("Error parsing services from localStorage:", e);
          setDefaultServices();
        }
      } else {
        setDefaultServices();
      }

      // Load sub-services
      const storedSubServices = localStorage.getItem("marketingSubServices");
      if (storedSubServices) {
        try {
          setSubServices(JSON.parse(storedSubServices));
        } catch (e) {
          console.error("Error parsing sub-services from localStorage:", e);
          setDefaultSubServices();
        }
      } else {
        setDefaultSubServices();
      }

      // Load content pillars
      const storedContentPillars = localStorage.getItem("marketingContentPillars");
      if (storedContentPillars) {
        try {
          setContentPillars(JSON.parse(storedContentPillars));
        } catch (e) {
          console.error("Error parsing content pillars from localStorage:", e);
          setDefaultContentPillars();
        }
      } else {
        setDefaultContentPillars();
      }
      
      // Load content items
      const storedContentItems = localStorage.getItem("marketingContentItems");
      if (storedContentItems) {
        try {
          // Make sure all loaded items use "none" for empty status
          const parsedItems = JSON.parse(storedContentItems);
          const updatedItems = parsedItems.map((item: ContentItem) => ({
            ...item,
            status: item.status || "none" // Replace any empty string with "none"
          }));
          setContentItems(updatedItems);
        } catch (e) {
          console.error("Error parsing content items from localStorage:", e);
        }
      }
    };

    loadData();
  }, []);
  
  // Initialize content planners from employees
  useEffect(() => {
    if (employees.length > 0) {
      // Filter Content Planner positions
      const planners = employees
        .map(convertToLegacyFormat)
        .filter(emp => emp.jobPosition === "Content Planner" && emp.organization === "Digital Marketing")
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email || ""
        }));
      
      setContentPlanners(planners);
    }
  }, [employees]);

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
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (contentTypes.length > 0) {
      localStorage.setItem("marketingContentTypes", JSON.stringify(contentTypes));
    }
  }, [contentTypes]);
  
  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem("marketingServices", JSON.stringify(services));
    }
  }, [services]);
  
  useEffect(() => {
    if (subServices.length > 0) {
      localStorage.setItem("marketingSubServices", JSON.stringify(subServices));
    }
  }, [subServices]);
  
  useEffect(() => {
    if (contentPillars.length > 0) {
      localStorage.setItem("marketingContentPillars", JSON.stringify(contentPillars));
    }
  }, [contentPillars]);
  
  useEffect(() => {
    if (contentItems.length > 0) {
      localStorage.setItem("marketingContentItems", JSON.stringify(contentItems));
    }
  }, [contentItems]);
  
  // Default data initialization functions
  const setDefaultContentTypes = () => {
    const defaults: ContentType[] = [
      { id: "1", name: "Image Post" },
      { id: "2", name: "Video Post" },
      { id: "3", name: "Story" },
      { id: "4", name: "Carousel" },
      { id: "5", name: "Reel" }
    ];
    setContentTypes(defaults);
    localStorage.setItem("marketingContentTypes", JSON.stringify(defaults));
  };
  
  const setDefaultServices = () => {
    const defaults: Service[] = [
      { id: "1", name: "Social Media Management" },
      { id: "2", name: "Content Creation" },
      { id: "3", name: "Digital Advertising" }
    ];
    setServices(defaults);
    localStorage.setItem("marketingServices", JSON.stringify(defaults));
  };
  
  const setDefaultSubServices = () => {
    const defaults: SubService[] = [
      { id: "1", serviceId: "1", name: "Instagram Management" },
      { id: "2", serviceId: "1", name: "Facebook Management" },
      { id: "3", serviceId: "1", name: "TikTok Management" },
      { id: "4", serviceId: "2", name: "Graphic Design" },
      { id: "5", serviceId: "2", name: "Copywriting" },
      { id: "6", serviceId: "3", name: "Google Ads" },
      { id: "7", serviceId: "3", name: "Facebook Ads" }
    ];
    setSubServices(defaults);
    localStorage.setItem("marketingSubServices", JSON.stringify(defaults));
  };
  
  const setDefaultContentPillars = () => {
    const defaults: ContentPillar[] = [
      { id: "1", name: "Education" },
      { id: "2", name: "Promotion" },
      { id: "3", name: "Entertainment" },
      { id: "4", name: "Inspiration" },
      { id: "5", name: "Conversion" }
    ];
    setContentPillars(defaults);
    localStorage.setItem("marketingContentPillars", JSON.stringify(defaults));
  };

  // Get filtered sub-services for a specific service
  const getFilteredSubServices = (serviceId: string) => {
    return subServices.filter(subService => subService.serviceId === serviceId);
  };
  
  // Content Types Management
  const addContentType = (name: string) => {
    const newType: ContentType = {
      id: `type-${Date.now()}`,
      name
    };
    setContentTypes([...contentTypes, newType]);
    return newType;
  };
  
  const updateContentType = (id: string, name: string) => {
    const updated = contentTypes.map(type => 
      type.id === id ? { ...type, name } : type
    );
    setContentTypes(updated);
  };
  
  const deleteContentType = (id: string) => {
    setContentTypes(contentTypes.filter(type => type.id !== id));
  };
  
  // Services Management
  const addService = (name: string) => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      name
    };
    setServices([...services, newService]);
    return newService;
  };
  
  const updateService = (id: string, name: string) => {
    const updated = services.map(service => 
      service.id === id ? { ...service, name } : service
    );
    setServices(updated);
  };
  
  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    // Also remove associated sub-services
    setSubServices(subServices.filter(subService => subService.serviceId !== id));
  };
  
  // Sub-Services Management
  const addSubService = (serviceId: string, name: string) => {
    const newSubService: SubService = {
      id: `subservice-${Date.now()}`,
      serviceId,
      name
    };
    setSubServices([...subServices, newSubService]);
    return newSubService;
  };
  
  const updateSubService = (id: string, serviceId: string, name: string) => {
    const updated = subServices.map(subService => 
      subService.id === id ? { ...subService, serviceId, name } : subService
    );
    setSubServices(updated);
  };
  
  const deleteSubService = (id: string) => {
    setSubServices(subServices.filter(subService => subService.id !== id));
  };
  
  // Content Pillars Management
  const addContentPillar = (name: string) => {
    const newPillar: ContentPillar = {
      id: `pillar-${Date.now()}`,
      name
    };
    setContentPillars([...contentPillars, newPillar]);
    return newPillar;
  };
  
  const updateContentPillar = (id: string, name: string) => {
    const updated = contentPillars.map(pillar => 
      pillar.id === id ? { ...pillar, name } : pillar
    );
    setContentPillars(updated);
  };
  
  const deleteContentPillar = (id: string) => {
    setContentPillars(contentPillars.filter(pillar => pillar.id !== id));
  };
  
  // Content Items Management
  const addContentItem = () => {
    const today = new Date();
    const newItem: ContentItem = {
      id: `content-${Date.now()}`,
      postDate: today.toISOString().split('T')[0],
      contentType: "",
      pic: "",
      service: "",
      subService: "",
      title: "",
      contentPillar: "",
      brief: "",
      status: "none", // Use "none" instead of empty string
      revisions: 0,
      approved: false,
      completionDate: null,
      isSelected: false
    };
    
    setContentItems([newItem, ...contentItems]);
    return newItem;
  };
  
  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    // Ensure status is never an empty string
    if (updates.status === "") {
      updates.status = "none";
    }
    
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

  return {
    contentTypes,
    services,
    subServices,
    contentPlanners,
    contentPillars,
    contentItems,
    currentUser,
    getFilteredSubServices,
    addContentType,
    updateContentType,
    deleteContentType,
    addService,
    updateService,
    deleteService,
    addSubService,
    updateSubService,
    deleteSubService,
    addContentPillar,
    updateContentPillar,
    deleteContentPillar,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  };
};
