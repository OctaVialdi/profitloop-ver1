
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { midtransService } from "@/services/midtransService";

interface MidtransPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  fallbackUrl: string;
  planName: string;
}

export function MidtransPaymentModal({ 
  isOpen, 
  onClose, 
  token, 
  fallbackUrl,
  planName
}: MidtransPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && token) {
      setIsLoading(true);
      setError(null);

      // Load Midtrans Snap library if needed
      midtransService.loadSnapLibrary()
        .then(() => {
          // Try to open Snap payment page within the modal
          try {
            if (window.snap) {
              // Set a slight delay to ensure the modal is rendered
              setTimeout(() => {
                window.snap!.pay(token, {
                  onSuccess: function(result){
                    console.log("Payment success!", result);
                    window.location.href = `/settings/subscription?success=true&order_id=${result.order_id}`;
                  },
                  onPending: function(result){
                    console.log("Payment pending", result);
                    window.location.href = `/settings/subscription?pending=true&order_id=${result.order_id}`;
                  },
                  onError: function(result){
                    console.log("Payment failed!", result);
                    setError("Pembayaran gagal. Silakan coba lagi.");
                    setIsLoading(false);
                  },
                  onClose: function(){
                    console.log("Customer closed the payment window");
                    onClose();
                  }
                });
                setIsLoading(false);
              }, 500);
            } else {
              throw new Error("Midtrans Snap not loaded");
            }
          } catch (error) {
            console.error("Failed to open Snap payment:", error);
            setError("Gagal membuka halaman pembayaran Midtrans.");
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error("Failed to load Midtrans library:", err);
          setError("Gagal memuat library pembayaran. Silakan coba membuka halaman pembayaran langsung.");
          setIsLoading(false);
        });
    }
  }, [isOpen, token, onClose]);

  const handleRedirect = () => {
    window.location.href = fallbackUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran {planName}</DialogTitle>
          <DialogDescription>
            Proses pembayaran dengan metode yang Anda pilih.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          {isLoading && (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-500">Memuat halaman pembayaran...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center space-y-4">
              <p className="text-red-500">{error}</p>
              <Button onClick={handleRedirect}>
                Buka Halaman Pembayaran Langsung
              </Button>
            </div>
          )}
        </div>
        
        {(isLoading || error) && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Batalkan
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
