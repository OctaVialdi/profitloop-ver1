
import { toast as sonnerToast } from "sonner";
import type { ToastActionElement } from "@/components/ui/toast";
import React from "react";

// For compatibility with both toast systems
export function useToast() {
  // This returns an object with a toast function that has the same signature as the Sonner toast
  return {
    toast: (message: string, options?: any) => {
      if (options?.variant === "destructive") {
        return sonnerToast.error(options.description || message, {
          id: options?.id,
          action: options?.action,
        });
      }
      return sonnerToast(message, {
        description: options?.description,
        id: options?.id,
        action: options?.action,
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
