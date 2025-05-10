import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Import the new validation utility instead of the one that tries to access a missing table
import { validateToken } from "@/utils/invitationUtils";

const JoinOrganization = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (token && email) {
      validateInvitation();
    }
  }, [token, email]);

  const validateInvitation = async () => {
    if (!token || !email) {
      setError("Token dan email diperlukan");
      setIsValidating(false);
      return;
    }

    try {
      const result = await validateToken(token, email);
      if (!result.valid) {
        setError(result.message || "Token tidak valid");
        setIsValidating(false);
        return;
      }

      // The invitation is valid, proceed to the join process
      setIsValid(true);
      setIsValidating(false);
    } catch (error: any) {
      console.error("Error validating invitation:", error);
      setError(error.message || "Terjadi kesalahan saat memvalidasi undangan");
      setIsValidating(false);
    }
  };

  const handleJoin = async () => {
    if (!token || !email) {
      setError("Token dan email diperlukan");
      return;
    }

    try {
      // Redirect to login with the token and email
      navigate(`/auth/login?email=${email}&token=${token}`);
    } catch (joinErr: any) {
      console.error("Error joining organization:", joinErr);
      toast.error(joinErr.message || "Gagal bergabung dengan organisasi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-center">Bergabung dengan Organisasi</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-500 text-center">
              <AlertCircle className="inline-block h-4 w-4 mr-1 align-middle" />
              {error}
            </div>
          )}

          {isValidating ? (
            <div className="text-center">Memvalidasi undangan...</div>
          ) : isValid ? (
            <div className="text-center mb-6">
              <p>Anda telah divalidasi. Klik tombol di bawah untuk melanjutkan.</p>
              <div className="flex justify-center mt-4">
                <Button onClick={handleJoin} variant="outline">
                  Lanjutkan
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={token !== null}
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Token"
                  value={token || ""}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={email !== null}
                />
              </div>
              <Button onClick={validateInvitation} className="w-full" disabled={token === null || email === null}>
                Validasi Undangan
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinOrganization;
