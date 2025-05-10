
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { midtransService } from "@/services/midtransService";
import { toast } from "sonner";

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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    if (isOpen && token) {
      setIsLoading(true);
      setError(null);

      const initializePayment = async () => {
        try {
          // Log that we're attempting to load the Midtrans library
          console.log("Initializing Midtrans payment...", { token, planName });
          
          // Load Midtrans Snap library
          await midtransService.loadSnapLibrary();
          
          // Ensure the component is still mounted
          if (!isMounted) return;
          
          // Try to open Snap payment page
          if (window.snap) {
            // Set a slight delay to ensure the modal is rendered
            setTimeout(() => {
              if (!isMounted) return;
              
              try {
                console.log("Opening Snap payment window...");
                window.snap!.pay(token, {
                  onSuccess: function(result){
                    console.log("Payment success!", result);
                    if (isMounted) {
                      toast.success("Pembayaran berhasil!");
                      window.location.href = `/settings/subscription?success=true&order_id=${result.order_id}`;
                    }
                  },
                  onPending: function(result){
                    console.log("Payment pending", result);
                    if (isMounted) {
                      toast.info("Pembayaran sedang diproses.");
                      window.location.href = `/settings/subscription?pending=true&order_id=${result.order_id}`;
                    }
                  },
                  onError: function(result){
                    console.error("Payment failed!", result);
                    if (isMounted) {
                      setError("Pembayaran gagal. Silakan coba lagi.");
                      setIsLoading(false);
                      toast.error("Pembayaran gagal.");
                    }
                  },
                  onClose: function(){
                    console.log("Customer closed the payment window");
                    if (isMounted) {
                      onClose();
                    }
                  }
                });
                setIsLoading(false);
              } catch (err) {
                console.error("Failed to open Snap payment:", err);
                if (isMounted) {
                  setError("Gagal membuka halaman pembayaran Midtrans.");
                  setIsLoading(false);
                }
              }
            }, 500);
          } else {
            if (isMounted) {
              throw new Error("Midtrans Snap tidak berhasil dimuat");
            }
          }
        } catch (err) {
          console.error("Failed to initialize payment:", err);
          if (isMounted) {
            // If we've retried less than 3 times, try again
            if (retryCount < 3) {
              console.log(`Retrying payment initialization (attempt ${retryCount + 1})...`);
              setRetryCount(prev => prev + 1);
              setTimeout(initializePayment, 1000); // Try again after 1 second
            } else {
              setError(`Gagal memuat sistem pembayaran. ${err instanceof Error ? err.message : 'Silakan coba membuka halaman pembayaran langsung.'}`);
              setIsLoading(false);
            }
          }
        }
      };
      
      initializePayment();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOpen, token, onClose, retryCount, planName]);

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
              <p className="text-xs text-gray-400">Mohon tunggu sebentar</p>
            </div>
          )}
          
          {error && (
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="text-red-500">{error}</p>
              </div>
              <Button onClick={handleRedirect} className="mt-4">
                <ExternalLink className="mr-2 h-4 w-4" />
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
