
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useContentPlan } from "@/hooks/useContentPlan";
import ContentPlanTable from "./ContentPlanTable";
import ContentPlanToolbar from "./ContentPlanToolbar";
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

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [briefDialogOpen, setBriefDialogOpen] = useState<boolean>(false);
  const [titleDialogOpen, setTitleDialogOpen] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeItemContent, setActiveItemContent] = useState<string | null>(null);
  
  const contentPlanners = getContentPlannerTeamMembers();
  const creativeTeamMembers = getCreativeTeamMembers();

  useEffect(() => {
    fetchContentPlans();
  }, [fetchContentPlans]);

  const handleAddRow = async () => {
    try {
      await addContentPlan({
        status: "",
        revision_count: 0,
        approved: false,
        production_status: "",
        production_revision_count: 0,
        production_approved: false,
        done: false
      });
      toast({
        title: "Row added successfully",
        description: "A new row has been added to the content plan."
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error adding row",
        description: "There was a problem adding a new row."
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedItems.map(id => deleteContentPlan(id));
      await Promise.all(deletePromises);
      setSelectedItems([]);
      toast({
        title: "Items deleted",
        description: `${selectedItems.length} item(s) have been deleted.`
      });
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error deleting items",
        description: "There was a problem deleting the selected items."
      });
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleDateChange = async (id: string, date: Date | undefined) => {
    if (!date) return;
    try {
      await updateContentPlan(id, { post_date: date.toISOString() });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error updating date",
        description: "There was a problem updating the date."
      });
    }
  };

  const handleFieldChange = async (id: string, field: string, value: any) => {
    try {
      const updates: any = { [field]: value };
      
      // Add timestamp when certain fields are updated
      if (field === 'status' && value === 'Butuh Di Review') {
        updates.completion_date = new Date().toISOString();
      }
      
      if (field === 'production_status' && value === 'Butuh Di Review') {
        updates.production_completion_date = new Date().toISOString();
      }

      if (field === 'production_approved' && value === true) {
        updates.production_approved_date = new Date().toISOString();
      }

      if (field === 'done' && value === true) {
        updates.actual_post_date = new Date().toISOString();
      }
      
      await updateContentPlan(id, updates);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error updating field",
        description: "There was a problem updating the field."
      });
    }
  };

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

  const handleBriefSubmit = async (content: string) => {
    if (!activeItemId) return;
    try {
      await updateContentPlan(activeItemId, { brief: content });
      setBriefDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error updating brief",
        description: "There was a problem updating the brief."
      });
    }
  };

  const handleTitleSubmit = async (content: string) => {
    if (!activeItemId) return;
    try {
      await updateContentPlan(activeItemId, { title: content });
      setTitleDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error updating title",
        description: "There was a problem updating the title."
      });
    }
  };

  const extractLink = (text: string | null): string | null => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    
    return matches ? matches[0] : null;
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading content plan: {error.message}</p>
      </div>
    );
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
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedItems.length} item(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Brief Dialog */}
      <BriefDialog
        open={briefDialogOpen}
        onClose={() => setBriefDialogOpen(false)}
        content={activeItemContent}
        onSubmit={handleBriefSubmit}
      />

      {/* Title Dialog */}
      <TitleDialog
        open={titleDialogOpen}
        onClose={() => setTitleDialogOpen(false)}
        content={activeItemContent}
        onSubmit={handleTitleSubmit}
      />
    </div>
  );
}
