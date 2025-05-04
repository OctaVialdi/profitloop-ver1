
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
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  // Check authentication status and existing organization once on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Not authenticated, redirecting to login");
          toast.error("Anda belum login. Silakan login terlebih dahulu.");
          navigate("/auth/login", { replace: true });
          return;
        } 
        
        console.log("User is authenticated:", session.user.id);
        
        // Check if user already has an organization, either in their profile or created by them
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

        // Also check if this email has already created an organization
        const userEmail = session.user.email?.toLowerCase();
        if (userEmail) {
          try {
            const { data: orgCreatorData, error: orgCreatorError } = await supabase
              .from('organizations')
              .select('id')
              .eq('creator_email', userEmail)
              .maybeSingle();
            
            if (orgCreatorError) {
              console.error("Error checking if email has created organization:", orgCreatorError);
            } else if (orgCreatorData) {
              console.log("This email has already created an organization:", orgCreatorData.id);
              
              // If user has created an org but profile doesn't have org_id, update the profile
              if (!profileData?.organization_id) {
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ 
                    organization_id: orgCreatorData.id,
                    role: 'super_admin'
                  })
                  .eq('id', session.user.id);
                
                if (updateError) {
                  console.error("Error updating profile with organization:", updateError);
                } else {
                  console.log("Profile updated with existing organization");
                }
              }
              
              toast.info("Email ini sudah digunakan untuk membuat organisasi.");
              navigate("/dashboard", { replace: true });
              return;
            }
          } catch (error) {
            console.error("Error checking organization by email:", error);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast.error("Terjadi kesalahan saat memeriksa autentikasi.");
        navigate("/auth/login", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  function handleChange(field: keyof OrganizationFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function validateForm() {
    if (!formData.name.trim()) {
      toast.error("Nama organisasi wajib diisi");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Sedang membuat organisasi...");
      
      // Get current user's email
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.dismiss(loadingToastId);
        toast.error("Sesi tidak ditemukan. Silakan login kembali.");
        navigate("/auth/login", { replace: true });
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
          await supabase
            .from('profiles')
            .update({ 
              organization_id: (result as any).id,
              role: 'super_admin'
            })
            .eq('id', session.user.id);
        }
        
        // Add a small delay before redirecting and only do it once
        setTimeout(() => {
          navigate("/employee-welcome", { replace: true });
        }, 500);
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
  }

  function handleChange(field: keyof OrganizationFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function validateForm() {
    if (!formData.name.trim()) {
      toast.error("Nama organisasi wajib diisi");
      return false;
    }
    return true;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Memeriksa status autentikasi...</p>
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
