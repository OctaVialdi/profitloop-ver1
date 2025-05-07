
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Enhanced magic link detection - handle more complex URL patterns
    console.log("NotFound: Current URL:", window.location.href);
    console.log("NotFound: Path:", location.pathname);
    console.log("NotFound: Search params:", location.search);
    console.log("NotFound: Hash:", location.hash);
    
    try {
      const url = new URL(window.location.href);
      const path = location.pathname;
      
      // Handle domains - check if we're on profitloop.id vs app.profitloop.id
      const hostname = window.location.hostname;
      console.log("Current hostname:", hostname);
      
      // Special handling for job application preview routes - handle them more precisely
      if (path.match(/^\/apply\/preview\/[^\/]+$/)) {
        console.log("Job application preview path detected:", path);
        const token = path.split('/apply/preview/')[1];
        console.log("Extracted preview token:", token);
        
        if (token) {
          console.log("Redirecting to job preview with token:", token);
          navigate(`/apply/preview/${token}`, { replace: true });
          return;
        }
      }
      
      // Special handling for job application routes
      else if (path.match(/^\/apply\/[^\/]+$/)) {
        console.log("Job application path detected:", path);
        const token = path.split('/apply/')[1];
        console.log("Extracted token:", token);
        
        if (token) {
          console.log("Redirecting to job application with token:", token);
          navigate(`/apply/${token}`, { replace: true });
          return;
        }
      }
      
      // Handle URL query parameters for token and email
      const token = url.searchParams.get("token");
      const email = url.searchParams.get("email");
      
      // Check hash params for Supabase auth tokens
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type") || url.searchParams.get("type");
      
      // For debugging
      console.log("Magic link detection params:", { token, email, accessToken, refreshToken, type });
      
      // If there are auth tokens or invite tokens, assume this is a magic link
      if (
        (token && email) || 
        (accessToken && refreshToken) || 
        type === "invite" || 
        type === "recovery" ||
        (location.hash && location.hash.includes("access_token"))
      ) {
        console.log("Detected magic link parameters, redirecting to /join-organization");
        // Preserve all parameters
        navigate(`/join-organization${location.search}${location.hash}`, { replace: true });
        return;
      }
      
      // Added fallback for email verification links 
      const errorCode = url.searchParams.get("error_code");
      const errorDescription = url.searchParams.get("error_description");
      
      if (errorCode || errorDescription) {
        console.log("Detected error parameters, likely from auth verification");
        navigate(`/join-organization${location.search}${location.hash}`, { replace: true });
        return;
      }
    } catch (error) {
      console.error("Error processing URL in NotFound:", error);
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
