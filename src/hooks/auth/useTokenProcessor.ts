
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useTokenProcessor() {
  const navigate = useNavigate();

  // Check user organization status and navigate accordingly
  const processUserAuth = async (userId: string) => {
    try {
      // Check if user's profile exists and get relevant data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email_verified, organization_id, has_seen_welcome')
        .eq('id', userId)
        .maybeSingle();
          
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
        if (!profileData.has_seen_welcome) {
          // Use replace: true to prevent back navigation to login page
          navigate("/employee-welcome", { replace: true });
        } else {
          // Use replace: true to prevent back navigation to login page
          navigate("/dashboard", { replace: true });
        }
        return true;
      } else {
        // Always redirect to organizations if user doesn't have organization
        // Use replace: true to prevent back navigation to login page
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
