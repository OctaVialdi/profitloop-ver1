
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const VerificationSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showTip, setShowTip] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [allowResend, setAllowResend] = useState(false);
  
  const email = location.state?.email || "";
  const isInvitation = location.state?.isInvitation || false;
  const invitationToken = location.state?.invitationToken || "";
  
  useEffect(() => {
    // Show tip about checking spam folder after 5 seconds
    const tipTimer = setTimeout(() => {
      setShowTip(true);
    }, 5000);
    
    // Start countdown timer for resend
    const countdownTimer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setAllowResend(true);
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearTimeout(tipTimer);
      clearInterval(countdownTimer);
    };
  }, []);
  
  const handleResendVerification = async () => {
    if (!email || !allowResend) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Email verifikasi berhasil dikirim ulang!");
      setAllowResend(false);
      setSecondsLeft(60);
      
      // Restart countdown
      const countdownTimer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setAllowResend(true);
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Show tip about checking spam folder immediately
      setShowTip(true);
    } catch (error: any) {
      console.error("Error resending verification:", error);
      toast.error("Gagal mengirim ulang email verifikasi");
    }
  };
  
  // Menambahkan parameter verified=true saat kembali ke login
  const goToLogin = () => {
    navigate("/auth/login?verified=true");
  };
  
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <AlertCircle className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-center text-2xl">Tidak Ada Data Email</CardTitle>
            <CardDescription className="text-center">
              Tidak ada email yang ditemukan untuk mengirim verifikasi.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/auth/register")} className="w-full">
              Kembali ke Halaman Registrasi
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
            
            {showTip && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                <p className="font-medium mb-1">Tidak menerima email?</p>
                <ul className="list-disc list-inside">
                  <li>Periksa folder spam/junk Anda</li>
                  <li>Verifikasi alamat email yang Anda masukkan</li>
                  <li>Tunggu beberapa menit</li>
                </ul>
              </div>
            )}
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
