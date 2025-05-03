import { useState, useEffect } from "react";
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

  // Check authentication status and existing organization on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Not authenticated, redirecting to login");
          toast.error("Anda belum login. Silakan login terlebih dahulu.");
          navigate("/auth/login", { replace: true });
          return;
        } 
        
        console.log("User is authenticated:", session.user.id);
        
        // Check if user already has an organization
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // Continue with organization setup even if profile check fails
        } else if (profileData?.organization_id) {
          console.log("User already has an organization:", profileData.organization_id);
          toast.info("Anda sudah memiliki organisasi.");
          navigate("/dashboard", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Terjadi kesalahan saat memeriksa autentikasi.");
        navigate("/auth/login", { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Nama organisasi wajib diisi");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show loading toast
      toast.loading("Sedang membuat organisasi...");
      
      console.log("Submitting organization data:", formData);
      const result = await createOrganization(formData);
      
      // Dismiss the loading toast
      toast.dismiss();
      
      if (result) {
        toast.success("Organisasi berhasil dibuat!");
        // Explicitly redirect to employee-welcome page after success
        navigate("/employee-welcome");
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
