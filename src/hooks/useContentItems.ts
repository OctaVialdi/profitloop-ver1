
import { useState, useEffect } from "react";
import { ContentItem } from "@/types/contentManagement";

export const useContentItems = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  
  // Load content items from localStorage
  useEffect(() => {
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
  
  return {
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  };
};
