import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { EmailTips } from "@/components/auth/EmailTips";
import { VerificationStatus } from "@/components/auth/VerificationStatus";
import { EmailNotFound } from "@/components/auth/EmailNotFound";

const VerificationSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || "";
  const password = location.state?.password || ""; // Store password for auto-login
  const isInvitation = location.state?.isInvitation || false;
  const invitationToken = location.state?.invitationToken || "";
  
  const { 
    showTip, 
    secondsLeft, 
    allowResend, 
    checkingVerification,
    handleResendVerification 
  } = useEmailVerification({ 
    email, 
    password, 
    invitationToken 
  });

  useEffect(() => {
    // Auto-redirect when email is verified (handled in the hook)
    if (checkingVerification === false && secondsLeft === 0) {
      // This means verification might have succeeded
      const checkLogin = async () => {
        // This is just a placeholder - the actual logic is in the hook
      };
      checkLogin();
    }
  }, [checkingVerification, secondsLeft]);
  
  // Menambahkan parameter verified=true saat kembali ke login
  // dan juga menyimpan password untuk auto-login jika tersedia
  const goToLogin = () => {
    navigate("/auth/login?verified=true", { 
      state: { 
        verifiedEmail: email,
        password: password,
        isAttemptingVerification: true 
      } 
    });
  };
  
  if (!email) {
    return <EmailNotFound />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">Verifikasi Email</CardTitle>
          <CardDescription className="text-center">
            Kami telah mengirimkan email verifikasi ke:
            <div className="font-medium text-lg mt-2">{email}</div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center">
              Silakan periksa email Anda dan klik tautan verifikasi untuk menyelesaikan proses pendaftaran.
              {isInvitation && (
                <span className="block mt-2 font-medium text-blue-600">
                  Setelah verifikasi, Anda akan otomatis bergabung dengan organisasi yang mengundang Anda.
                </span>
              )}
            </p>
            
            <EmailTips showTip={showTip} />
            <VerificationStatus isChecking={checkingVerification} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            variant={allowResend ? "default" : "outline"} 
            className="w-full"
            disabled={!allowResend}
            onClick={handleResendVerification}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${!allowResend && 'animate-spin'}`} />
            {allowResend ? "Kirim Ulang Email" : `Tunggu ${secondsLeft} detik`}
          </Button>
          
          <Button variant="outline" onClick={goToLogin} className="w-full">
            Kembali ke Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationSent;
