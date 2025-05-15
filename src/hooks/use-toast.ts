
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";
import type { Toast } from "@/components/ui/toast";

// For compatibility with both toast systems
export function useToast() {
  return useShadcnToast();
}

export const toast = sonnerToast;

// Re-export the Toast type for components that need it
export type { Toast };
