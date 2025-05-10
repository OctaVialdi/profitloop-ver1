
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ensureProfileExists } from "@/services/profileService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
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

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Check if email already exists in the profiles table
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      setIsCheckingEmail(true);
      console.log("Checking if email exists:", email);
      
      // First check auth
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: false
        }
      });
      
      if (!authError) {
        console.log("Email exists in auth system");
        return true;
      }
      
      // Then check profiles directly
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (error) {
        console.error("Error checking email:", error);
        return false;
      }
      
      console.log("Email exists check result:", !!data);
      return !!data; // Return true if data exists (email found)
    } catch (error) {
      console.error("Exception checking email:", error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const createProfileViaEdgeFunction = async (userId: string, userData: { 
    email: string, 
    full_name?: string | null, 
    is_email_verified?: boolean 
  }) => {
    try {
      console.log("Creating profile via edge function for user:", userId);
      const { data, error } = await supabase.functions.invoke('create-profile-if-not-exists', {
        body: {
          user_id: userId,
          user_email: userData.email.toLowerCase(),
          user_full_name: userData.full_name,
          is_email_verified: userData.is_email_verified
        }
      });
      
      if (error) {
        console.error("Error creating profile via edge function:", error);
        return false;
      }
      
      console.log("Edge function response:", data);
      return data.success;
    } catch (funcError) {
      console.error("Exception calling edge function:", funcError);
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    if (!isValidEmail(email)) {
      toast.error("Format email tidak valid. Mohon periksa kembali.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast.error("Email sudah terdaftar. Silakan gunakan email lain atau login.");
        setIsLoading(false);
        return;
      }

      // Check if this is the first user in the system (to assign super_admin role)
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error checking for existing profiles:", countError);
      }
      
      // If no profiles exist (or we couldn't check), this is likely the first user
      const isFirstUser = count === 0 || count === null;
      const role = isFirstUser ? 'super_admin' : 'employee';
      
      console.log(`Registering user with role: ${role} (isFirstUser: ${isFirstUser}, count: ${count})`);

      // Clean up any existing auth state to prevent conflicts
      try {
        // Clear local storage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
        
        // Try a global sign out to ensure clean slate
        await supabase.auth.signOut({ scope: 'global' });
      } catch (cleanupError) {
        console.log("Pre-registration cleanup:", cleanupError);
      }

      console.log("Registering new user with email:", email);
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            email: email,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data && data.user) {
        console.log("User created successfully:", data.user.id);
        
        // Method 1: Directly create profile entry
        try {
          console.log("Attempting direct profile creation");
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email.toLowerCase(),
              full_name: fullName,
              email_verified: false,
              role: role
            });
            
          if (profileError) {
            console.error("Failed to create profile directly:", profileError);
            
            // Method 2: Use helper function
            console.log("Trying fallback profile creation method");
            const profileCreated = await ensureProfileExists(data.user.id, {
              email: email,
              full_name: fullName,
              email_verified: false
            });
            
            console.log("Profile creation via helper function result:", profileCreated);
            
            // Method 3: Edge function approach
            if (!profileCreated) {
              console.log("Trying edge function profile creation");
              await createProfileViaEdgeFunction(data.user.id, {
                email: email,
                full_name: fullName,
                is_email_verified: false
              });
            }
          } else {
            console.log("Profile created successfully via direct insert");
          }
        } catch (profileErr) {
          console.error("Error creating profile:", profileErr);
        }
        
        // Always redirect to verification page, never skip this step
        toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
        navigate("/auth/verification-sent", { 
          state: { 
            email,
            password, // Pass password for auto-login after verification
            isInvitation: !!invitationToken,
            invitationToken: invitationToken || null
          } 
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-center">
            Masukkan data Anda untuk membuat akun baru
            {invitationEmail && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700 text-sm">
                Anda akan bergabung dengan organisasi setelah verifikasi email
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isCheckingEmail}>
              {isLoading || isCheckingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCheckingEmail ? "Memeriksa..." : "Memproses..."}
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Sudah memiliki akun?{" "}
            <Link to="/auth/login" className="text-blue-500 hover:text-blue-700">
              Login disini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
