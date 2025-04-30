
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { UserPlus, Building, X, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any | null>(null);
  
  // Extract the token from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Token undangan tidak ditemukan");
        setIsLoading(false);
        return;
      }

      try {
        // Verify the invitation token
        const { data, error: invitationError } = await supabase
          .from('invitations')
          .select(`
            id, email, status, organization_id,
            organizations:organization_id (name)
          `)
          .eq('token', token)
          .single();

        if (invitationError || !data) {
          throw new Error("Undangan tidak valid atau sudah kedaluwarsa");
        }

        if (data.status !== 'pending' && data.status !== 'sent') {
          throw new Error("Undangan ini sudah diproses sebelumnya");
        }

        setInvitation(data);
      } catch (error: any) {
        console.error("Error verifying invitation:", error);
        setError(error.message || "Terjadi kesalahan saat memverifikasi undangan");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;
    
    setIsSubmitting(true);
    
    try {
      // First, check if the user is already logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If user is not logged in, redirect to register page with invitation data
        navigate('/auth/register', { 
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
      
      // Accept the invitation
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);
      
      if (updateError) throw updateError;
      
      // Update the user's profile to join the organization
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          organization_id: invitation.organization_id,
          role: invitation.role || 'employee' // Use the role from invitation or default to employee
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      toast.success("Undangan berhasil diterima!");
      navigate('/dashboard');
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
        .eq('id', invitation.id);
      
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
            <span className="text-xl font-bold">{invitation?.organizations?.name}</span>
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
