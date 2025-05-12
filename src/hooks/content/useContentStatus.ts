import { ContentItem } from "./types";

export const useContentStatus = (updateContentItem: (itemId: string, updates: Partial<ContentItem>) => void) => {
  // Reset revision counter for a specific item
  const resetRevisionCounter = (itemId: string) => {
    updateContentItem(itemId, { revisionCount: 0 });
  };
  
  // Reset production revision counter for a specific item
  const resetProductionRevisionCounter = (itemId: string) => {
    updateContentItem(itemId, { productionRevisionCount: 0 });
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

  // Extract Google Docs link helper function
  const extractGoogleDocsLink = (text: string): string | null => {
    if (!text) return null;
    
    // Match Google Docs links that start with https://docs.google.com/
    const googleDocsRegex = /(https:\/\/docs\.google\.com\/[^\s]+)/i;
    const match = text.match(googleDocsRegex);
    
    return match ? match[0] : null;
  };

  // Format brief display
  const displayBrief = (brief: string): string => {
    if (!brief) return "Add Brief";
    
    // If brief is a URL or contains a URL, show "View Brief"
    if (extractGoogleDocsLink(brief)) {
      return "View Brief";
    }
    
    // Otherwise show a preview of the brief (first 15 chars)
    return brief.length > 15 ? brief.substring(0, 15) + "..." : brief;
  };

  return {
    resetRevisionCounter,
    resetProductionRevisionCounter,
    calculateOnTimeStatus,
    extractGoogleDocsLink,
    displayBrief
  };
};
