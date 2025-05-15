
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useOrganization } from '@/hooks/useOrganization';
import { ContentPlanItem } from '../types';
import { 
  addContentPlanItem,
  updateContentPlanItem,
  deleteContentPlanItem
} from '../contentPlanApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface MutateContentPlanReturn {
  addContentPlan: (newPlan: Partial<ContentPlanItem>) => Promise<any>;
  updateContentPlan: (id: string, updates: Partial<ContentPlanItem>) => Promise<boolean>;
  deleteContentPlan: (id: string) => Promise<boolean>;
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
}

export function useMutateContentPlan(): MutateContentPlanReturn {
  const { toast } = useToast();
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  // Add content plan mutation
  const addMutation = useMutation({
    mutationFn: async (newPlan: Partial<ContentPlanItem>) => {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      return addContentPlanItem(newPlan, organization.id);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content plan added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['contentPlans', organization?.id] });
    },
    onError: (err: any) => {
      console.error('Error adding content plan:', err);
      toast({
        title: "Error",
        description: `Failed to add content plan: ${err.message}`,
        variant: "destructive",
      });
    }
  });

  // Update content plan mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ContentPlanItem> }) => {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      return updateContentPlanItem(id, updates, organization.id);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content plan updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['contentPlans', organization?.id] });
    },
    onError: (err: any) => {
      console.error('Error updating content plan:', err);
      toast({
        title: "Error",
        description: `Failed to update content plan: ${err.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete content plan mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!organization?.id) {
        throw new Error('No organization ID available');
      }
      return deleteContentPlanItem(id, organization.id);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content plan deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['contentPlans', organization?.id] });
    },
    onError: (err: any) => {
      console.error('Error deleting content plan:', err);
      toast({
        title: "Error",
        description: `Failed to delete content plan: ${err.message}`,
        variant: "destructive",
      });
    }
  });

  const addContentPlan = async (newPlan: Partial<ContentPlanItem>) => {
    try {
      return await addMutation.mutateAsync(newPlan);
    } catch (err) {
      return null;
    }
  };

  const updateContentPlan = async (id: string, updates: Partial<ContentPlanItem>) => {
    try {
      await updateMutation.mutateAsync({ id, updates });
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteContentPlan = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (err) {
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
