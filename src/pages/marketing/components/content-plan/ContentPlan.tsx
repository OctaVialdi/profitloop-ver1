
import React, { useEffect } from "react";
import ContentPlanTable from "./ContentPlanTable";
import ContentPlanToolbar from "./ContentPlanToolbar";
import BriefDialog from "./dialogs/BriefDialog";
import TitleDialog from "./dialogs/TitleDialog";
import DeleteConfirmDialog from "./dialogs/DeleteConfirmDialog";
import ContentPlanError from "./ContentPlanError";
import { useContentPlanState } from "./hooks/useContentPlanState";

export default function ContentPlan() {
  const {
    contentPlans,
    contentTypes,
    services,
    subServices,
    contentPillars,
    contentPlanners,
    creativeTeamMembers,
    loading,
    error,
    selectedItems,
    deleteConfirmOpen,
    briefDialogOpen,
    titleDialogOpen,
    activeItemContent,
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
  } = useContentPlanState();

  useEffect(() => {
    fetchContentPlans();
  }, [fetchContentPlans]);

  if (error) {
    return <ContentPlanError error={error} />;
  }

  return (
    <div className="space-y-4 p-4">
      <ContentPlanToolbar
        selectedCount={selectedItems.length}
        onAddRow={handleAddRow}
        onConfirmDelete={() => setDeleteConfirmOpen(true)}
      />

      <ContentPlanTable
        contentPlans={contentPlans}
        contentTypes={contentTypes}
        services={services}
        subServices={subServices}
        contentPillars={contentPillars}
        contentPlanners={contentPlanners}
        creativeTeamMembers={creativeTeamMembers}
        loading={loading}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
        handleDateChange={handleDateChange}
        handleFieldChange={handleFieldChange}
        getFilteredSubServices={getFilteredSubServices}
        resetRevisionCounter={resetRevisionCounter}
        formatDisplayDate={formatDisplayDate}
        extractLink={extractLink}
        openBriefDialog={openBriefDialog}
        openTitleDialog={openTitleDialog}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        selectedCount={selectedItems.length}
        onConfirm={handleDeleteSelected}
      />

      {/* Brief Dialog */}
      <BriefDialog
        open={briefDialogOpen}
        onOpenChange={setBriefDialogOpen}
        content={activeItemContent}
        onSubmit={handleBriefSubmit}
      />

      {/* Title Dialog */}
      <TitleDialog
        open={titleDialogOpen}
        onOpenChange={setTitleDialogOpen}
        content={activeItemContent}
        onSubmit={handleTitleSubmit}
      />
    </div>
  );
}
