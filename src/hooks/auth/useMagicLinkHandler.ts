
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useMagicLinkHandler() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const processMagicLinkToken = async (userId: string, magicLinkToken: string) => {
    try {
      setIsProcessing(true);
      console.log("Processing magic link token after login:", magicLinkToken);
      
      const { data: joinResult, error: joinError } = await supabase.rpc(
        'process_magic_link_invitation',
        { 
          invitation_token: magicLinkToken,
          user_id: userId
        }
      );
      
      if (joinError) {
        console.error("Error joining with magic link token:", joinError);
        throw joinError;
      }
      
      // Handle result as an object
      const result = joinResult as { 
        success: boolean, 
        message: string, 
        organization_id?: string, 
        role?: string 
      };
      
      if (result.success) {
        // Get organization name
        let organizationName = "organization";
        if (result.organization_id) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', result.organization_id)
            .maybeSingle();
            
          if (orgData && orgData.name) {
            organizationName = orgData.name;
          }
        }
        
        toast.success("Berhasil bergabung dengan organisasi!");
        navigate("/employee-welcome", { 
          state: { 
            organizationName,
            role: result.role || "employee"
          }
        });
        return true;
      } else {
        throw new Error(result.message || "Gagal bergabung dengan organisasi");
      }
    } catch (err: any) {
      console.error("Error joining organization:", err);
      toast.error(err.message || "Gagal bergabung dengan organisasi");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processInvitationToken = async (userId: string, invitationToken: string) => {
    try {
      setIsProcessing(true);
      const { data: joinResult, error: joinError } = await supabase
        .rpc('join_organization', { 
          user_id: userId, 
          invitation_token: invitationToken 
        });
      
      if (joinError) {
        throw joinError;
      }
      
      if (joinResult && Array.isArray(joinResult) && joinResult[0] && joinResult[0].success) {
        toast.success("Berhasil bergabung dengan organisasi!");
        navigate("/employee-welcome");
        return true;
      } else {
        throw new Error("Gagal bergabung dengan organisasi");
      }
    } catch (joinErr: any) {
      console.error("Error joining organization:", joinErr);
      toast.error(joinErr.message || "Gagal bergabung dengan organisasi");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processMagicLinkToken,
    processInvitationToken,
    isProcessing
  };
}
