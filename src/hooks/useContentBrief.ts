import { useState, useCallback } from "react";

interface UpdateContentItemFunction {
  (itemId: string, updates: any): void;
}

export const useContentBrief = (updateContentItem: UpdateContentItemFunction) => {
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("edit");

  // Extract Google Docs link if it exists in the brief
  const extractGoogleDocsLink = (text: string): string | null => {
    const googleDocsRegex = /(https:\/\/docs\.google\.com\/\S+)/i;
    const match = text.match(googleDocsRegex);
    return match ? match[1] : null;
  };

  // Format brief text for display in the table cell
  const displayBrief = (brief: string): string => {
    // Check if there's a Google Docs link
    const link = extractGoogleDocsLink(brief);
    
    // If there is a link, show "Google Doc" as the display text
    if (link) {
      return "Google Doc";
    }
    
    // Otherwise, truncate the brief text if it's too long
    if (brief.length > 20) {
      return brief.substring(0, 20) + "...";
    }
    
    return brief;
  };

  // Open the brief dialog
  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setIsBriefDialogOpen(true);
  };

  // Save the brief
  const saveBrief = useCallback(() => {
    if (currentItemId) {
      updateContentItem(currentItemId, { brief: currentBrief });
      setIsBriefDialogOpen(false);
    }
  }, [currentItemId, currentBrief, updateContentItem]);

  return {
    isBriefDialogOpen,
    setIsBriefDialogOpen,
    currentBrief,
    setCurrentBrief,
    currentItemId,
    briefDialogMode,
    setBriefDialogMode,
    extractGoogleDocsLink,
    displayBrief,
    openBriefDialog,
    saveBrief
  };
};
