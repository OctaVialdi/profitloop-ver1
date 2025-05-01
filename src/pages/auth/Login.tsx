
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    // Add a retry mechanism for database errors
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptLogin = async (): Promise<any> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        return data;
      } catch (error: any) {
        // Only retry on database errors
        if (error.message === "Database error granting user" && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying login attempt ${retryCount} of ${maxRetries}...`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptLogin();
        } else {
          throw error;
        }
      }
    };
    
    try {
      const data = await attemptLogin();
      
      if (data.user) {
        // If we have invitation token, join organization after login
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
            
            // Type check the response
            if (!joinResult || typeof joinResult[0] !== 'object' || joinResult[0].success === undefined) {
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
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', data.user.id)
          .single();
        
        toast.success("Login berhasil!");
        
        if (profileData && profileData.organization_id) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      if (error.message === "Database error granting user") {
        setLoginError("Terjadi masalah sementara di server. Silakan coba lagi dalam beberapa saat.");
      } else if (error.message.includes("Invalid login credentials")) {
        setLoginError("Email atau password salah. Mohon periksa kembali.");
      } else if (error.message.includes("Email not confirmed")) {
        setLoginError("Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda.");
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
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
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
