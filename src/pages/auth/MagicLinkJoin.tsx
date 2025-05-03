
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
  
  // Extract hash parameters (for Supabase auth tokens)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const type = hashParams.get("type");
  const errorCode = searchParams.get("error_code") || hashParams.get("error_code");
  const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
  
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
    console.log("Hash parameters:", { accessToken, refreshToken, type });
    console.log("Full URL:", window.location.href);
    
    const processInvitation = async () => {
      // Check if there's an error in the URL
      if (errorCode || errorDescription || window.location.hash.includes('error=access_denied')) {
        console.error("Error from Supabase auth:", errorCode, errorDescription);
        setError(errorDescription?.replace(/\+/g, ' ') || "Link undangan tidak valid atau sudah kadaluarsa");
        setIsLoading(false);
        return;
      }
      
      // IMPORTANT: Process the access token if present (from Supabase magic link)
      if (accessToken && refreshToken) {
        try {
          console.log("Setting session from URL hash tokens");
          
          // Set session manually using the tokens from the URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("Error setting session from tokens:", error);
            throw error;
          }
          
          if (!data || !data.session) {
            console.error("No session returned when setting session");
            throw new Error("Failed to set session from magic link");
          }
          
          console.log("Auth session set successfully:", data.session.user.id);
          
          // Get user metadata from JWT claims
          const userMetadata = data.session.user.user_metadata;
          console.log("User metadata from session:", userMetadata);
          
          // If we have a token from the URL, process the invitation
          if (token || userMetadata?.invitation_token) {
            const invitationToken = token || userMetadata?.invitation_token;
            
            console.log("Processing invitation with token:", invitationToken);
            
            // Process the magic link invitation
            const { data: result, error: joinError } = await supabase.rpc(
              'process_magic_link_invitation',
              { 
                invitation_token: invitationToken,
                user_id: data.session.user.id
              }
            );

            if (joinError) {
              console.error("Error processing invitation:", joinError);
              setError(joinError.message || "Gagal memproses undangan");
              setIsLoading(false);
              return;
            }

            // Handle the response as JSON object
            const invitationResult = result as { 
              success: boolean, 
              message: string, 
              organization_id?: string, 
              role?: string 
            };

            console.log("Invitation processing result:", invitationResult);

            if (!invitationResult.success) {
              setError(invitationResult.message || "Token undangan tidak valid atau sudah kadaluarsa");
              setIsLoading(false);
              return;
            }

            // Get organization name from metadata or from database
            let orgName = userMetadata?.organization_name;
            
            // If organization name is not in metadata, fetch from database
            if (!orgName && invitationResult.organization_id) {
              const { data: orgData } = await supabase
                .from('organizations')
                .select('name')
                .eq('id', invitationResult.organization_id)
                .single();

              if (orgData) {
                orgName = orgData.name;
              }
            }

            setOrganizationName(orgName || "");
            toast.success("Berhasil bergabung dengan organisasi!");
            setSuccess(true);
            setIsLoading(false);
            
            // Update user metadata with organization info
            if (invitationResult.organization_id) {
              await supabase.auth.updateUser({
                data: {
                  organization_id: invitationResult.organization_id,
                  role: invitationResult.role || userMetadata?.role || "employee"
                }
              });
            }
            
            // Delay before redirect to welcome page
            setTimeout(() => {
              navigate("/employee-welcome", { 
                state: { 
                  organizationName: orgName,
                  role: invitationResult.role || userMetadata?.role || "employee" 
                }
              });
            }, 2000);
            
            return;
          } else {
            // If we don't have a token but authentication succeeded, redirect to dashboard
            toast.success("Login berhasil!");
            navigate("/dashboard");
            return;
          }
        } catch (error: any) {
          console.error("Error processing magic link authentication:", error);
          setError(error.message || "Terjadi kesalahan saat memproses undangan");
          setIsLoading(false);
          return;
        }
      }

      // If there's no access token in the URL hash but we have a token in the URL parameters,
      // and the user is not logged in, redirect to login page with the token
      if (token && !accessToken) {
        try {
          // Check if user is already logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            // If not logged in, redirect to login page with token
            console.log("No user found, redirecting to login with token");
            navigate("/auth/login", { 
              state: { 
                email,
                magicLinkToken: token 
              }
            });
            return;
          }
          
          // If user is logged in, process the invitation token
          console.log("User already logged in, processing invitation token");
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

          // Handle the response
          const invitationResult = data as { 
            success: boolean, 
            message: string, 
            organization_id?: string, 
            role?: string 
          };

          if (!invitationResult.success) {
            setError(invitationResult.message || "Token undangan tidak valid atau sudah kadaluarsa");
            setIsLoading(false);
            return;
          }

          // Get organization name if joining was successful
          if (invitationResult.organization_id) {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', invitationResult.organization_id)
              .single();

            if (orgData) {
              setOrganizationName(orgData.name);
            }
          }

          toast.success("Berhasil bergabung dengan organisasi!");
          setSuccess(true);
          setIsLoading(false);
          
          // Delay before redirect to welcome page
          setTimeout(() => {
            navigate("/employee-welcome", { 
              state: { 
                organizationName,
                role: invitationResult.role || "employee" 
              }
            });
          }, 2000);
        } catch (error: any) {
          console.error("Unexpected error:", error);
          setError(error.message || "Terjadi kesalahan saat memproses undangan");
          setIsLoading(false);
        }
      } else if (!token && !accessToken) {
        setError("Tidak ada token undangan yang ditemukan");
        setIsLoading(false);
      }
    };

    processInvitation();
  }, [token, navigate, organizationName, email, errorCode, errorDescription, accessToken, refreshToken, type]);

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
