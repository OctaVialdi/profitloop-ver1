
import { toast as sonnerToast, type Toast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/use-toast"

// For compatibility with both toast systems
export function useToast() {
  return useShadcnToast();
}

export const toast = sonnerToast;
