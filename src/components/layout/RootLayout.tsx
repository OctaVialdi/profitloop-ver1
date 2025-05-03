
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
        // Using the correct method to call an RPC function
        await supabase.rpc('set_config', {
          parameter: 'timezone',
          value: 'Asia/Jakarta',
          is_local: false
        });
        console.log("Timezone set to Asia/Jakarta");
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
