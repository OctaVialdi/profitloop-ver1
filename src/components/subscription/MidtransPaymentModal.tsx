
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MidtransPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl: string;
  planName: string;
}

export function MidtransPaymentModal({ 
  isOpen, 
  onClose, 
  redirectUrl,
  planName
}: MidtransPaymentModalProps) {
  useEffect(() => {
    if (isOpen && redirectUrl) {
      // We'll automatically redirect after a short delay
      const timer = setTimeout(() => {
        handleRedirect();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, redirectUrl]);

  const handleRedirect = () => {
    if (!redirectUrl) {
      toast.error("URL pembayaran tidak tersedia");
      onClose();
      return;
    }
    
    // Redirect to Midtrans payment page
    window.location.href = redirectUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran {planName}</DialogTitle>
          <DialogDescription>
            Mengalihkan ke halaman pembayaran Midtrans...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Mengalihkan ke halaman pembayaran</p>
            <p className="text-xs text-gray-400">Mohon tunggu sebentar</p>
          </div>
          
          <Button onClick={handleRedirect} className="mt-6">
            <ExternalLink className="mr-2 h-4 w-4" />
            Buka Halaman Pembayaran Sekarang
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batalkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
