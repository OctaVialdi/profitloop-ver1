
import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";

export function useContentPlanMutations(
  addContentPlan: (data: any) => Promise<any>,
  updateContentPlan: (id: string, updates: any) => Promise<boolean>,
  deleteContentPlan: (id: string) => Promise<boolean>
) {
  const handleAddRow = useCallback(async () => {
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
      toast("Row added successfully", {
        description: "A new row has been added to the content plan."
      });
    } catch (err) {
      console.error(err);
      toast("Error adding row", {
        description: "There was a problem adding a new row."
      });
    }
  }, [addContentPlan]);

  const handleDeleteSelected = useCallback(async (selectedItems: string[]) => {
    try {
      const deletePromises = selectedItems.map(id => deleteContentPlan(id));
      await Promise.all(deletePromises);
      toast("Items deleted", {
        description: `${selectedItems.length} item(s) have been deleted.`
      });
      return true;
    } catch (err) {
      console.error(err);
      toast("Error deleting items", {
        description: "There was a problem deleting the selected items."
      });
      return false;
    }
  }, [deleteContentPlan]);

  const handleDateChange = useCallback(async (id: string, date: Date | undefined) => {
    if (!date) return;
    try {
      await updateContentPlan(id, { post_date: date.toISOString() });
    } catch (err) {
      console.error(err);
      toast("Error updating date", {
        description: "There was a problem updating the date."
      });
    }
  }, [updateContentPlan]);

  const handleFieldChange = useCallback(async (id: string, field: string, value: any) => {
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
      toast("Error updating field", {
        description: "There was a problem updating the field."
      });
    }
  }, [updateContentPlan]);

  const handleBriefSubmit = useCallback(async (id: string, content: string) => {
    if (!id) return false;
    try {
      await updateContentPlan(id, { brief: content });
      return true;
    } catch (err) {
      console.error(err);
      toast("Error updating brief", {
        description: "There was a problem updating the brief."
      });
      return false;
    }
  }, [updateContentPlan]);

  const handleTitleSubmit = useCallback(async (id: string, content: string) => {
    if (!id) return false;
    try {
      await updateContentPlan(id, { title: content });
      return true;
    } catch (err) {
      console.error(err);
      toast("Error updating title", {
        description: "There was a problem updating the title."
      });
      return false;
    }
  }, [updateContentPlan]);

  return {
    handleAddRow,
    handleDeleteSelected,
    handleDateChange,
    handleFieldChange,
    handleBriefSubmit,
    handleTitleSubmit
  };
}
