
import { useContentPlan } from "@/hooks/useContentPlan";
import { useSelectedItems } from "./useSelectedItems";
import { useDialogState } from "./useDialogState";
import { useContentPlanMutations } from "./useContentPlanMutations";
import { useContentUtils } from "./useContentUtils";

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
  
  // Get team members
  const contentPlanners = getContentPlannerTeamMembers();
  const creativeTeamMembers = getCreativeTeamMembers();

  // Combined handler functions
  const handleDeleteSelected = async () => {
    const success = await handleDeleteSelectedItems(selectedItems);
    if (success) {
      setSelectedItems([]);
      setDeleteConfirmOpen(false);
    }
  };

  const handleBriefSubmit = async (content: string) => {
    if (!activeItemId) return;
    const success = await handleBriefSubmitMutation(activeItemId, content);
    if (success) {
      setBriefDialogOpen(false);
    }
  };

  const handleTitleSubmit = async (content: string) => {
    if (!activeItemId) return;
    const success = await handleTitleSubmitMutation(activeItemId, content);
    if (success) {
      setTitleDialogOpen(false);
    }
  };

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
