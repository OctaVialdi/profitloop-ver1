
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const VerificationSent = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const location = useLocation();
  const email = location.state?.email || "";

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Tidak ada alamat email yang tersedia untuk mengirim ulang verifikasi");
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setResendCount(count => count + 1);
      toast.success("Email verifikasi telah dikirim ulang");
    } catch (error: any) {
      console.error("Error resending verification:", error);
      toast.error(error.message || "Gagal mengirim ulang email verifikasi");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verifikasi Email</CardTitle>
          <CardDescription className="text-center">
            Kami telah mengirim email verifikasi ke
            {email && <div className="font-medium mt-1">{email}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Silakan cek kotak masuk email Anda dan klik tautan verifikasi untuk melanjutkan.
            Email verifikasi biasanya tiba dalam waktu 1-2 menit.
          </p>
          
          {resendCount > 0 && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription>
                Email verifikasi telah dikirim ulang ({resendCount}x). Mohon periksa kotak masuk Anda.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500 font-medium">Belum menerima email?</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Periksa folder spam atau junk mail Anda</p>
              <p>• Verifikasi bahwa alamat email Anda benar</p>
              <p>• Tunggu beberapa menit dan coba lagi</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleResendVerification} 
            disabled={isResending || resendCount >= 3} 
            variant="outline" 
            className="w-full"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : resendCount >= 3 ? (
              "Batas pengiriman ulang tercapai"
            ) : (
              "Kirim Ulang Email Verifikasi"
            )}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/auth/login">Kembali ke Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationSent;
