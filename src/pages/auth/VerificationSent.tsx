
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEmailVerification } from "@/hooks/useEmailVerification";

const VerificationSent = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const password = location.state?.password || "";
  const isInvitation = location.state?.isInvitation || false;
  const invitationToken = location.state?.invitationToken || null;

  // Use the custom hook for email verification
  const { showTip, secondsLeft, allowResend, checkingVerification, handleResendVerification } = 
    useEmailVerification({ email, password, invitationToken });

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Halaman Tidak Valid</CardTitle>
            <CardDescription className="text-center">
              Anda harus mengakses halaman ini dari proses pendaftaran.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button onClick={() => window.location.href = "/auth/register"}>
                Kembali ke Halaman Pendaftaran
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Cek Email Anda</CardTitle>
          <CardDescription className="text-center">
            Kami telah mengirimkan tautan verifikasi ke <span className="font-bold">{email}</span><br />
            Klik tautan di email untuk melanjutkan
            {isInvitation && " dan bergabung dengan organisasi"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {checkingVerification && (
            <div className="text-center text-sm text-blue-600">
              Memeriksa status verifikasi...
            </div>
          )}

          {showTip && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                Tidak menerima email? Periksa folder spam atau junk Anda.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={!allowResend}
              onClick={handleResendVerification}
            >
              {!allowResend ? `Kirim Ulang (${secondsLeft})` : "Kirim Ulang Email"}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <span>Kembali ke </span>
            <a href="/auth/login" className="text-primary hover:underline">
              halaman login
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationSent;
