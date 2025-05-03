
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const MagicLinkJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const errorCode = searchParams.get("error_code") || new URLSearchParams(window.location.hash.substring(1)).get("error_code");
  const errorDescription = searchParams.get("error_description") || new URLSearchParams(window.location.hash.substring(1)).get("error_description");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [organizationName, setOrganizationName] = useState<string>("");

  // Function to handle manual login with token
  const handleLoginAndJoin = async () => {
    if (!email || !token) {
      toast.error("Email atau token tidak valid");
      return;
    }

    setIsLoading(true);
    navigate("/auth/login", { 
      state: { 
        email,
        magicLinkToken: token 
      }
    });
  };

  useEffect(() => {
    // Log useful debugging information
    console.log("MagicLinkJoin component mounted");
    console.log("URL parameters:", { token, email, errorCode, errorDescription });
    console.log("Full URL:", window.location.href);
    console.log("Hash:", window.location.hash);
    
    const processInvitation = async () => {
      // Check if there's an error in the URL (from Supabase redirect)
      if (errorCode || errorDescription || window.location.hash.includes('error=access_denied')) {
        console.error("Error from Supabase auth:", errorCode, errorDescription);
        setError(errorDescription?.replace(/\+/g, ' ') || "Link undangan tidak valid atau sudah kadaluarsa");
        setIsLoading(false);
        return;
      }

      if (!token) {
        setError("Token undangan tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Jika pengguna belum login, redirect ke halaman login dengan token
          navigate("/auth/login", { 
            state: { 
              email,
              magicLinkToken: token 
            }
          });
          return;
        }

        // Verifikasi token dan bergabung dengan organisasi
        const { data, error: joinError } = await supabase.rpc(
          'process_magic_link_invitation',
          { 
            invitation_token: token,
            user_id: user.id
          }
        );

        if (joinError) {
          console.error("Error processing invitation:", joinError);
          setError(joinError.message || "Gagal memproses undangan");
          setIsLoading(false);
          return;
        }

        // Handle respon sebagai objek JSON
        const result = data as { success: boolean, message: string, organization_id?: string };

        if (!result.success) {
          setError(result.message || "Token undangan tidak valid atau sudah kadaluarsa");
          setIsLoading(false);
          return;
        }

        // Ambil data organisasi jika bergabung berhasil
        if (result.organization_id) {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', result.organization_id)
            .single();

          if (orgData) {
            setOrganizationName(orgData.name);
          }
        }

        toast.success("Berhasil bergabung dengan organisasi!");
        setSuccess(true);
        setIsLoading(false);
        
        // Delay sebelum redirect ke halaman welcome
        setTimeout(() => {
          navigate("/employee-welcome", { 
            state: { 
              organizationName,
              role: (data as any).role || "employee" 
            }
          });
        }, 2000);

      } catch (error: any) {
        console.error("Unexpected error:", error);
        setError(error.message || "Terjadi kesalahan saat memproses undangan");
        setIsLoading(false);
      }
    };

    processInvitation();
  }, [token, navigate, organizationName, email, errorCode, errorDescription]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <CardDescription className="text-center">
              Sedang memproses undangan Anda...
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-center">
            Undangan Tidak Valid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">{error}</p>
          {email && token && (
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm text-gray-500">
                Link telah kadaluarsa. Anda masih dapat bergabung dengan login terlebih dahulu.
              </p>
              <Button onClick={handleLoginAndJoin} className="w-full">
                Login untuk Bergabung
              </Button>
              <div className="text-center">
                <span className="text-sm text-gray-500">atau</span>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/auth/login")} variant="outline">
              Kembali ke Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-center">
            Bergabung Berhasil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-2">
            Anda telah berhasil bergabung dengan{" "}
            <span className="font-semibold">{organizationName}</span>
          </p>
          <p className="text-center text-gray-600 text-sm mb-6">
            Mengalihkan Anda ke halaman selamat datang...
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default MagicLinkJoin;
