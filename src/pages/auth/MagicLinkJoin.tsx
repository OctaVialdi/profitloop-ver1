
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MagicLinkJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");
  
  // Extract token and email from URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setError("Token dan email diperlukan");
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Validating magic link token:", token, "for email:", email);
        
        // Check if user is already signed in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is signed in, process the invitation directly
          await processInvitation(session.user.id);
        } else {
          // Validate the token only
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Error validating token:", error);
        setError(error.message || "Token tidak valid");
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, [token, email]);
  
  const processInvitation = async (userId: string) => {
    try {
      // Process the invitation
      const { data: result, error: processError } = await supabase
        .rpc('process_magic_link_invitation', {
          invitation_token: token,
          user_id: userId
        });
      
      console.log("Process invitation result:", result);
      console.log("Process invitation error:", processError);
      
      if (processError) {
        throw processError;
      }
      
      if (!result || !result.success) {
        throw new Error(result?.message || "Gagal memproses undangan");
      }
      
      // Get organization name
      if (result.organization_id) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', result.organization_id)
          .single();
          
        if (orgData) {
          setOrgName(orgData.name);
          setRole(result.role || 'employee');
        }
      }
      
      setSuccess(true);
      setIsLoading(false);
      
      // Refresh user metadata to reflect new organization
      await supabase.auth.refreshSession();
      
    } catch (error: any) {
      console.error("Error processing invitation:", error);
      setError(error.message || "Gagal memproses undangan");
      setIsLoading(false);
    }
  };

  const handleJoinOrganization = async () => {
    setIsProcessing(true);
    
    try {
      // Check if the user exists
      const { data: authData } = await supabase.auth.signInWithOtp({
        email: email || '',
        options: {
          // This will create a new user if they don't exist
          shouldCreateUser: true
        }
      });
      
      if (authData) {
        // Email sent successfully, now show the user instructions
        toast.success("Email verifikasi telah dikirim, silakan cek kotak masuk email Anda");
        navigate('/auth/verification-sent', { 
          state: { 
            email,
            isInvitation: true,
            magicLinkToken: token
          } 
        });
      }
    } catch (error: any) {
      console.error("Error sending magic link email:", error);
      toast.error(error.message || "Gagal mengirim email magic link");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2">Memverifikasi undangan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-center">Undangan Tidak Valid</CardTitle>
            <CardDescription className="text-center">
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/auth/login">Kembali ke Halaman Login</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render success state (user already processed the invitation)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Berhasil Bergabung!</CardTitle>
            <CardDescription className="text-center">
              Anda telah berhasil bergabung dengan organisasi {orgName} sebagai {role === 'admin' ? 'Admin' : 'Karyawan'}.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={handleGoToDashboard}>
              Pergi ke Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render join prompt (default state)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Bergabung dengan Organisasi</CardTitle>
          <CardDescription className="text-center">
            Klik tombol di bawah untuk melanjutkan proses bergabung dengan organisasi
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Email: <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Dengan mengklik tombol di bawah, Anda akan menerima email dengan tautan sekali klik untuk masuk
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleJoinOrganization}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Bergabung dengan Organisasi"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MagicLinkJoin;
