import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { refreshData } = useOrganization();
  const [searchParams] = useSearchParams();
  const { token } = useParams<{ token: string }>();
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");
  const [role, setRole] = useState<string>("employee");
  const [isInvitationValid, setInvitationValid] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setInvitationValid(false);
      setValidationError("Token tidak valid");
      setIsValidating(false);
      return;
    }

    if (!isAuthLoading && user) {
      validateToken();
    }
  }, [token, user, isAuthLoading]);

  const validateToken = async () => {
    setIsValidating(true);
    try {
      // Use RPC function to validate invitation directly
      const { data: validationResult, error: validationError } = await supabase.rpc(
        'validate_invitation',
        { 
          invitation_token: token,
          invitee_email: user?.email || ""
        }
      );

      if (validationError || !validationResult || !validationResult.length) {
        setInvitationValid(false);
        setValidationError("Token undangan tidak valid atau kadaluarsa");
        setIsValidating(false);
        return;
      }

      const validationData = validationResult[0];
      if (!validationData.valid) {
        setInvitationValid(false);
        setValidationError(validationData.message || "Token undangan tidak valid");
        setIsValidating(false);
        return;
      }

      // If token is valid, get the organization name
      const { data: orgData } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', validationData.organization_id)
        .single();

      setOrganizationName(orgData?.name || "");
      setOrganizationId(validationData.organization_id);
      setRole(validationData.role || "employee");
      setInvitationValid(true);
    } catch (error: any) {
      console.error("Error validating invitation:", error);
      setInvitationValid(false);
      setValidationError("Terjadi kesalahan saat memvalidasi undangan");
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoinOrganization = async () => {
    setIsJoining(true);
    try {
      if (!user) {
        toast.error("Tidak ada pengguna yang terautentikasi.");
        return;
      }

      // If the user doesn't have a password, set it
      if (!password) {
        toast.error("Password is required to join the organization.");
        return;
      }

      // Update the user's password
      const { error: passwordError } = await supabase.auth.updateUser({ password: password });

      if (passwordError) {
        throw passwordError;
      }

      // Process the magic link invitation
      const { data: result, error: joinError } = await supabase.rpc(
        'process_magic_link_invitation',
        { 
          invitation_token: token,
          user_id: user.id
        }
      );

      if (joinError) {
        console.error("Error processing invitation:", joinError);
        toast.error(joinError.message || "Gagal memproses undangan");
        return;
      }

      // Handle the response as JSON object
      const invitationResult = result as { 
        success: boolean, 
        message: string, 
        organization_id?: string, 
        role?: string 
      };

      if (!invitationResult.success) {
        toast.error(invitationResult.message || "Gagal bergabung dengan organisasi");
        return;
      }

      toast.success("Berhasil bergabung dengan organisasi!");
      await refreshData();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error joining organization:", err);
      toast.error(err.message || "Terjadi kesalahan saat bergabung dengan organisasi");
    } finally {
      setIsJoining(false);
    }
  };

  if (isValidating) {
    return <div className="container mx-auto p-8 text-center">Memvalidasi undangan...</div>;
  }

  if (validationError) {
    return (
      <div className="container mx-auto p-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Undangan Tidak Valid</CardTitle>
            <CardDescription>{validationError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth/login")}>Kembali ke Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInvitationValid) {
    return <div className="container mx-auto p-8 text-center">Undangan tidak valid.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Terima Undangan</CardTitle>
          <CardDescription>
            Anda telah diundang untuk bergabung dengan organisasi <strong>{organizationName}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={user?.email || ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <Button onClick={handleJoinOrganization} disabled={isJoining}>
            {isJoining ? "Bergabung..." : "Bergabung dengan Organisasi"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
