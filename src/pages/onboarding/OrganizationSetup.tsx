
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          toast.error("Anda belum login. Silakan login terlebih dahulu.");
          navigate("/auth/login");
        } else {
          console.log("User is authenticated:", session.user.id);
          setIsAuthenticated(true);
          
          // Check if user already has an organization
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('organization_id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileData?.organization_id) {
              console.log("User already has an organization:", profileData.organization_id);
              toast.info("Anda sudah memiliki organisasi.");
              navigate("/welcome");
            }
          } catch (error) {
            console.error("Error checking profile:", error);
            // Continue with organization setup even if profile check fails
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Terjadi kesalahan saat memeriksa autentikasi.");
        setIsAuthenticated(false);
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
    
    if (!isAuthenticated) {
      toast.error("Anda belum login. Silakan login terlebih dahulu.");
      navigate("/auth/login");
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    toast.loading("Sedang membuat organisasi...");
    
    try {
      console.log("Submitting organization data:", formData);
      await createOrganization(formData);
      toast.dismiss();
      toast.success("Organisasi berhasil dibuat!");
      navigate("/welcome");
    } catch (error: any) {
      console.error("Organization setup error:", error);
      toast.dismiss();
      toast.error(error.message || "Gagal membuat organisasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null) {
    // Still checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <div className="text-center">
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

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
