import { useState } from "react";
import { ContentItem } from "./content/types";

export const useContentBrief = (
  updateContentItem: (itemId: string, updates: Partial<ContentItem>) => void
) => {
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("edit");

  // Open brief dialog for editing or viewing
  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setIsBriefDialogOpen(true);
  };

  // Save brief content
  const saveBrief = () => {
    if (currentItemId) {
      updateContentItem(currentItemId, { brief: currentBrief });
      setIsBriefDialogOpen(false);
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
    isBriefDialogOpen,
    setIsBriefDialogOpen,
    currentBrief,
    setCurrentBrief,
    currentItemId,
    briefDialogMode,
    setBriefDialogMode,
    openBriefDialog,
    saveBrief,
    extractGoogleDocsLink,
    displayBrief
  };
};
