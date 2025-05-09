import { useSearchParams } from "react-router-dom";
import { useMagicLink } from "@/hooks/auth/useMagicLink";
import LoadingState from "@/components/auth/magic-link/LoadingState";
import ErrorState from "@/components/auth/magic-link/ErrorState";
import SuccessState from "@/components/auth/magic-link/SuccessState";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateInvitationToken, getOrganizationName } from "@/hooks/auth/magicLinkUtils";

// Schema for login form
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// Schema for registration form
const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const MagicLinkJoin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract URL parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const type = searchParams.get("type"); // For Supabase invite links
  const redirectTo = searchParams.get("redirect_to"); // For Supabase redirect
  
  // Extract hash parameters (for Supabase auth tokens)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const errorCode = searchParams.get("error_code") || hashParams.get("error_code");
  const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");
  
  const [organizationDetails, setOrganizationDetails] = useState<any>(null);
  const [validatingToken, setValidatingToken] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Process the magic link invitation
  const { isLoading, error, success, organizationName } = useMagicLink({
    email,
    token,
    accessToken,
    refreshToken,
    errorCode,
    errorDescription,
    type,
    redirectTo
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: email || "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError("Token undangan tidak ditemukan");
        setValidatingToken(false);
        return;
      }

      try {
        // First, try to validate as a magic link invitation
        const validationResult = await validateInvitationToken(token, email || "");

        if (validationResult.valid) {
          // Token is valid, get organization details
          const orgName = await getOrganizationName(validationResult.organizationId);

          setOrganizationDetails({
            ...validationResult,
            name: orgName || "Organization",
          });
          
          setTokenValid(true);
          setValidatingToken(false);
          return;
        } 

        // If not valid as magic link, try as Supabase invitation
        if (type === 'invite') {
          // For Supabase invite links, we need to check user auth state
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // User is already authenticated, process the invitation
            setTokenValid(true);
            setValidatingToken(false);
          } else {
            // User needs to authenticate first
            setShowLoginForm(true);
            setValidatingToken(false);
          }
        } else {
          // If all validation fails
          setTokenError("Token undangan tidak valid atau sudah kadaluarsa");
          setValidatingToken(false);
        }
      } catch (error: any) {
        console.error("Error validating token:", error);
        setTokenError(error.message || "Gagal memverifikasi token undangan");
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token, email, type]);

  const handleLogin = async (values: LoginFormValues) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Login berhasil!");
        
        // Process the invitation now that user is logged in
        if (token) {
          const { data: joinResult, error: joinError } = await supabase.rpc(
            'process_magic_link_invitation',
            { 
              invitation_token: token,
              user_id: data.user.id
            }
          );
          
          if (joinError) throw joinError;
          
          const result = joinResult as { 
            success: boolean, 
            message: string, 
            organization_id?: string 
          };
          
          if (!result.success) throw new Error(result.message);
          
          toast.success("Berhasil bergabung dengan organisasi!");
          navigate("/employee-welcome", { 
            state: { 
              organizationName: organizationDetails?.name || "Organization" 
            } 
          });
        } else if (redirectTo) {
          // Handle redirect from Supabase
          window.location.href = redirectTo;
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Gagal login. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setIsProcessing(true);
    
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Registrasi berhasil!");
        
        if (token) {
          // Attempt to join the organization
          const { data: joinResult, error: joinError } = await supabase.rpc(
            'process_magic_link_invitation',
            { 
              invitation_token: token,
              user_id: data.user.id
            }
          );
          
          if (joinError) {
            console.warn("Couldn't join organization yet, will try after email verification:", joinError);
          }
        }
        
        // Show verification message and redirect
        navigate("/auth/verification-sent", { 
          state: { 
            email: values.email,
            isInvitation: !!token,
            organizationName: organizationDetails?.name || "Organization",
            invitationToken: token
          } 
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle user already exists error
      if (error.message?.includes("already exists")) {
        toast.error("Email sudah terdaftar. Silakan login.");
        setShowLoginForm(true);
        setShowRegisterForm(false);
        loginForm.setValue("email", values.email);
      } else {
        toast.error(error.message || "Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // If still validating token
  if (validatingToken) {
    return <LoadingState />;
  }

  // If token validation error
  if (tokenError) {
    return (
      <ErrorState 
        error={tokenError} 
        email={email} 
        token={token}
        onManualLogin={() => setShowLoginForm(true)}
      />
    );
  }

  // If showing login form
  if (showLoginForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Login untuk Bergabung</CardTitle>
            <CardDescription className="text-center">
              Masuk untuk bergabung dengan {organizationDetails?.name || 'organisasi'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="link" 
              className="w-full" 
              onClick={() => {
                setShowRegisterForm(true);
                setShowLoginForm(false);
              }}
            >
              Belum punya akun? Daftar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If showing register form
  if (showRegisterForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Daftar untuk Bergabung</CardTitle>
            <CardDescription className="text-center">
              Buat akun untuk bergabung dengan {organizationDetails?.name || 'organisasi'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Email anda"
                          {...field} 
                          disabled={!!email} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nama lengkap anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Buat password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Konfirmasi password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : "Daftar"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="link" 
              className="w-full" 
              onClick={() => {
                setShowLoginForm(true);
                setShowRegisterForm(false);
              }}
            >
              Sudah punya akun? Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If token is valid and user needs to accept invitation
  if (tokenValid && organizationDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <UserPlus className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-center">Undangan Bergabung</CardTitle>
            <CardDescription className="text-center">
              Anda diundang untuk bergabung dengan organisasi
            </CardDescription>
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold">{organizationDetails.name}</h3>
              {organizationDetails.logo && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={organizationDetails.logo} 
                    alt={`${organizationDetails.name} logo`} 
                    className="h-16 w-auto"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {email ? (
                <>Undangan ini dikirim ke email: <span className="font-medium">{email}</span></>
              ) : (
                <>Silakan login atau daftar untuk menerima undangan ini</>
              )}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              onClick={() => setShowLoginForm(true)} 
              className="w-full"
            >
              Login untuk Menerima Undangan
            </Button>
            <Button 
              onClick={() => setShowRegisterForm(true)} 
              variant="outline" 
              className="w-full"
            >
              Daftar Akun Baru
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success state (handled by the hook)
  if (success) {
    return <SuccessState organizationName={organizationName} />;
  }

  // Default loading or error states
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        email={email} 
        token={token}
        onManualLogin={() => setShowLoginForm(true)}
      />
    );
  }

  return <LoadingState />;
};

export default MagicLinkJoin;
