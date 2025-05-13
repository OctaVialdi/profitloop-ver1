
import { useState } from "react";
import { useContentItems } from "./content/useContentItems";
import { useContentMetadata } from "./content/useContentMetadata";
import { useContentStatus } from "./content/useContentStatus";
import { ContentItem, ContentType, Service, SubService, ContentPillar } from "./content/types";

export type { ContentItem, ContentType, Service, SubService, ContentPillar };

export const useContentManagement = () => {
  // Import functionality from smaller hooks
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
    calculateOnTimeStatus, 
    extractGoogleDocsLink, 
    displayBrief 
  } = useContentStatus(updateContentItem);

  // Return all functionality from the original hook to maintain compatibility
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
    extractGoogleDocsLink,
    displayBrief
  };
};
