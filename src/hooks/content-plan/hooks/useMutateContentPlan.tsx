
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from '@/hooks/useOrganization';
import { ContentPlanItem } from '../types';
import { 
  addContentPlanItem,
  updateContentPlanItem,
  deleteContentPlanItem
} from '../contentPlanApi';

export interface MutateContentPlanReturn {
  addContentPlan: (newPlan: Partial<ContentPlanItem>) => Promise<any>;
  updateContentPlan: (id: string, updates: Partial<ContentPlanItem>) => Promise<boolean>;
  deleteContentPlan: (id: string) => Promise<boolean>;
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
}

export function useMutateContentPlan(fetchContentPlans: () => Promise<void>): MutateContentPlanReturn {
  const { toast } = useToast();
  const { organization } = useOrganization();

  const addContentPlan = async (newPlan: Partial<ContentPlanItem>) => {
    try {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      console.log(`Adding content plan for organization: ${organization.id}`, newPlan);
      
      const data = await addContentPlanItem(newPlan, organization.id);
      
      toast({
        title: "Success",
        description: "Content plan added successfully",
      });
      
      console.log(`Content plan added successfully:`, data);
      await fetchContentPlans();
      return data;
    } catch (err: any) {
      console.error('Error adding content plan:', err);
      toast({
        title: "Error",
        description: `Failed to add content plan: ${err.message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContentPlan = async (id: string, updates: Partial<ContentPlanItem>) => {
    try {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      console.log(`Updating content plan ${id} for organization: ${organization.id}`, updates);
      
      await updateContentPlanItem(id, updates, organization.id);
      
      toast({
        title: "Success",
        description: "Content plan updated successfully",
      });
      
      console.log(`Content plan ${id} updated successfully`);
      await fetchContentPlans();
      return true;
    } catch (err: any) {
      console.error('Error updating content plan:', err);
      toast({
        title: "Error",
        description: `Failed to update content plan: ${err.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteContentPlan = async (id: string) => {
    try {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      
      console.log(`Deleting content plan ${id} for organization: ${organization.id}`);
      
      await deleteContentPlanItem(id, organization.id);
      
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      });
      
      console.log(`Content plan ${id} deleted successfully`);
      await fetchContentPlans();
      return true;
    } catch (err: any) {
      console.error('Error deleting content plan:', err);
      toast({
        title: "Error",
        description: `Failed to delete content plan: ${err.message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const resetRevisionCounter = async (id: string, field: 'revision_count' | 'production_revision_count') => {
    return updateContentPlan(id, { [field]: 0 });
  };

  return {
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    resetRevisionCounter
  };
}
