
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ContentPlanItem, useContentPlan } from "@/hooks/content-plan";
import { useOrganization } from "@/hooks/useOrganization";
import { format } from 'date-fns';

import ContentPlanToolbar from "./ContentPlanToolbar";
import ContentPlanTable from "./ContentPlanTable";
import BriefDialog from "./dialogs/BriefDialog";
import TitleDialog from "./dialogs/TitleDialog";

export default function ContentPlan() {
  const {
    contentPlans,
    contentTypes,
    services,
    subServices,
    contentPillars,
    loading,
    error,
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    getFilteredSubServices,
    resetRevisionCounter,
    formatDisplayDate,
    getContentPlannerTeamMembers,
    getCreativeTeamMembers
  } = useContentPlan();
  
  const { organization } = useOrganization();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBriefDialogOpen, setIsBriefDialogOpen] = useState(false);
  const [currentBrief, setCurrentBrief] = useState("");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");

  // Content planners for PIC dropdown
  const contentPlanners = getContentPlannerTeamMembers();
  
  // Creative team members for PIC Production dropdown
  const creativeTeamMembers = getCreativeTeamMembers();

  // For adding new rows
  const addNewRow = () => {
    if (!organization?.id) {
      console.error("Cannot add row: No organization ID available");
      return;
    }
    
    console.log("Adding new row with organization ID:", organization.id);
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    addContentPlan({
      post_date: formattedDate,
      revision_count: 0,
      production_revision_count: 0,
      approved: false,
      production_approved: false,
      done: false,
      status: "",
      production_status: "",
      organization_id: organization.id
    });
  };

  // Handler for checkbox selection
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  // Handler for deleting selected items
  const handleDeleteSelected = async () => {
    for (const id of selectedItems) {
      await deleteContentPlan(id);
    }
    setSelectedItems([]);
  };

  // Handler for updating date
  const handleDateChange = async (id: string, date: Date | undefined) => {
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    await updateContentPlan(id, {
      post_date: formattedDate
    });
  };

  // Handler for updating fields
  const handleFieldChange = async (id: string, field: string, value: any) => {
    let updates: any = {
      [field]: value
    };

    // Reset status fields when brief changes
    if (field === 'brief') {
      updates.status = "";
    }

    // Reset production status when google drive link changes
    if (field === 'google_drive_link') {
      updates.production_status = "";
    }

    // Auto-populate completion date when status is "Butuh Di Review"
    if (field === 'status' && value === "Butuh Di Review") {
      const now = new Date();
      updates.completion_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'status' && value !== "Butuh Di Review") {
      updates.completion_date = null;
    }

    // Auto-populate production completion date when production status is "Butuh Di Review"
    if (field === 'production_status' && value === "Butuh Di Review") {
      const now = new Date();
      updates.production_completion_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'production_status' && value !== "Butuh Di Review") {
      updates.production_completion_date = null;
    }

    // Auto-populate actual post date when post link is added
    if (field === 'post_link' && value) {
      const now = new Date();
      updates.actual_post_date = format(now, "yyyy-MM-dd");
    } else if (field === 'post_link' && !value) {
      updates.actual_post_date = null;
    }

    // If status changes to "Request Revisi", increment revision count
    if (field === 'status' && value === "Request Revisi") {
      const item = contentPlans.find(plan => plan.id === id);
      if (item) {
        updates.revision_count = (item.revision_count || 0) + 1;
      }
    }

    // If production status changes to "Request Revisi", increment production revision count
    if (field === 'production_status' && value === "Request Revisi") {
      const item = contentPlans.find(plan => plan.id === id);
      if (item) {
        updates.production_revision_count = (item.production_revision_count || 0) + 1;
      }
    }

    // If approved is set, auto-populate production_approved_date
    if (field === 'production_approved' && value === true) {
      const now = new Date();
      updates.production_approved_date = format(now, "yyyy-MM-dd HH:mm");
    } else if (field === 'production_approved' && value === false) {
      updates.production_approved_date = null;
    }
    await updateContentPlan(id, updates);
  };

  // Check if a Google Docs link is present in the brief
  const extractLink = (text: string | null) => {
    if (!text) return null;
    const regex = /(https?:\/\/\S+)/g;
    const match = text.match(regex);
    return match ? match[0] : null;
  };

  // Handle brief dialog
  const openBriefDialog = (id: string, brief: string | null) => {
    setCurrentItemId(id);
    setCurrentBrief(brief || "");
    setIsBriefDialogOpen(true);
  };
  const saveBrief = async () => {
    if (currentItemId) {
      await handleFieldChange(currentItemId, 'brief', currentBrief);
    }
    setIsBriefDialogOpen(false);
  };

  // Handle title dialog
  const openTitleDialog = (id: string, title: string | null) => {
    setCurrentItemId(id);
    setCurrentTitle(title || "");
    setIsTitleDialogOpen(true);
  };
  const saveTitle = async () => {
    if (currentItemId) {
      await handleFieldChange(currentItemId, 'title', currentTitle);
    }
    setIsTitleDialogOpen(false);
  };

  return (
    <div className="w-full space-y-4 p-6">
      <ContentPlanToolbar 
        selectedItems={selectedItems}
        onAddNewRow={addNewRow}
        onDeleteSelected={handleDeleteSelected}
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load content plan data. Please check your organization settings and try again."}
          </AlertDescription>
        </Alert>
      )}
      
      {!organization?.id && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Organization Required</AlertTitle>
          <AlertDescription>
            No organization context found. Please ensure you're logged in and belong to an organization.
          </AlertDescription>
        </Alert>
      )}
      
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

      <BriefDialog
        open={isBriefDialogOpen}
        onOpenChange={setIsBriefDialogOpen}
        brief={currentBrief}
        onBriefChange={setCurrentBrief}
        onSave={saveBrief}
      />

      <TitleDialog
        open={isTitleDialogOpen}
        onOpenChange={setIsTitleDialogOpen}
        title={currentTitle}
        onTitleChange={setCurrentTitle}
        onSave={saveTitle}
      />
    </div>
  );
}
