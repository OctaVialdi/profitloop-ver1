
import { useState } from "react";
import { ContentItem } from "@/hooks/useContentManagement";

export const useContentBrief = (updateContentItem: (itemId: string, updates: Partial<ContentItem>) => void) => {
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState("");
  const [briefDialogMode, setBriefDialogMode] = useState<"edit" | "view">("edit");

  // Function to check and extract Google Docs link
  const extractGoogleDocsLink = (text: string): string | null => {
    const googleDocsRegex = /https:\/\/docs\.google\.com\/[^\s]+/g;
    const match = text.match(googleDocsRegex);
    return match ? match[0] : null;
  };

  // Function to display brief text with truncation
  const displayBrief = (brief: string): string => {
    return brief.length > 25 ? brief.substring(0, 25) + "..." : brief;
  };

  const openBriefDialog = (itemId: string, brief: string, mode: "edit" | "view" = "edit") => {
    setCurrentItemId(itemId);
    setCurrentBrief(brief);
    setBriefDialogMode(mode);
    setIsBriefDialogOpen(true);
  };

  const saveBrief = () => {
    updateContentItem(currentItemId, { brief: currentBrief });
    setIsBriefDialogOpen(false);
  };

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
