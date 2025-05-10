
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, Check } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { EmailTips } from "@/components/auth/EmailTips";
import { VerificationStatus } from "@/components/auth/VerificationStatus";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const VerificationSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const password = location.state?.password || "";
  const invitationToken = location.state?.invitationToken || "";
  const magicLinkToken = location.state?.magicLinkToken || "";
  const isInvitation = location.state?.isInvitation || false;
  const organizationName = location.state?.organizationName || "";
  const [isVerified, setIsVerified] = useState(false);

  // If no email is provided, redirect to login
  useEffect(() => {
    if (!email) {
      navigate("/auth/login");
    }
  }, [email, navigate]);

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
  
  // Periodically check for verification status directly
  useEffect(() => {
    if (!email || isVerified) return;
    
    const checkVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Verify if the user exists, has the same email, and is email confirmed
        if (user && user.email === email && user.email_confirmed_at) {
          // Update the profile
          try {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ email_verified: true })
              .eq('id', user.id);
            
            if (updateError) {
              console.error("Failed to update profile verification status:", updateError);
            }
          } catch (error) {
            console.error("Error updating verification status:", error);
          }
          
          setIsVerified(true);
          toast.success("Email berhasil diverifikasi!");
          
          // Navigate to login with verified email
          setTimeout(() => {
            navigate("/auth/login", { 
              state: { 
                verifiedEmail: email,
                ...(invitationToken && { invitationToken }),
                ...(magicLinkToken && { magicLinkToken })
              }
            });
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };
    
    // Check immediately and then every 5 seconds
    checkVerification();
    const interval = setInterval(checkVerification, 5000);
    
    return () => clearInterval(interval);
  }, [email, invitationToken, magicLinkToken, navigate, isVerified]);

  if (!email) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="w-12 h-12 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center mx-auto mb-4">
          {isVerified ? <Check className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
        </div>
        <CardTitle className="text-center">
          {isVerified ? "Email Terverifikasi!" : "Cek Email Anda"}
        </CardTitle>
        <CardDescription className="text-center">
          {isVerified ? (
            "Email Anda telah berhasil diverifikasi. Anda akan segera dialihkan ke halaman login."
          ) : (
            <>
              Kami telah mengirimkan email verifikasi ke{" "}
              <span className="font-medium">{email}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isVerified && (
          <>
            <VerificationStatus isChecking={checkingVerification} />
            
            {/* Show info about joining organization if coming from invitation */}
            {isInvitation && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
                {magicLinkToken ? (
                  <p>
                    Setelah mengklik tautan verifikasi di email, Anda harus login terlebih dahulu, kemudian akan bergabung dengan organisasi
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

            <EmailTips showTip={showTip} />
          </>
        )}
        
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
