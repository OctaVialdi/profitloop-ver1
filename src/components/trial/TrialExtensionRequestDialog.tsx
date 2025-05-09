
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { requestTrialExtension } from '@/utils/subscriptionUtils';
import { useOrganization } from '@/hooks/useOrganization';
import { HelpCircle } from 'lucide-react';

interface TrialExtensionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestSuccess?: () => void;
}

const TrialExtensionRequestDialog: React.FC<TrialExtensionRequestDialogProps> = ({ 
  open, 
  onOpenChange,
  onRequestSuccess
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization, refreshData } = useOrganization();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Silakan berikan alasan untuk perpanjangan trial");
      return;
    }

    if (!organization) {
      toast.error("Data organisasi tidak tersedia");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestTrialExtension(organization.id, reason);
      
      if (result.success) {
        toast.success(result.message);
        setReason('');
        onOpenChange(false);
        await refreshData();
        if (onRequestSuccess) onRequestSuccess();
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
            Berikan alasan mengapa Anda membutuhkan perpanjangan masa trial. 
            Tim kami akan meninjau permintaan Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Contoh: Kami membutuhkan waktu tambahan untuk mengevaluasi fitur XYZ karena..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px]"
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
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrialExtensionRequestDialog;
