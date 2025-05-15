
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContentPlan, updateContentPlan, deleteContentPlan } from '../contentPlanApi';
import { toast } from "@/hooks/use-toast";

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
      toast("Error", {
        description: error?.message || "Failed to create content plan",
        variant: "destructive"
      });
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
      toast("Error", {
        description: error?.message || "Failed to update content plan",
        variant: "destructive"
      });
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
      toast("Error", {
        description: error?.message || "Failed to delete content plan",
        variant: "destructive"
      });
    }
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
