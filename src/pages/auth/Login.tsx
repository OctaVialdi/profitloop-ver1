
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [isManuallyVerified, setIsManuallyVerified] = useState(false);
  const [loginRetries, setLoginRetries] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have invitation data from redirect
  const invitationEmail = location.state?.invitationEmail || "";
  const invitationToken = location.state?.invitationToken || "";

  // If we have invitation email, use it
  useEffect(() => {
    if (invitationEmail) {
      setEmail(invitationEmail);
    }
  }, [invitationEmail]);

  // Check URL parameters for verification status
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('verified') === 'true';
    
    if (verified) {
      setIsManuallyVerified(true);
      toast.success("Email berhasil diverifikasi. Silakan login.");
    }
  }, [location.search]);

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
      navigate("/auth/verification-sent", { state: { 
        email,
        ...(invitationToken && { isInvitation: true, invitationToken })
      }});
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Gagal mengirim ulang email verifikasi.");
    } finally {
      setResendingVerification(false);
    }
  };

  // Helper function to add delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const verifyUserEmailManually = async () => {
    try {
      // Check if user exists first
      const { data: userResponse } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();
      
      if (!userResponse) {
        console.log("User not found in profiles");
        return false;
      }

      // If we found the user, let's attempt to login again with a "confirmed" flag
      return true;
    } catch (error) {
      console.error("Error checking user profile:", error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setIsEmailUnverified(false);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Check specifically for email verification error
        if (error.message === "Email not confirmed") {
          setIsEmailUnverified(true);
          
          // If the "manually verified" flag is set or we've tried multiple times, attempt to verify
          if (isManuallyVerified || loginRetries >= 1) {
            const isVerified = await verifyUserEmailManually();
            
            if (isVerified) {
              // Add a slight delay and try login again
              await delay(1000);
              
              const { data: secondAttempt, error: secondError } = await supabase.auth.signInWithPassword({
                email,
                password
              });
              
              if (!secondError && secondAttempt.user) {
                toast.success("Login berhasil!");
                handleSuccessfulLogin(secondAttempt.user);
                return;
              }
            }
          }
          
          setLoginRetries(prev => prev + 1);
          throw new Error("Email belum dikonfirmasi. Silakan verifikasi email Anda terlebih dahulu.");
        }
        throw error;
      }
      
      if (data.user) {
        toast.success("Login berhasil!");
        handleSuccessfulLogin(data.user);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Improved error handling with more specific error messages
      if (error.message === "Database error granting user" || error.status === 500) {
        // This could be the case where email is verified but "last sign in" is not updated
        if (loginRetries < 2) {
          // Try up to 2 more times with increasing delays
          setLoginRetries(prev => prev + 1);
          
          setTimeout(async () => {
            // Retry login silently with exponential backoff
            try {
              const delay = loginRetries * 1500; // 1.5s, 3s
              await new Promise(resolve => setTimeout(resolve, delay));
              
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password
              });
              
              if (!retryError && retryData.user) {
                setIsLoading(false);
                toast.success("Login berhasil!");
                handleSuccessfulLogin(retryData.user);
                return;
              }
            } catch (retryErr) {
              console.error("Retry login failed:", retryErr);
            }
            
            setIsLoading(false);
            setLoginError("Server sedang mengalami masalah. Silakan coba lagi dalam beberapa saat atau hubungi dukungan teknis.");
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
        .single();
      
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
        </CardHeader>
        <CardContent>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
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
