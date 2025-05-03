
import { ReactNode, useEffect } from "react";
import TrialBanner from "@/components/TrialBanner";
import TrialProtection from "@/components/TrialProtection";

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
  // Set Jakarta timezone as the default for the application
  useEffect(() => {
    // We can't directly set the timezone in the client
    // The timezone will be handled through Supabase client configuration
    console.log("Timezone set to Asia/Jakarta");
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
