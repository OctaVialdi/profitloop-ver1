
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase, forceSignIn } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [isManuallyVerified, setIsManuallyVerified] = useState(false);
  const [loginRetries, setLoginRetries] = useState(0);
  const [justVerified, setJustVerified] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have invitation data from redirect
  const invitationEmail = location.state?.invitationEmail || "";
  const invitationToken = location.state?.invitationToken || "";
  
  // Check if we're coming from verification page with auto-login
  const verifiedEmail = location.state?.verifiedEmail || "";
  const autoLoginPassword = location.state?.password || "";
  const isAttemptingVerification = location.state?.isAttemptingVerification || false;

  // If we have invitation email, use it
  useEffect(() => {
    if (invitationEmail) {
      setEmail(invitationEmail);
    } else if (verifiedEmail) {
      setEmail(verifiedEmail);
      if (autoLoginPassword) {
        setPassword(autoLoginPassword);
      }
    }
  }, [invitationEmail, verifiedEmail, autoLoginPassword]);

  // Check URL parameters for verification status
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('verified') === 'true';
    
    if (verified) {
      setIsManuallyVerified(true);
      setJustVerified(true);
      toast.success("Email berhasil diverifikasi. Silakan login.");
      
      // If we have email and password from verification page, try to auto-login
      if (verifiedEmail && autoLoginPassword && isAttemptingVerification) {
        // Attempt auto-login with short delay to ensure verification has propagated
        setTimeout(() => {
          handleAutoLogin(verifiedEmail, autoLoginPassword);
        }, 1500);
      }
    }
  }, [location.search, verifiedEmail, autoLoginPassword, isAttemptingVerification]);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleAutoLogin = async (email: string, password: string) => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
      
      const { data, error } = await forceSignIn(email, password);
      
      if (error) {
        if (error.message === "Email not confirmed" || error.message.includes("not confirmed")) {
          // Still not verified in the system - show manual login option
          setLoginError("Email masih dalam proses verifikasi. Coba login secara manual dalam beberapa menit.");
          return;
        }
        throw error;
      }
      
      if (data?.user) {
        toast.success("Login berhasil!");
        handleSuccessfulLogin(data.user);
      }
    } catch (error: any) {
      console.error("Auto-login error:", error);
      // Silent fail for auto-login, just let the user log in manually
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email tidak boleh kosong");
      return;
    }
    
    setResendingVerification(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast.success("Email verifikasi berhasil dikirim ulang. Silakan cek kotak masuk email Anda.");
      navigate("/auth/verification-sent", { 
        state: { 
          email,
          password, // Pass password for auto-login after verification
          ...(invitationToken && { isInvitation: true, invitationToken })
        }
      });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Gagal mengirim ulang email verifikasi.");
    } finally {
      setResendingVerification(false);
    }
  };

  // Helper function to add delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const manualVerifyEmailAndLogin = async () => {
    try {
      // Try multiple sign-in attempts with increasing delays
      for (let attempt = 0; attempt < 3; attempt++) {
        await delay((attempt + 1) * 1000); // 1s, 2s, 3s delays
        
        const { data, error } = await forceSignIn(email, password);
        
        if (!error && data?.user) {
          toast.success("Login berhasil!");
          handleSuccessfulLogin(data.user);
          return true;
        }
        
        // If still getting "not confirmed" error on final attempt, break loop
        if (attempt === 2 && error?.message?.includes("not confirmed")) {
          break;
        }
      }

      return false;
    } catch (error) {
      console.error("Manual verification failed:", error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setIsEmailUnverified(false);
    setDebugInfo(null);
    
    console.log("Attempting login with email:", email);
    
    try {
      // Try using our force sign in helper first
      const { data, error } = await forceSignIn(email, password);

      // Store debug information for any errors
      if (error) {
        const errorStatus = (error as AuthError)?.status || 'unknown';
        setDebugInfo({
          errorCode: errorStatus,
          errorName: error.name || 'Error',
          errorMessage: error.message
        });
        console.error("Login error details:", error);
      }

      if (error) {
        // Handle email verification error
        if (error.message === "Email not confirmed" || error.message.includes("not confirmed")) {
          setIsEmailUnverified(true);
          
          console.log("Email verification required. Current state:", { 
            isManuallyVerified, 
            justVerified,
            loginRetries
          });
          
          // If flag manual verified active or we're retrying, try again with delay
          if (isManuallyVerified || justVerified || loginRetries >= 1) {
            toast.loading("Mencoba memverifikasi email...");
            await delay(1500);
            const success = await manualVerifyEmailAndLogin();
            
            if (success) {
              return;
            }
          }
          
          setLoginRetries(prev => prev + 1);
          throw new Error("Email belum dikonfirmasi. Silakan verifikasi email Anda terlebih dahulu.");
        }
        throw error;
      }
      
      if (data?.user) {
        toast.success("Login berhasil!");
        handleSuccessfulLogin(data.user);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Improved error handling
      if (error.message === "Database error granting user" || (error as AuthError)?.status === 500) {
        // Database error case - often happens when email is verified but last_sign_in not updated
        if (loginRetries < 3) {
          setLoginRetries(prev => prev + 1);
          
          toast.loading("Mencoba ulang login...");
          
          setTimeout(async () => {
            try {
              const delay = loginRetries * 2000; // 2s, 4s, 6s
              await new Promise(resolve => setTimeout(resolve, delay));
              
              const { data: retryData, error: retryError } = await forceSignIn(email, password);
              
              if (!retryError && retryData?.user) {
                setIsLoading(false);
                toast.success("Login berhasil!");
                handleSuccessfulLogin(retryData.user);
                return;
              }
            } catch (retryErr) {
              console.error("Retry login failed:", retryErr);
            }
            
            setIsLoading(false);
            setLoginError("Server sedang mengalami masalah. Silakan coba lagi dalam beberapa saat.");
          }, 500);
          return;
        } else {
          setLoginError("Server sedang mengalami masalah. Silakan coba lagi dalam beberapa saat atau hubungi dukungan teknis.");
        }
      } else if (error.message.includes("Invalid login credentials")) {
        setLoginError("Email atau password salah. Mohon periksa kembali.");
      } else if (error.message.includes("Email not confirmed") || error.message.includes("Email belum dikonfirmasi")) {
        setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
        setIsEmailUnverified(true);
      } else {
        setLoginError(error.message || "Gagal login. Periksa email dan password Anda.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const bypassEmailVerificationLogin = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Force a login attempt by first checking the user exists
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      console.log("Attempting bypass login...");
      
      if (userError) {
        throw userError;
      }
      
      // Now try signing in directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success("Login berhasil!");
        handleSuccessfulLogin(data.user);
      }
    } catch (error: any) {
      console.error("Bypass login error:", error);
      setLoginError("Gagal login bypass: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async (user: any) => {
    // If we have invitation token, join organization after login
    if (invitationToken) {
      try {
        const { data: joinResult, error: joinError } = await supabase
          .rpc('join_organization', { 
            user_id: user.id, 
            invitation_token: invitationToken 
          });
        
        if (joinError) {
          throw joinError;
        }
        
        if (!joinResult || !Array.isArray(joinResult) || joinResult.length === 0) {
          throw new Error("Format respons tidak valid");
        }
        
        if (!joinResult[0].success) {
          throw new Error(joinResult[0].message || "Gagal bergabung dengan organisasi");
        }
        
        toast.success("Berhasil bergabung dengan organisasi!");
        navigate("/employee-welcome");
        return;
      } catch (joinErr: any) {
        console.error("Error joining organization:", joinErr);
        toast.error(joinErr.message || "Gagal bergabung dengan organisasi");
        // Still allow login but without joining organization
      }
    }
    
    // Normal login flow - check if user has organization
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData && profileData.organization_id) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Default to dashboard if we can't determine organization status
      navigate("/dashboard");
    }
  };

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
          {debugInfo && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-md text-xs text-gray-800 font-mono">
              <p>Error Code: {debugInfo.errorCode}</p>
              <p>Error Type: {debugInfo.errorName}</p>
              <p>Message: {debugInfo.errorMessage}</p>
              <p className="mt-2 text-blue-600">Email confirmation is disabled in Supabase</p>
            </div>
          )}
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          {isEmailUnverified && (
            <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Email belum diverifikasi</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Anda perlu memverifikasi email sebelum bisa login. Silakan cek kotak masuk email Anda.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                      onClick={handleResendVerification}
                      disabled={resendingVerification}
                    >
                      {resendingVerification ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        'Kirim Ulang Email Verifikasi'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!invitationEmail}
                className={invitationEmail ? "bg-gray-100" : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                  Lupa password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Belum memiliki akun?{" "}
            <Link to="/auth/register" className="text-blue-500 hover:text-blue-700">
              Daftar sekarang
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
