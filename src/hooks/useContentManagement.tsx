
import { useState, useEffect } from 'react';
import { useEmployees, LegacyEmployee, convertToLegacyFormat } from "@/hooks/useEmployees";

export interface ContentType {
  id: string;
  name: string;
}

export interface ContentPillar {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  name: string;
  serviceId: string;
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
  revisionCount?: number;
  isApproved?: boolean;
  completionDate?: string;
  isSelected?: boolean;
}

export const useContentManagement = () => {
  const { employees } = useEmployees();
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
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
  }, []);

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
      contentType: contentTypes.length > 0 ? contentTypes[0].id : "",
      isSelected: false,
      revisionCount: 0
    };
    
    setContentItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          // Special handling for brief updates: reset status if brief is changed
          if (updates.brief !== undefined && updates.brief !== item.brief) {
            return { ...item, ...updates, status: "none" };
          }
          return { ...item, ...updates };
        }
        return item;
      })
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
    contentItems,
    currentUser,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  };
};
