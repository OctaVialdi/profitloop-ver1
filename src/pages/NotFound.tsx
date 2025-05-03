
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailTips } from "@/components/auth/EmailTips";
import { supabase } from "@/integrations/supabase/client";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if this is an expired invitation link
  const isExpiredInvitation = 
    location.pathname.includes('join-organization') || 
    searchParams.has('token') || 
    location.hash.includes('error=access_denied') ||
    location.hash.includes('error_code=otp_expired');
  
  // Extract email from searchParams if available
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Search params:",
      Object.fromEntries([...searchParams]),
      "Hash:",
      location.hash,
      "Error code:",
      searchParams.get('error_code') || location.hash.split('error_code=')[1]?.split('&')[0],
      "Hostname:",
      window.location.hostname
    );
    
    // Perubahan utama: Jangan pindahkan user di domain app.profitloop.id
    // karena ini mungkin masalah domain, bukan masalah routing
    const isAppProfitloopDomain = window.location.hostname === 'app.profitloop.id';
    
    if (isAppProfitloopDomain) {
      console.log("User is on app.profitloop.id domain - not redirecting automatically");
      return; // Don't redirect, just show the Not Found page
    }
    
    // Jika ini adalah URL undangan tapi tidak diarahkan dengan benar
    if (isExpiredInvitation && token && !location.pathname.includes('/join-organization')) {
      // Redirect to the proper route
      navigate(`/join-organization?token=${token}&email=${encodeURIComponent(email || '')}`);
    }

    // Check auth session when hitting dashboard URLs
    if (location.pathname.includes('/dashboard')) {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // User is authenticated but hitting a 404 on dashboard - redirect to main dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // User is not authenticated and trying to access dashboard - redirect to login
          navigate("/auth/login", { replace: true });
        }
      };
      
      if (!isAppProfitloopDomain) {
        checkAuth();
      }
    }
  }, [location.pathname, searchParams, location.hash, isExpiredInvitation, navigate, email, token]);

  // Handle manual login attempt with the token
  const handleLoginAndJoin = () => {
    if (email && token) {
      navigate("/auth/login", { 
        state: { 
          email,
          magicLinkToken: token 
        }
      });
    } else {
      navigate("/auth/login");
    }
  };

  // Special case for app.profitloop.id domain
  if (window.location.hostname === 'app.profitloop.id') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Domain Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Terjadi masalah dengan domain app.profitloop.id. Aplikasi ini seharusnya tidak diakses melalui domain ini.
            </p>
            <p className="text-center text-sm text-gray-500">
              Path: {location.pathname}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => window.location.href = "/"} 
              variant="default"
            >
              Kembali ke Beranda
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isExpiredInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Link Undangan Kadaluarsa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Link undangan yang Anda klik telah kadaluarsa atau tidak valid.
            </p>
            {email && (
              <p className="text-center text-sm mb-6">
                Anda masih dapat bergabung dengan organisasi dengan login menggunakan email:{" "}
                <span className="font-semibold">{email}</span>
              </p>
            )}
            
            <EmailTips showTip={true} />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleLoginAndJoin} 
              className="w-full"
            >
              Login untuk Bergabung
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")} 
              className="w-full"
            >
              Kembali ke Beranda
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Halaman tidak ditemukan</p>
        <Button 
          onClick={() => navigate("/")}
          variant="default"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
