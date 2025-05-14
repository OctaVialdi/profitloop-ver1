
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useTokenProcessor() {
  const navigate = useNavigate();

  // Check user organization status and navigate accordingly
  const processUserAuth = async (userId: string) => {
    try {
      console.log("Processing user auth for ID:", userId);
      
      // Check if user's profile exists and get relevant data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email_verified, organization_id, has_seen_welcome')
        .eq('id', userId)
        .maybeSingle();
          
      console.log("Profile data:", profileData);
      
      // Follow the authentication flow according to the flowchart
      if (profileData && !profileData.email_verified) {
        // Email not verified in our database, update the flag
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', userId);
        
        if (updateError) {
          console.error("Error updating email verification status:", updateError);
        }
      }
        
      // Check if user has organization and follow the flow chart
      if (profileData?.organization_id) {
        console.log("User has organization, redirecting based on welcome status");
        
        if (!profileData.has_seen_welcome) {
          navigate("/employee-welcome", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return true;
      } else {
        console.log("User has no organization, redirecting to organizations page");
        
        // Always redirect to organizations if user doesn't have organization
        navigate("/organizations", { replace: true });
        return true;
      }
    } catch (error) {
      console.error("Error processing user authentication:", error);
      return false;
    }
  };

  return { processUserAuth };
}
