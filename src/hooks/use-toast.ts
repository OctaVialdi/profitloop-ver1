
import { toast as sonnerToast } from "sonner";
import type { ToastActionElement } from "@/components/ui/toast";
import React from "react";

// For compatibility with both toast systems
export function useToast() {
  // This returns an object with a toast function that has the same signature as the Sonner toast
  return {
    toast: (props: Toast) => {
      if (props.variant === "destructive") {
        return sonnerToast.error(props.description as string, {
          id: props.id,
          action: props.action as any,
        });
      }
      return sonnerToast(props.title as string, {
        description: props.description,
        id: props.id,
        action: props.action as any,
      });
    },
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    toasts: []
  };
}

// Export the sonner toast directly for function-style usage
export const toast = sonnerToast;

// Define the Toast type for object-style usage
export type Toast = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};
