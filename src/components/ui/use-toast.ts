
import { toast as sonnerToast } from "sonner";
import type { ToastActionElement } from "@/components/ui/toast";
import React from "react";
import type { ExternalToast } from "sonner";

// For compatibility with both toast systems
export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
    toasts: []
  };
}

// Export the sonner toast directly for function-style usage
export const toast = sonnerToast;

// Define the Toast type for object-style usage
export type Toast = ExternalToast & {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};
