
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";

// Assuming these functions exist with these names in contentPlanApi.ts
// If they have different names, adjust the imports accordingly
import { 
  addContentPlanItem as createContentPlan,
  updateContentPlanItem as updateContentPlan, 
  deleteContentPlanItem as deleteContentPlan 
} from '../contentPlanApi';

export const useMutateContentPlan = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createContentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans'] });
      toast("Content Plan Created", {
        description: "Your content plan has been created successfully!"
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create content plan");
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateContentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans'] });
      toast("Content Plan Updated", {
        description: "Your content plan has been updated successfully!"
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update content plan");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans'] });
      toast("Content Plan Deleted", {
        description: "Your content plan has been deleted successfully!"
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete content plan");
    }
  });

  // These functions wrap the mutations to provide a simpler interface
  const addContentPlan = (data: any) => createMutation.mutateAsync(data);
  const updateContentPlan = (id: string, updates: any) => updateMutation.mutateAsync({ id, ...updates });
  const deleteContentPlan = (id: string) => deleteMutation.mutateAsync(id);
  const resetRevisionCounter = (id: string) => updateMutation.mutateAsync({ id, revision_count: 0 });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    // Add these to expose them for components to use
    addContentPlan,
    updateContentPlan,
    deleteContentPlan,
    resetRevisionCounter
  };
};
