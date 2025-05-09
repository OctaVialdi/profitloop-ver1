
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useOrganization } from "@/hooks/useOrganization";
import { requestTrialExtension } from "@/utils/subscriptionUtils";
import { HelpCircle } from "lucide-react";

interface TrialExtensionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessfulRequest?: () => void;
}

const TrialExtensionRequestDialog: React.FC<TrialExtensionRequestDialogProps> = ({
  open,
  onOpenChange,
  onSuccessfulRequest
}) => {
  const [extensionReason, setExtensionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useOrganization();

  const handleRequestExtension = async () => {
    if (!organization?.id || !extensionReason.trim()) {
      toast.error("Alasan perpanjangan trial harus diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestTrialExtension(
        organization.id,
        extensionReason
      );

      if (result.success) {
        toast.success(result.message);
        setExtensionReason("");
        onOpenChange(false);
        if (onSuccessfulRequest) {
          onSuccessfulRequest();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      toast.error("Gagal mengirim permintaan perpanjangan trial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            Minta Perpanjangan Trial
          </DialogTitle>
          <DialogDescription>
            Ceritakan kepada kami mengapa Anda membutuhkan perpanjangan masa trial. 
            Tim kami akan segera meninjau permintaan Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Alasan permintaan perpanjangan trial..."
            className="min-h-[120px]"
            value={extensionReason}
            onChange={(e) => setExtensionReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleRequestExtension}
            disabled={isSubmitting || !extensionReason.trim()}
            className="bg-[#9b87f5] hover:bg-[#8a72f3]"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrialExtensionRequestDialog;
