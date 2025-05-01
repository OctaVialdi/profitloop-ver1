
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have invitation data from redirect
  const invitationEmail = location.state?.invitationEmail || "";
  const invitationToken = location.state?.invitationToken || "";
  
  // Check if we're coming from verification page
  const verifiedEmail = location.state?.verifiedEmail || "";
  const isAttemptingVerification = location.state?.isAttemptingVerification || false;

  // If we have invitation email, use it
  useEffect(() => {
    if (invitationEmail) {
      setEmail(invitationEmail);
    } else if (verifiedEmail) {
      setEmail(verifiedEmail);
    }
  }, [invitationEmail, verifiedEmail]);

  // Check URL parameters for verification status
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('verified') === 'true';
    
    if (verified) {
      setJustVerified(true);
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
      navigate("/auth/verification-sent", { 
        state: { 
          email,
          password,
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

  // Simplified login function to avoid database errors
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setIsEmailUnverified(false);
    
    try {
      // Simple login approach
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setIsEmailUnverified(true);
          throw new Error("Email belum dikonfirmasi. Silakan verifikasi email Anda terlebih dahulu.");
        }
        throw error;
      }
      
      if (data?.user) {
        toast.success("Login berhasil!");
        
        // If we have invitation token, handle it
        if (invitationToken) {
          try {
            const { data: joinResult, error: joinError } = await supabase
              .rpc('join_organization', { 
                user_id: data.user.id, 
                invitation_token: invitationToken 
              });
            
            if (joinError) {
              throw joinError;
            }
            
            if (joinResult && Array.isArray(joinResult) && joinResult[0] && joinResult[0].success) {
              toast.success("Berhasil bergabung dengan organisasi!");
              navigate("/employee-welcome");
              return;
            } else {
              throw new Error("Gagal bergabung dengan organisasi");
            }
          } catch (joinErr: any) {
            console.error("Error joining organization:", joinErr);
            toast.error(joinErr.message || "Gagal bergabung dengan organisasi");
          }
        }
        
        // Check if user has organization
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', data.user.id)
            .maybeSingle();
          
          if (profileData && profileData.organization_id) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        setLoginError("Email atau password salah. Mohon periksa kembali.");
      } else if (error.message.includes("Email not confirmed") || error.message.includes("Email belum dikonfirmasi")) {
        setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau kirim ulang email verifikasi.");
        setIsEmailUnverified(true);
      } else if (error.message.includes("Database error")) {
        setLoginError("Server sedang mengalami masalah. Silakan coba lagi dalam beberapa saat.");
      } else {
        setLoginError(error.message || "Gagal login. Periksa email dan password Anda.");
      }
    } finally {
      setIsLoading(false);
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
