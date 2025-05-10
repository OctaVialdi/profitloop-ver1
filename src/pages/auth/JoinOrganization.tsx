
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface InvitationInfo {
  valid: boolean;
  message: string;
  role: string;
  organizationId: string;
}

const JoinOrganization = () => {
  const [invitationToken, setInvitationToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invitationInfo, setInvitationInfo] = useState<InvitationInfo>({
    valid: false,
    message: "",
    role: "",
    organizationId: ""
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      setInvitationToken(token);
      validateInvitation(token);
    }
  }, [location.search]);

  // Update the validateInvitation function to handle the response correctly
  const validateInvitation = async (token: string, email?: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc("validate_invitation", {
        invitation_token: token,
        invitee_email: email || "",
      });

      if (error) {
        console.error("Error validating invitation:", error);
        toast.error("Terjadi kesalahan saat memvalidasi undangan");
        navigate("/auth/login");
        return;
      }

      if (data && data.length > 0) {
        const validationResult = data[0];
        setInvitationInfo({
          valid: validationResult.valid,
          message: validationResult.message,
          role: validationResult.role,
          organizationId: validationResult.organization_id
        });

        // If not valid, show error
        if (!validationResult.valid) {
          toast.error(validationResult.message);
        }
      } else {
        toast.error("Undangan tidak ditemukan");
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Exception validating invitation:", err);
      toast.error("Terjadi kesalahan saat memvalidasi undangan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinOrganization = async () => {
    if (!invitationToken) {
      toast.error("Token undangan tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Anda harus login terlebih dahulu");
        navigate("/auth/login");
        return;
      }

      const { data, error } = await supabase.rpc("join_organization", {
        user_id: user.id,
        invitation_token: invitationToken,
      });

      if (error) {
        console.error("Error joining organization:", error);
        toast.error("Gagal bergabung dengan organisasi");
        return;
      }

      if (data && data.length > 0) {
        const joinResult = data[0];
        if (joinResult.success) {
          toast.success("Berhasil bergabung dengan organisasi!");
          navigate("/dashboard");
        } else {
          toast.error(joinResult.message || "Gagal bergabung dengan organisasi");
        }
      } else {
        toast.error("Gagal bergabung dengan organisasi");
      }
    } catch (err) {
      console.error("Exception joining organization:", err);
      toast.error("Terjadi kesalahan saat bergabung dengan organisasi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Bergabung dengan Organisasi
          </CardTitle>
          <CardDescription className="text-center">
            Masukkan email Anda untuk bergabung dengan organisasi
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button onClick={() => validateInvitation(invitationToken, email)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memvalidasi...
              </>
            ) : (
              "Validasi Undangan"
            )}
          </Button>
          {invitationInfo.valid && (
            <div className="text-green-600">
              Undangan Valid! Anda akan bergabung sebagai {invitationInfo.role}.
            </div>
          )}
          {invitationInfo.message && !invitationInfo.valid && (
            <div className="text-red-600">{invitationInfo.message}</div>
          )}
        </CardContent>
        {invitationInfo.valid && (
          <Button onClick={handleJoinOrganization} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bergabung...
              </>
            ) : (
              "Bergabung dengan Organisasi"
            )}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default JoinOrganization;
