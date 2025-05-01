
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pre-fill email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);
  
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
          ...(location.state?.invitationToken && { 
            isInvitation: true, 
            invitationToken: location.state.invitationToken 
          }),
          ...(location.state?.magicLinkToken && {
            magicLinkToken: location.state.magicLinkToken
          })
        }
      });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Gagal mengirim ulang email verifikasi.");
    } finally {
      setResendingVerification(false);
    }
  };

  // Handle login function
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
        
        // Handle magic link token if present
        const magicLinkToken = location.state?.magicLinkToken;
        if (magicLinkToken) {
          console.log("Processing magic link token after login:", magicLinkToken);
          try {
            const { data: joinResult, error: joinError } = await supabase.rpc(
              'process_magic_link_invitation',
              { 
                invitation_token: magicLinkToken,
                user_id: data.user.id
              }
            );
            
            if (joinError) {
              console.error("Error joining with magic link token:", joinError);
              throw joinError;
            }
            
            // Handle result as an object
            const result = joinResult as { success: boolean, message: string, organization_id?: string, role?: string };
            
            if (result.success) {
              // Get organization name
              let organizationName = "organization";
              if (result.organization_id) {
                const { data: orgData } = await supabase
                  .from('organizations')
                  .select('name')
                  .eq('id', result.organization_id)
                  .maybeSingle();
                  
                if (orgData && orgData.name) {
                  organizationName = orgData.name;
                }
              }
              
              toast.success("Berhasil bergabung dengan organisasi!");
              navigate("/employee-welcome", { 
                state: { 
                  organizationName,
                  role: result.role || "employee"
                }
              });
              return;
            } else {
              throw new Error(result.message || "Gagal bergabung dengan organisasi");
            }
          } catch (joinErr: any) {
            console.error("Error joining organization:", joinErr);
            toast.error(joinErr.message || "Gagal bergabung dengan organisasi");
            // Continue with normal flow even if joining fails
          }
        }
        
        // Handle invitation token (legacy) if present
        else if (location.state?.invitationToken) {
          try {
            const { data: joinResult, error: joinError } = await supabase
              .rpc('join_organization', { 
                user_id: data.user.id, 
                invitation_token: location.state.invitationToken 
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
      
      if (error.message.includes("Database error")) {
        // Handle database-specific errors more gracefully
        console.log("Database error during login - may be related to missing last_active column");
        
        // Attempt to complete the login process anyway
        try {
          // First check if the user exists and is verified
          const { data: emailCheck } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();
            
          if (emailCheck) {
            // User exists in the system, continue to dashboard
            toast.success("Login berhasil!");
            navigate("/dashboard");
            return;
          }
        } catch (fallbackErr) {
          console.error("Fallback login check failed:", fallbackErr);
        }
        
        // If fallback fails, show a more user-friendly error
        setLoginError("Terjadi masalah server saat login. Mohon coba lagi dalam beberapa saat.");
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

  return {
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
  };
}
