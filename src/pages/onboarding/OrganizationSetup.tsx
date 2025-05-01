
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import OrganizationForm from "@/components/onboarding/OrganizationForm";
import { OrganizationFormData } from "@/types/onboarding";
import { createOrganization } from "@/services/onboardingService";
import { supabase } from "@/integrations/supabase/client";
import { hardLogout, validateUserProfile } from "@/utils/authUtils";

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

  // Check authentication status and existing organization on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to login");
          setIsAuthenticated(false);
          toast.error("Anda belum login. Silakan login terlebih dahulu.");
          navigate("/auth/login");
          return;
        } 
        
        console.log("User is authenticated:", session.user.id);
        setIsAuthenticated(true);
        
        // Validate user profile
        const { valid, profile } = await validateUserProfile(session.user.id);
        
        if (!valid) {
          console.log("Invalid or incomplete profile, user can continue with organization setup");
          
          // Check if there's a race condition (auth session exists but profile doesn't)
          // This could happen if auth.users exists but profiles doesn't
          if (!profile) {
            console.log("Profile not found, checking if it needs to be recreated");
            
            // Check if the profile exists at all
            const { data: profileCheck, error: profileCheckError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileCheckError || !profileCheck) {
              console.error("Profile doesn't exist, possible data inconsistency");
              toast.error("Terjadi ketidaksesuaian data. Mohon login kembali.");
              await hardLogout();
              navigate("/auth/login");
              return;
            }
          }
        } else if (profile?.organization_id) {
          console.log("User already has an organization:", profile.organization_id);
          toast.info("Anda sudah memiliki organisasi.");
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Terjadi kesalahan saat memeriksa autentikasi.");
        setIsAuthenticated(false);
        navigate("/auth/login");
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
    
    try {
      // Show loading toast
      toast.loading("Sedang membuat organisasi...");
      
      console.log("Submitting organization data:", formData);
      const result = await createOrganization(formData);
      
      // Dismiss the loading toast
      toast.dismiss();
      
      if (result) {
        toast.success("Organisasi berhasil dibuat!");
        // Explicitly redirect to welcome page after success
        navigate("/welcome");
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
