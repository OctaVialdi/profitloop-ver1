
import { useState, useCallback } from "react";

export function useDialogState() {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [briefDialogOpen, setBriefDialogOpen] = useState<boolean>(false);
  const [titleDialogOpen, setTitleDialogOpen] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeItemContent, setActiveItemContent] = useState<string | null>(null);

  const openBriefDialog = useCallback((id: string, brief: string | null) => {
    setActiveItemId(id);
    setActiveItemContent(brief);
    setBriefDialogOpen(true);
  }, []);

  const openTitleDialog = useCallback((id: string, title: string | null) => {
    setActiveItemId(id);
    setActiveItemContent(title);
    setTitleDialogOpen(true);
  }, []);

  return {
    deleteConfirmOpen,
    briefDialogOpen,
    titleDialogOpen,
    activeItemId,
    activeItemContent,
    setDeleteConfirmOpen,
    setBriefDialogOpen,
    setTitleDialogOpen,
    setActiveItemId,
    setActiveItemContent,
    openBriefDialog,
    openTitleDialog
  };
}
