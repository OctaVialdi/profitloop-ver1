
import { toast } from "@/components/ui/sonner";
import { OrganizationFormData } from "@/types/onboarding";

/**
 * Validates the organization form data
 */
export const validateOrganizationForm = (formData: OrganizationFormData): boolean => {
  if (!formData.name.trim()) {
    toast.error("Nama organisasi wajib diisi");
    return false;
  }
  return true;
};
