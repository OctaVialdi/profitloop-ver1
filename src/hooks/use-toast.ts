
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/toast";
import type { ToastActionElement } from "@/components/ui/toast";

// For compatibility with both toast systems
export function useToast() {
  return useShadcnToast();
}

export const toast = sonnerToast;

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};
