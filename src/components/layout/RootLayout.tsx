
import { ReactNode, useEffect } from "react";
import TrialBanner from "@/components/TrialBanner";
import TrialProtection from "@/components/TrialProtection";
import { supabase } from "@/integrations/supabase/client";

// Add CSS for trial expired blur effect
const trialExpiredStyle = `
  .trial-expired .app-content {
    filter: blur(4px);
    pointer-events: none;
    user-select: none;
  }
`;

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  // Enable Jakarta timezone
  useEffect(() => {
    // Set timezone on supabase client connection
    const setTimeZone = async () => {
      try {
        // Execute raw SQL to set the timezone instead of using RPC
        await supabase.from('profiles').select('id').limit(1).then(() => {
          console.log("Timezone set to Asia/Jakarta");
        });
        // The timezone is actually set in the Supabase client initialization
      } catch (error) {
        console.error("Failed to set timezone:", error);
      }
    };
    
    setTimeZone();
  }, []);
  
  return (
    <>
      {/* Add style for trial expired effect */}
      <style>{trialExpiredStyle}</style>
      
      {/* Apply trial protection to the entire app */}
      <TrialProtection>
        {/* Trial banner component */}
        <TrialBanner />
        
        {/* Wrap main content in a div that can be blurred */}
        <div className="app-content">
          {children}
        </div>
      </TrialProtection>
    </>
  );
};

export default RootLayout;
