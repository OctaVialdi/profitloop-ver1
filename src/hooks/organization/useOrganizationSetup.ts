
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { OrganizationFormData } from "@/types/onboarding";
import { createOrganization } from "@/services/onboardingService";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationNavigation } from "./useOrganizationNavigation";
import { useOrganizationAuth } from "./useOrganizationAuth";
import { validateOrganizationForm } from "@/utils/formValidation";
import { updateUserWithOrganization } from "@/services/api/organizationApi";

export function useOrganizationSetup() {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    businessField: "",
    employeeCount: "",
    address: "",
    phone: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { isChecking } = useOrganizationAuth();
  const { redirectToEmployeeWelcome } = useOrganizationNavigation();

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOrganizationForm(formData)) return;
    
    setIsLoading(true);
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Sedang membuat organisasi...");
      
      // Get current user's email
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.dismiss(loadingToastId);
        toast.error("Sesi tidak ditemukan. Silakan login kembali.");
        return;
      }
      
      // Add creator email to form data
      const formDataWithCreator = {
        ...formData,
        creator_email: session.user.email?.toLowerCase()
      };
      
      console.log("Submitting organization data:", formDataWithCreator);
      const result = await createOrganization(formDataWithCreator);
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      if (result) {
        toast.success("Organisasi berhasil dibuat!");
        
        // Verify profile has been updated with organization_id
        const { data: profileCheck } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', session.user.id)
          .single();
        
        if (!profileCheck?.organization_id) {
          console.warn("Profile still doesn't have organization_id after creation. Trying one more update...");
          // Try one more time to update profile directly
          await updateUserWithOrganization(session.user.id, (result as any).id);
        }
        
        // Following the specific flowchart - redirect to employee-welcome after org creation
        redirectToEmployeeWelcome();
      } else {
        toast.error("Gagal membuat organisasi. Terjadi kesalahan tak terduga.");
      }
    } catch (error: any) {
      console.error("Organization setup error:", error);
      toast.dismiss();
      
      // Provide more specific error messages
      if (error.message?.includes("violates row-level security policy")) {
        toast.error("Akses ditolak. Coba logout dan login kembali.");
      } else if (error.message?.includes("infinite recursion")) {
        toast.error("Terjadi kesalahan internal. Tim kami sedang memperbaikinya.");
      } else {
        toast.error(error.message || "Gagal membuat organisasi. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    isChecking
  };
}
