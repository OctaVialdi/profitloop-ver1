
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, HelpCircle } from "lucide-react";
import { requestTrialExtension } from "@/utils/subscriptionUtils";
import { useOrganization } from "@/hooks/useOrganization";
import { trackTrialEvent } from "@/services/analyticsService";

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
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { organization } = useOrganization();
  
  const handleSubmit = async () => {
    if (!reason.trim()) {
      setFormError("Silakan berikan alasan untuk permintaan perpanjangan trial");
      return;
    }
    
    if (!organization) {
      setFormError("Tidak dapat menemukan data organisasi Anda");
      return;
    }
    
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      // Track event before submission
      await trackTrialEvent('extension_request_started', organization.id, {
        reason_length: reason.length
      });
      
      // Send the request
      const result = await requestTrialExtension(organization.id, reason);
      
      if (result.success) {
        // Track successful submission
        await trackTrialEvent('extension_request_submitted', organization.id, { 
          reason_length: reason.length,
          success: true
        });
        
        // Reset form and close dialog
        setReason("");
        onOpenChange(false);
        
        // Notify parent component
        if (onSuccessfulRequest) {
          onSuccessfulRequest();
        }
      } else {
        setFormError(result.message || "Gagal mengirim permintaan perpanjangan trial");
        
        // Track failed submission
        await trackTrialEvent('extension_request_failed', organization.id, {
          reason_length: reason.length,
          error: result.message
        });
      }
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      setFormError("Terjadi kesalahan. Silakan coba lagi nanti.");
      
      // Track error
      if (organization) {
        await trackTrialEvent('extension_request_error', organization.id, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
            Minta Perpanjangan Trial
          </DialogTitle>
          <DialogDescription>
            Ceritakan kepada kami mengapa Anda membutuhkan waktu lebih lama untuk mencoba layanan kami.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Permintaan</Label>
            <Textarea
              id="reason"
              placeholder="Saya membutuhkan perpanjangan trial karena..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            {formError && (
              <p className="text-sm text-red-500 mt-1">{formError}</p>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-700">
            <p>Tim kami akan meninjau permintaan Anda dalam 1-2 hari kerja.</p>
          </div>
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
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className={`${isSubmitting ? 'opacity-80' : ''} trial-action-button`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Kirim Permintaan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrialExtensionRequestDialog;
