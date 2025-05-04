import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Loader2, UserPlus, Home, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EmployeeWelcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<{
    fullName: string;
    organizationName: string;
    role: string;
  }>({
    fullName: "",
    organizationName: "",
    role: "karyawan",
  });

  const organizationNameFromLocation = location.state?.organizationName;
  const roleFromLocation = location.state?.role;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Anda belum login");
          navigate("/auth/login");
          return;
        }

        // Try to get user metadata first (faster and more reliable)
        let fullName = user.user_metadata?.full_name || "";
        let role = user.user_metadata?.role || "karyawan";
        let organizationName = "";
        let hasSeenWelcome = user.user_metadata?.has_seen_welcome || false;
        let organizationId = user.user_metadata?.organization_id;

        // Get organization data if we have an ID
        if (organizationId) {
          try {
            const { data: orgData, error: orgError } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', organizationId)
              .single();
              
            if (!orgError && orgData) {
              organizationName = orgData.name;
            }
          } catch (orgError) {
            console.error("Error fetching organization:", orgError);
          }
        }

        // Fallback to profile data if needed
        if (!fullName || !organizationId || !organizationName) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select(`
                full_name,
                role,
                has_seen_welcome,
                organization_id,
                organizations:organization_id (
                  name
                )
              `)
              .eq('id', user.id)
              .maybeSingle();

            if (!profileError && profileData) {
              if (profileData.full_name) fullName = profileData.full_name;
              if (profileData.role) role = profileData.role;
              if (profileData.has_seen_welcome !== null) hasSeenWelcome = profileData.has_seen_welcome;
              if (profileData.organizations?.name) organizationName = profileData.organizations.name;
              if (profileData.organization_id) organizationId = profileData.organization_id;
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
          }
        }

        // If no organization ID, redirect to organization setup
        if (!organizationId) {
          // Update user metadata to ensure we don't keep redirecting
          try {
            await supabase.auth.updateUser({
              data: { 
                has_created_profile: true 
              }
            });
          } catch (e) {
            console.error("Failed to update user metadata:", e);
          }
          
          toast.error("Anda belum tergabung dengan organisasi manapun");
          navigate("/organizations", { replace: true });
          return;
        }

        // If user has already seen welcome page, redirect to dashboard
        if (hasSeenWelcome) {
          navigate("/dashboard", { replace: true });
          return;
        }

        // Set user data
        setUserData({
          fullName: fullName || user.email?.split('@')[0] || "",
          organizationName: organizationName || organizationNameFromLocation || "Organisasi",
          role: role || roleFromLocation || "karyawan",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal memuat data pengguna");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, organizationNameFromLocation, roleFromLocation]);

  const markWelcomeAsSeen = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Sesi login tidak ditemukan");
        return;
      }
      
      // Mark welcome page as seen
      const { error } = await supabase
        .from('profiles')
        .update({ has_seen_welcome: true })
        .eq('id', user.id);
        
      if (error) {
        // If update fails, try to update auth metadata as fallback
        await supabase.auth.updateUser({
          data: { has_seen_welcome: true }
        });
      }
      
      // Navigate to dashboard
      toast.success("Selamat datang di dashboard!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error marking welcome page as seen:", error);
      toast.error("Terjadi kesalahan, mohon coba lagi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2">Memuat data pengguna...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Selamat Bergabung, {userData.fullName}!
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Anda kini bagian dari organisasi
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold">{userData.organizationName}</span>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-lg mb-1">Peran Anda:</p>
            <p className="text-xl font-semibold capitalize">{userData.role}</p>
          </div>
          
          <div className="py-4">
            <p className="text-gray-600">
              Selamat datang di platform kami. Anda kini memiliki akses ke sistem kami
              sebagai anggota tim {userData.organizationName}.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            className="w-full max-w-xs" 
            onClick={markWelcomeAsSeen} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Home className="mr-2 h-4 w-4" />
                Mulai Menggunakan Aplikasi
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeWelcome;
