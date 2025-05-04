
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
      
      // Use the security definer RPC function to create organization
      const { data: orgResult, error: orgError } = await supabase
        .rpc('create_organization_with_profile', {
          user_id: session.user.id,
          org_name: formData.name,
          org_business_field: formData.businessField || null,
          org_employee_count: formData.employeeCount ? parseInt(formData.employeeCount) : null,
          org_address: formData.address || null,
          org_phone: formData.phone || null,
          user_role: 'super_admin',
          creator_email: session.user.email?.toLowerCase()
        });
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      if (orgError) {
        console.error("Organization creation error:", orgError);
        toast.error("Gagal membuat organisasi: " + orgError.message);
        return;
      }
      
      if (orgResult) {
        toast.success("Organisasi berhasil dibuat!");
        
        // Fix: Properly handle the returned object by safely accessing the 'id' property
        let organizationId: string | undefined;
        
        if (typeof orgResult === 'object' && orgResult !== null && 'id' in orgResult) {
          organizationId = orgResult.id as string;
        }
        
        if (organizationId) {
          // Update user metadata
          await supabase.auth.updateUser({
            data: {
              organization_id: organizationId,
              role: 'super_admin'
            }
          });
          
          // Redirect to employee welcome
          redirectToEmployeeWelcome();
        } else {
          toast.error("Organisasi berhasil dibuat, namun ID tidak ditemukan.");
        }
      } else {
        toast.error("Gagal membuat organisasi. Terjadi kesalahan tak terduga.");
      }
    } catch (error: any) {
      console.error("Organization setup error:", error);
      toast.dismiss();
      
      // Provide more specific error messages
      if (typeof error === 'object' && error !== null) {
        if (error.message?.includes("violates row-level security policy")) {
          toast.error("Akses ditolak. Coba logout dan login kembali.");
        } else if (error.message?.includes("infinite recursion")) {
          toast.error("Terjadi kesalahan internal. Tim kami sedang memperbaikinya.");
        } else {
          toast.error(error.message || "Gagal membuat organisasi. Silakan coba lagi.");
        }
      } else {
        toast.error("Gagal membuat organisasi. Silakan coba lagi.");
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
