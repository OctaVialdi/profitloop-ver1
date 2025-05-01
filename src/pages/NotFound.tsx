
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if this is an expired invitation link
  const isExpiredInvitation = 
    location.pathname.includes('join-organization') || 
    searchParams.has('token') || 
    location.hash.includes('error=access_denied');
  
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
      location.hash
    );
    
    // If this is an invitation URL with error, redirect to the MagicLinkJoin component
    if (isExpiredInvitation && token) {
      navigate(`/join-organization?token=${token}&email=${encodeURIComponent(email || '')}`);
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
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
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
