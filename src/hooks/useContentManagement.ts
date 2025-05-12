
import { useContentItems } from "@/hooks/useContentItems";
import { useContentMetadata } from "@/hooks/useContentMetadata";
import { useContentStatus } from "@/hooks/useContentStatus";
import { ContentItem } from "@/types/contentManagement";

export * from "@/types/contentManagement";

export const useContentManagement = () => {
  const {
    contentItems,
    addContentItem,
    updateContentItem,
    deleteContentItems,
    toggleSelectItem,
    selectAllItems
  } = useContentItems();

  const {
    contentTypes,
    services,
    subServices,
    contentPillars,
    contentPlanners,
    productionTeam,
    getFilteredSubServices
  } = useContentMetadata();

  const {
    resetRevisionCounter,
    resetProductionRevisionCounter,
    handleStatusChange,
    handleProductionStatusChange,
    handleContentStatusChange,
    calculateOnTimeStatus
  } = useContentStatus(updateContentItem);

  // Handle approval changes
  const toggleApproval = (itemId: string, isApproved: boolean, field: keyof Pick<ContentItem, "isApproved" | "productionApproved">) => {
    const updates: Partial<ContentItem> = { 
      [field]: isApproved 
    };
    
    // Set the approval date if approving production
    if (field === "productionApproved" && isApproved) {
      const now = new Date();
      updates.productionApprovedDate = now.toISOString();
    } else if (field === "productionApproved" && !isApproved) {
      updates.productionApprovedDate = undefined;
    }
    
    updateContentItem(itemId, updates);
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
    calculateOnTimeStatus,
    handleStatusChange,
    handleProductionStatusChange,
    handleContentStatusChange,
    toggleApproval
  };
};
