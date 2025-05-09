
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  // Only set justVerified to true if the URL parameter explicitly says so
  // and we're coming from a verification flow
  const [justVerified, setJustVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we have invitation data from redirect
  const invitationEmail = location.state?.invitationEmail || "";
  const invitationToken = location.state?.invitationToken || "";
  
  // Check if we're coming from verification page
  const verifiedEmail = location.state?.verifiedEmail || "";
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    loginError,
    isEmailUnverified,
    resendingVerification,
    handleResendVerification,
    handleLogin
  } = useLoginForm();

  // If we have invitation email, use it
  useEffect(() => {
    if (invitationEmail) {
      setEmail(invitationEmail);
    } else if (verifiedEmail) {
      setEmail(verifiedEmail);
    }
  }, [invitationEmail, verifiedEmail, setEmail]);

  // Check URL parameters for verification status - 
  // ONLY trust the verified=true param if it's explicitly set
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('verified') === 'true';
    
    if (verified) {
      setJustVerified(true);
    }
  }, [location.search]);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/organizations");
      }
    };
    
    checkSession();
  }, [navigate]);

  // Add debugging log
  console.log("Login component rendered. Current URL:", window.location.href);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Masukkan email dan password Anda untuk mengakses aplikasi
            {invitationEmail && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700 text-sm">
                Anda akan bergabung dengan organisasi setelah login dengan email ini
              </div>
            )}
          </CardDescription>
          
          {/* Only show this verified message when explicitly set by a proper verification */}
          {justVerified && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-green-800">Email berhasil diverifikasi</p>
                <p className="text-sm text-green-700">Silakan login untuk melanjutkan</p>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            loginError={loginError}
            isEmailUnverified={isEmailUnverified}
            resendingVerification={resendingVerification}
            onResendVerification={handleResendVerification}
            onSubmit={handleLogin}
            isEmailReadOnly={!!invitationEmail}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Belum memiliki akun?{" "}
            {/* PURE HTML link - most reliable for cross-page navigation */}
            <a 
              href="/auth/register" 
              className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
              onClick={(e) => {
                console.log("Register link clicked");
              }}
            >
              Daftar sekarang
            </a>
          </div>
          
          {/* Pure HTML anchor for register - using href with hash to ensure browser navigation */}
          <a 
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
            onClick={(e) => {
              console.log("Register button clicked");
            }}
          >
            Buat akun baru
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
