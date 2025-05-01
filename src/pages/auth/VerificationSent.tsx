
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, RefreshCw } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import EmailTips from "@/components/auth/EmailTips";
import VerificationStatus from "@/components/auth/VerificationStatus";

const VerificationSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const password = location.state?.password || "";
  const invitationToken = location.state?.invitationToken || "";
  const magicLinkToken = location.state?.magicLinkToken || "";
  const isInvitation = location.state?.isInvitation || false;
  const organizationName = location.state?.organizationName || "";

  // If no email is provided, redirect to login
  if (!email) {
    navigate("/auth/login");
    return null;
  }

  const {
    showTip,
    secondsLeft,
    allowResend,
    checkingVerification,
    handleResendVerification
  } = useEmailVerification({ 
    email, 
    password,
    invitationToken: invitationToken || magicLinkToken
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="w-12 h-12 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <CardTitle className="text-center">Cek Email Anda</CardTitle>
        <CardDescription className="text-center">
          Kami telah mengirimkan email verifikasi ke{" "}
          <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <VerificationStatus checkingVerification={checkingVerification} />
        
        {/* Show info about joining organization if coming from invitation */}
        {isInvitation && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
            {magicLinkToken ? (
              <p>
                Setelah mengklik tautan verifikasi di email, Anda akan langsung bergabung dengan organisasi
                {organizationName ? <strong> {organizationName}</strong> : ''}.
              </p>
            ) : (
              <p>
                Setelah mengklik tautan verifikasi di email, Anda perlu login kembali untuk menyelesaikan proses 
                bergabung dengan organisasi
                {organizationName ? <strong> {organizationName}</strong> : ''}.
              </p>
            )}
          </div>
        )}
          
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Belum menerima email?
          </p>
          
          <Button
            variant="outline"
            onClick={handleResendVerification}
            disabled={!allowResend || secondsLeft > 0}
            className="flex items-center"
          >
            {secondsLeft > 0 ? (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Kirim Ulang ({secondsLeft}s)
              </>
            ) : (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Kirim Ulang Email
              </>
            )}
          </Button>
        </div>

        {showTip && <EmailTips />}
        
        <div className="border-t border-gray-200 pt-4 mt-4 text-center">
          <Button variant="link" onClick={() => navigate("/auth/login")}>
            Kembali ke halaman login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationSent;
