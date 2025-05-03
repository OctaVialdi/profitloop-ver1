
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this might be a magic link with a different format
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");
    
    // If it has token and email parameters, it's likely a magic link
    if (token && email) {
      console.log("Detected possible magic link parameters, redirecting to /join-organization");
      navigate(`/join-organization?token=${token}&email=${email}`);
    }
    
    // Check if the current path might be a magic link hash fragment
    if (location.hash && location.hash.includes("access_token")) {
      console.log("Detected access token in URL hash, redirecting to /join-organization");
      navigate(`/join-organization${location.search}${location.hash}`);
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Halaman tidak ditemukan</p>
        <Button 
          onClick={() => navigate("/login")}
          variant="default"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
