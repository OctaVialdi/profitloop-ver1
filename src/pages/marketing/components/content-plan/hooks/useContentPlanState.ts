
import { useContentPlan } from "@/hooks/useContentPlan";
import { useSelectedItems } from "./useSelectedItems";
import { useDialogState } from "./useDialogState";
import { useContentPlanMutations } from "./useContentPlanMutations";
import { useContentUtils } from "./useContentUtils";
import { useCallback, useMemo } from "react";
import { LegacyEmployee } from "@/hooks/useEmployees";

export function useContentPlanState() {
  // Get content plan data and operations from the main hook
  const {
    contentPlans,
    contentTypes,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    fetchContentPlans,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  } = useContentPlan();

  // Selected items state and handlers
  const { selectedItems, setSelectedItems, handleSelectItem } = useSelectedItems();

  // Dialog state and handlers
  const {
    deleteConfirmOpen,
    briefDialogOpen,
    titleDialogOpen,
    activeItemId,
    activeItemContent,
    setDeleteConfirmOpen,
    setBriefDialogOpen,
    setTitleDialogOpen,
    openBriefDialog,
    openTitleDialog
  } = useDialogState();

  // Content plan mutation handlers
  const {
    handleAddRow,
    handleDeleteSelected: handleDeleteSelectedItems,
    handleDateChange,
    handleFieldChange,
    handleBriefSubmit: handleBriefSubmitMutation,
    handleTitleSubmit: handleTitleSubmitMutation
  } = useContentPlanMutations(addContentPlan, updateContentPlan, deleteContentPlan);

  // Content utility functions
  const { extractLink } = useContentUtils();
  
  // Memoize team members lists - ensure they are explicitly typed as LegacyEmployee arrays
  const contentPlanners = useMemo<LegacyEmployee[]>(() => 
    getContentPlannerTeamMembers() as LegacyEmployee[], 
    [getContentPlannerTeamMembers]
  );
  
  const creativeTeamMembers = useMemo<LegacyEmployee[]>(() => 
    getCreativeTeamMembers() as LegacyEmployee[], 
    [getCreativeTeamMembers]
  );

  // Memoize handler functions
  const handleDeleteSelected = useCallback(async () => {
    const success = await handleDeleteSelectedItems(selectedItems);
    if (success) {
      setSelectedItems([]);
      setDeleteConfirmOpen(false);
    }
    return success;
  }, [selectedItems, handleDeleteSelectedItems, setSelectedItems, setDeleteConfirmOpen]);

  const handleBriefSubmit = useCallback(async (content: string) => {
    if (!activeItemId) return false;
    const success = await handleBriefSubmitMutation(activeItemId, content);
    if (success) {
      setBriefDialogOpen(false);
    }
    return success;
  }, [activeItemId, handleBriefSubmitMutation, setBriefDialogOpen]);

  const handleTitleSubmit = useCallback(async (content: string) => {
    if (!activeItemId) return false;
    const success = await handleTitleSubmitMutation(activeItemId, content);
    if (success) {
      setTitleDialogOpen(false);
    }
    return success;
  }, [activeItemId, handleTitleSubmitMutation, setTitleDialogOpen]);

  return {
    // Data
    contentPlans,
    contentTypes,
    services,
    subServices,
    contentPillars,
    contentPlanners,
    creativeTeamMembers,
    loading,
    error,
    
    // UI State
    selectedItems,
    deleteConfirmOpen,
    briefDialogOpen,
    titleDialogOpen,
    activeItemContent,
    
    // Functions
    fetchContentPlans,
    handleAddRow,
    handleDeleteSelected,
    handleSelectItem,
    handleDateChange,
    handleFieldChange,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate,
    extractLink,
    openBriefDialog,
    openTitleDialog,
    handleBriefSubmit,
    handleTitleSubmit,
    setDeleteConfirmOpen,
    setBriefDialogOpen,
    setTitleDialogOpen
  };
}
