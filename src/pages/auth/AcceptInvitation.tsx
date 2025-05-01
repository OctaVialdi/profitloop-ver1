
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { UserPlus, Building, X, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema for the registration form
const registerSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nama harus mengandung minimal 2 karakter",
  }),
  password: z.string().min(8, {
    message: "Password harus mengandung minimal 8 karakter",
  }),
  confirmPassword: z.string().min(8, {
    message: "Konfirmasi password harus mengandung minimal 8 karakter",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password dan konfirmasi password tidak sama",
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  // Extract the token and email from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Form for registration
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setError("Token undangan atau email tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        // Call the validate_invitation function
        const { data: validationResult, error: validationError } = await supabase
          .rpc('validate_invitation', { 
            invitation_token: token, 
            invitee_email: email 
          });

        if (validationError) {
          throw new Error(validationError.message);
        }

        if (!validationResult || validationResult.length === 0) {
          throw new Error("Undangan tidak ditemukan");
        }

        const invitationData = validationResult[0];

        if (!invitationData.valid) {
          throw new Error(invitationData.message);
        }

        // Check if the user with this email already exists
        const { data: authUser, error: authError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false,
          }
        });

        // If the user doesn't exist, show the register form
        if (authError && authError.message.includes("Email not found")) {
          setShowRegisterForm(true);
          setInvitation({
            ...invitationData,
            email: email,
            token: token
          });
        } else {
          // If the user exists, get details about the organization
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', invitationData.organization_id)
            .single();

          if (orgError) {
            throw new Error("Gagal mendapatkan informasi organisasi");
          }

          setInvitation({
            ...invitationData,
            email: email,
            token: token,
            organizationName: orgData.name
          });
        }
      } catch (error: any) {
        console.error("Error verifying invitation:", error);
        setError(error.message || "Terjadi kesalahan saat memverifikasi undangan");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, email]);

  const handleRegister = async (values: RegisterFormValues) => {
    if (!email || !token) return;
    
    setIsSubmitting(true);
    
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          }
        }
      });

      if (error) throw error;
      
      if (data?.user) {
        toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
        
        // Join the organization once registered
        const { data: joinResult, error: joinError } = await supabase
          .rpc('join_organization', { 
            user_id: data.user.id, 
            invitation_token: token 
          });
        
        if (joinError) {
          throw joinError;
        }
        
        if (!joinResult || !joinResult[0].success) {
          throw new Error(joinResult[0].message || "Gagal bergabung dengan organisasi");
        }
        
        // Redirect to verification sent page with invitation context
        navigate("/auth/verification-sent", { 
          state: { 
            email,
            isInvitation: true,
            organizationName: invitation?.organizationName || "Organisasi" 
          } 
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAcceptInvitation = async () => {
    if (!invitation) return;
    
    setIsSubmitting(true);
    
    try {
      // First, check if the user is already logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If user is not logged in, redirect to login page with invitation data
        navigate('/auth/login', { 
          state: { 
            invitationEmail: invitation.email,
            invitationToken: token
          } 
        });
        return;
      }
      
      // If user is logged in, check if email matches
      if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new Error(`Anda perlu login dengan email ${invitation.email} untuk menerima undangan ini`);
      }
      
      // Join the organization
      const { data: joinResult, error: joinError } = await supabase
        .rpc('join_organization', { 
          user_id: user.id, 
          invitation_token: token 
        });
      
      if (joinError) {
        throw joinError;
      }
      
      if (!joinResult || !joinResult[0].success) {
        throw new Error(joinResult[0].message || "Gagal bergabung dengan organisasi");
      }
      
      toast.success("Undangan berhasil diterima!");
      
      // Redirect to onboarding page for employees
      navigate("/employee-welcome", { 
        state: { 
          organizationName: invitation.organizationName || "Organisasi",
          role: invitation.role || "karyawan" 
        } 
      });
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.message || "Gagal menerima undangan");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRejectInvitation = async () => {
    if (!invitation) return;
    
    setIsSubmitting(true);
    
    try {
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'rejected' })
        .eq('token', token);
      
      if (updateError) throw updateError;
      
      toast.success("Undangan telah ditolak");
      navigate('/auth/login');
    } catch (error: any) {
      console.error("Error rejecting invitation:", error);
      toast.error(error.message || "Gagal menolak undangan");
    } finally {
      setIsSubmitting(false);
    }
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
  
  // Render registration form for new users
  if (showRegisterForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-center">Buat Akun Baru</CardTitle>
            <CardDescription className="text-center">
              Anda diundang untuk bergabung sebagai anggota tim. Buat akun untuk melanjutkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email || ""}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500">Email tidak dapat diubah</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap Anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Ulangi password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate("/auth/login")}>
              Sudah punya akun? Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render invitation acceptance for existing users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-center">Undangan Organisasi</CardTitle>
          <CardDescription className="text-center">
            Anda diundang untuk bergabung dengan organisasi
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="text-xl font-bold">{invitation?.organizationName}</span>
          </div>
          
          <p className="text-gray-600">
            Undangan ini dikirim ke email:{" "}
            <span className="font-semibold">{invitation?.email}</span>
          </p>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Dengan menerima undangan ini, Anda akan bergabung dengan organisasi tersebut dan dapat mengakses semua fitur dan data yang dibagikan kepada Anda.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleAcceptInvitation}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Terima Undangan
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleRejectInvitation}
            disabled={isSubmitting}
            variant="outline" 
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Tolak Undangan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
