
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import OrganizationForm from "@/components/onboarding/OrganizationForm";
import { OrganizationFormData } from "@/types/onboarding";
import { createOrganization } from "@/services/onboardingService";
import { supabase } from "@/integrations/supabase/client";

const OrganizationSetup = () => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    businessField: "",
    employeeCount: "",
    address: "",
    phone: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nama organisasi wajib diisi");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if user is authenticated first
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error("Anda belum login. Silakan login terlebih dahulu.");
        navigate("/auth/login");
        return;
      }
      
      await createOrganization(formData);
      toast.success("Organisasi berhasil dibuat!");
      navigate("/welcome");
    } catch (error: any) {
      console.error("Organization setup error:", error);
      toast.error(error.message || "Gagal membuat organisasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <OrganizationForm 
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrganizationSetup;
