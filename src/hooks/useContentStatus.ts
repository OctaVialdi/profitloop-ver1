
import { ContentItem } from "@/types/contentManagement";

export const useContentStatus = (updateContentItem: (itemId: string, updates: Partial<ContentItem>) => void) => {
  // Reset revision counter for a specific item
  const resetRevisionCounter = (itemId: string) => {
    updateContentItem(itemId, { revisionCount: 0 });
  };
  
  // Reset production revision counter for a specific item
  const resetProductionRevisionCounter = (itemId: string) => {
    updateContentItem(itemId, { productionRevisionCount: 0 });
  };

  // Handle status change
  const handleStatusChange = (itemId: string, status: string) => {
    const updates: Partial<ContentItem> = { status };
    
    // If status changes to "review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.completionDate = now.toISOString();
    }
    
    // If status changes to "revision", increment revision counter
    if (status === "revision") {
      updateContentItem(itemId, { 
        status,
        revisionCount: (item => (item?.revisionCount || 0) + 1)
      } as any);
      return;
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle production status change
  const handleProductionStatusChange = (itemId: string, status: string) => {
    const updates: Partial<ContentItem> = { productionStatus: status };
    
    // If status changes to "review", add completion date
    if (status === "review") {
      const now = new Date();
      updates.productionCompletionDate = now.toISOString();
    }
    
    // If status changes to "revision", increment revision counter
    if (status === "revision") {
      updateContentItem(itemId, { 
        productionStatus: status,
        productionRevisionCount: (item => (item?.productionRevisionCount || 0) + 1)
      } as any);
      return;
    }
    
    updateContentItem(itemId, updates);
  };
  
  // Handle content status change
  const handleContentStatusChange = (itemId: string, status: string) => {
    updateContentItem(itemId, { contentStatus: status });
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
    resetRevisionCounter,
    resetProductionRevisionCounter,
    handleStatusChange,
    handleProductionStatusChange,
    handleContentStatusChange,
    calculateOnTimeStatus
  };
};
