
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
      console.log("Magic link feature is no longer available");
      toast.error("Magic link invitations are no longer supported");
      return false;
    } catch (err: any) {
      console.error("Error processing magic link:", err);
      toast.error(err.message || "Gagal memproses magic link");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processInvitationToken = async (userId: string, invitationToken: string) => {
    try {
      setIsProcessing(true);
      console.log("Invitation feature is no longer available");
      toast.error("Invitations are no longer supported");
      return false;
    } catch (joinErr: any) {
      console.error("Error processing invitation:", joinErr);
      toast.error(joinErr.message || "Gagal memproses undangan");
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
