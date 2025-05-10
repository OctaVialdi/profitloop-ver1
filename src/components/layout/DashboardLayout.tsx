
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useOrganization } from "@/hooks/useOrganization";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { Sparkles } from "lucide-react";

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const { organization, isTrialActive, isTrialExpired } = useOrganization();
  const { initiateCheckout, isLoading } = useStripeCheckout();

  // Show subscription modal if trial expired and no active subscription
  useEffect(() => {
    const checkIfSubscriptionRequired = async () => {
      if (isTrialExpired && organization?.subscription_status !== 'active') {
        const lastShownTime = localStorage.getItem('subscription_modal_last_shown');
        const now = Date.now();
        
        // Show only if never shown before or if it's been more than 1 hour
        if (!lastShownTime || (now - parseInt(lastShownTime)) > 3600000) {
          setShowSubscribeModal(true);
          localStorage.setItem('subscription_modal_last_shown', now.toString());
        }
      }
    };
    
    checkIfSubscriptionRequired();
  }, [isTrialExpired, organization?.subscription_status]);

  const handleSubscribe = async (planId: string) => {
    await initiateCheckout(planId);
    setShowSubscribeModal(false);
  };

  return (
    <>
      {children || <Outlet />}
      <Toaster />
      
      {/* Trial Expired Subscription Modal */}
      <Dialog open={showSubscribeModal} onOpenChange={setShowSubscribeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Masa Trial Anda Telah Berakhir
            </DialogTitle>
            <DialogDescription>
              Untuk terus menggunakan semua fitur premium, silakan berlangganan salah satu paket kami.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Pilih Paket Langganan:</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">Standard</h5>
                    <span className="text-sm text-blue-600 font-semibold">Populer</span>
                  </div>
                  <p className="text-2xl font-bold">Rp299.000<span className="text-sm font-normal text-gray-500">/bulan</span></p>
                  <ul className="text-sm space-y-1 mt-2 text-gray-600">
                    <li>• Hingga 15 anggota</li>
                    <li>• Penyimpanan 10GB</li>
                    <li>• Priority support</li>
                  </ul>
                  <Button 
                    className="mt-auto" 
                    onClick={() => handleSubscribe('standard_plan')}
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Pilih Standard"}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 flex flex-col gap-2">
                  <h5 className="font-medium">Premium</h5>
                  <p className="text-2xl font-bold">Rp599.000<span className="text-sm font-normal text-gray-500">/bulan</span></p>
                  <ul className="text-sm space-y-1 mt-2 text-gray-600">
                    <li>• Anggota tidak terbatas</li>
                    <li>• Penyimpanan 50GB</li>
                    <li>• Support 24/7</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="mt-auto"
                    onClick={() => handleSubscribe('premium_plan')}
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Pilih Premium"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/settings/subscription'}
              className="order-2 sm:order-1"
            >
              Lihat Detail Paket
            </Button>
            
            {/* Allow closing only during trial or if there's an active subscription */}
            {(isTrialActive || organization?.subscription_status === 'active') && (
              <Button 
                variant="secondary" 
                onClick={() => setShowSubscribeModal(false)}
                className="order-1 sm:order-2"
              >
                Tutup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DashboardLayout;
