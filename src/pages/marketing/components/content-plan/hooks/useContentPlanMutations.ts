
import { toast } from "@/components/ui/use-toast";

export function useContentPlanMutations(
  addContentPlan: (data: any) => Promise<any>,
  updateContentPlan: (id: string, updates: any) => Promise<boolean>,
  deleteContentPlan: (id: string) => Promise<boolean>
) {
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

  const handleDeleteSelected = async (selectedItems: string[]) => {
    try {
      const deletePromises = selectedItems.map(id => deleteContentPlan(id));
      await Promise.all(deletePromises);
      toast({
        title: "Items deleted",
        description: `${selectedItems.length} item(s) have been deleted.`
      });
      return true;
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error deleting items",
        description: "There was a problem deleting the selected items."
      });
      return false;
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

  const handleBriefSubmit = async (id: string, content: string) => {
    if (!id) return;
    try {
      await updateContentPlan(id, { brief: content });
      return true;
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error updating brief",
        description: "There was a problem updating the brief."
      });
      return false;
    }
  };

  const handleTitleSubmit = async (id: string, content: string) => {
    if (!id) return;
    try {
      await updateContentPlan(id, { title: content });
      return true;
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error updating title",
        description: "There was a problem updating the title."
      });
      return false;
    }
  };

  return {
    handleAddRow,
    handleDeleteSelected,
    handleDateChange,
    handleFieldChange,
    handleBriefSubmit,
    handleTitleSubmit
  };
}
