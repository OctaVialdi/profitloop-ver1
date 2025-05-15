
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

// Assuming these functions exist with these names in contentPlanApi.ts
// If they have different names, adjust the imports accordingly
import { 
  addContentPlanItem as createContentPlanItem,
  updateContentPlanItem, 
  deleteContentPlanItem 
} from '../contentPlanApi';

export const useMutateContentPlan = () => {
  const queryClient = useQueryClient();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => createContentPlanItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans'] });
      toast({
        title: "Content Plan Created",
        description: "Your content plan has been created successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create content plan",
        variant: "destructive"
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateContentPlanItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans'] });
      toast({
        title: "Content Plan Updated",
        description: "Your content plan has been updated successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update content plan",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContentPlanItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPlans'] });
      toast({
        title: "Content Plan Deleted",
        description: "Your content plan has been deleted successfully!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete content plan",
        variant: "destructive"
      });
    }
  });

  // These functions wrap the mutations to provide a simpler interface
  const addContentPlan = (data: any) => createMutation.mutateAsync(data);
  const updateContentPlan = (data: any) => updateMutation.mutateAsync(data);
  const deleteContentPlan = (id: string) => deleteMutation.mutateAsync(id);
  const resetRevisionCounter = (data: any) => updateMutation.mutateAsync({ ...data, revision_count: 0 });

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
