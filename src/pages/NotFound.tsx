import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Enhanced magic link detection
    // Check if this might be a magic link with different formats
    console.log("NotFound: Current URL:", window.location.href);
    console.log("NotFound: Search params:", location.search);
    console.log("NotFound: Hash:", location.hash);
    
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");
    
    // If it has token and email parameters, it's likely a magic link
    if (token && email) {
      console.log("Detected possible magic link parameters, redirecting to /join-organization");
      // Preserve the original query parameters and hash
      navigate(`/join-organization${location.search}${location.hash}`);
      return;
    }
    
    // Check if the hash fragment contains access_token (from Supabase auth)
    if (location.hash && location.hash.includes("access_token")) {
      // Parse hash params
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      
      if (accessToken) {
        console.log("Detected access token in URL hash, redirecting to /join-organization");
        // Keep all parameters intact
        navigate(`/join-organization${location.search}${location.hash}`);
        return;
      }
    }
    
    // Check if this is a type=invite link
    if (url.searchParams.get("type") === "invite") {
      console.log("Detected Supabase invitation link, redirecting to /join-organization");
      navigate(`/join-organization${location.search}${location.hash}`);
      return;
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Halaman tidak ditemukan</p>
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
