
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { EmailTips, SpamFolderAlert } from "@/components/auth/EmailTips";
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
  const [emailParts, setEmailParts] = useState<{provider: string, domain: string} | null>(null);
  const [showProviderLink, setShowProviderLink] = useState(false);

  // If no email is provided, redirect to login
  useEffect(() => {
    if (!email) {
      navigate("/auth/login");
    } else {
      // Extract email provider information for provider-specific tips
      const parts = email.split('@');
      if (parts.length === 2) {
        const domain = parts[1];
        let provider = 'default';
        
        if (domain.includes('gmail')) provider = 'gmail';
        else if (domain.includes('yahoo')) provider = 'yahoo';
        else if (domain.includes('outlook') || domain.includes('hotmail')) provider = 'outlook';
        
        setEmailParts({provider, domain});
        
        // Show provider link after 3 seconds
        setTimeout(() => setShowProviderLink(true), 3000);
      }
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
    
    console.log("Setting up verification status check for:", email);
    
    const checkVerification = async () => {
      try {
        console.log("Checking verification status...");
        const { data: { user } } = await supabase.auth.getUser();
        
        // Verify if the user exists, has the same email, and is email confirmed
        if (user && user.email === email && user.email_confirmed_at) {
          console.log("Email verified! User:", user);
          
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

  const getEmailLink = () => {
    if (!emailParts) return null;
    
    switch (emailParts.provider) {
      case 'gmail': 
        return 'https://mail.google.com';
      case 'yahoo': 
        return 'https://mail.yahoo.com';
      case 'outlook': 
        return 'https://outlook.live.com/mail';
      default:
        return null;
    }
  };

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
            <SpamFolderAlert />
            
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
            
            {showProviderLink && getEmailLink() && (
              <div className="text-center my-4">
                <Button variant="outline" className="w-full" onClick={() => window.open(getEmailLink(), '_blank')}>
                  <Mail className="mr-2 h-4 w-4" />
                  Buka {emailParts?.provider.charAt(0).toUpperCase() + emailParts?.provider.slice(1)}
                </Button>
                <p className="text-xs text-gray-500 mt-1">Klik untuk membuka email Anda di tab baru</p>
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

            <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Masalah umum dengan verifikasi email:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Email masuk ke folder spam/junk</li>
                    <li>Server email menolak pesan (coba email lain jika berlanjut)</li>
                    <li>Alamat email salah ketik</li>
                  </ul>
                </div>
              </div>
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
