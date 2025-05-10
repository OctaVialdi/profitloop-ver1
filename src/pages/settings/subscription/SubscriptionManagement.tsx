
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { useOrganization } from '@/hooks/useOrganization';
import { Check, ChevronRight, ArrowRight, BarChart, Loader2 } from 'lucide-react';
import { stripeService } from '@/services/stripeService';
import PaymentMethodOptions from './PaymentMethodOptions';
import { formatCurrency } from '@/utils/formatUtils';

type PaymentMethod = 'card' | 'id_bank_transfer' | 'qris' | 'ovo' | 'dana' | 'gopay';

interface ProrationData {
  amountDue: number;
  credit: number; 
  newAmount: number;
  daysLeft: number;
  totalDaysInPeriod: number;
  prorationDate: string | Date;
}

const SubscriptionManagement = () => {
  const { organization, subscriptionPlan, refreshData, hasPaidSubscription } = useOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [targetPlanId, setTargetPlanId] = useState<string | null>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [prorationData, setProrationData] = useState<ProrationData | null>(null);
  const [showProrateConfirm, setShowProrateConfirm] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>(['card']);

  // Get plans and current subscription status
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await stripeService.fetchSubscriptionPlans();
        
        if (error) {
          toast.error("Gagal memuat data paket berlangganan");
          console.error(error);
          return;
        }
        
        if (data) {
          // Sort plans by price
          const sortedPlans = [...data].sort((a, b) => a.price - b.price);
          setAvailablePlans(sortedPlans);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        toast.error("Gagal memuat data paket berlangganan");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Function to handle plan change/upgrade
  const handlePlanChange = async (newPlanId: string) => {
    if (!organization || !organization.subscription_plan_id) {
      toast.error("Data organisasi atau paket berlangganan tidak ditemukan");
      return;
    }
    
    // Don't do anything if trying to change to the same plan
    if (newPlanId === organization.subscription_plan_id) {
      toast.info("Anda sudah menggunakan paket ini");
      return;
    }
    
    setTargetPlanId(newPlanId);
    setIsLoading(true);
    
    try {
      // Calculate proration data
      const prorationInfo = await stripeService.getProratedCalculation(
        newPlanId,
        organization.subscription_plan_id
      );
      
      if (!prorationInfo) {
        toast.error("Gagal menghitung prorate. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }
      
      setProrationData(prorationInfo);
      setShowProrateConfirm(true);
    } catch (error) {
      console.error("Error calculating proration:", error);
      toast.error("Gagal menghitung prorata. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to execute the plan change after confirmation
  const executePlanChange = async () => {
    if (!targetPlanId || !organization?.subscription_plan_id) return;

    setIsUpgrading(true);
    setShowProrateConfirm(false);
    
    try {
      // Create prorate checkout using the selected payment methods
      const checkoutUrl = await stripeService.createProratedCheckout(
        targetPlanId,
        organization.subscription_plan_id,
        organization.subscription_id,
        selectedPaymentMethods
      );
      
      if (!checkoutUrl) {
        toast.error("Gagal membuat sesi checkout. Silakan coba lagi.");
        return;
      }
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error processing plan change:", error);
      toast.error("Gagal memproses perubahan paket. Silakan coba lagi.");
    } finally {
      setIsUpgrading(false);
    }
  };

  // Function to close the prorate confirmation dialog
  const handleCancelProrateDialog = () => {
    setShowProrateConfirm(false);
    setTargetPlanId(null);
    setProrationData(null);
  };
  
  // Handle payment method selection change
  const handlePaymentMethodChange = (methods: PaymentMethod[]) => {
    setSelectedPaymentMethods(methods);
  };

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get current plan info
  const currentPlan = availablePlans.find(p => p.id === organization?.subscription_plan_id);
  // Get target plan info
  const targetPlan = targetPlanId ? availablePlans.find(p => p.id === targetPlanId) : null;

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Kelola Paket Langganan</h1>
        <p className="text-muted-foreground">
          Upgrade atau downgrade paket langganan Anda dengan prorate otomatis
        </p>
      </div>
      
      {/* Current Subscription */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle>Paket Anda Saat Ini</CardTitle>
          <CardDescription>
            {currentPlan ? `Paket ${currentPlan.name} - ${formatCurrency(currentPlan.price, 'IDR', 'id-ID')}/bulan` : 'Tidak ada paket aktif'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organization?.subscription_id ? (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600 flex items-center">
                  <Check size={16} className="mr-1" /> Aktif
                </span>
              </div>
              
              {organization.subscription_end_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Perpanjangan berikutnya:</span>
                  <span>{formatDateDisplay(organization.subscription_end_date)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Pelanggan:</span>
                <span className="font-mono text-xs">{organization.stripe_customer_id || 'N/A'}</span>
              </div>
              
              {organization.subscription_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Langganan:</span>
                  <span className="font-mono text-xs">{organization.subscription_id}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Tidak ada informasi langganan</p>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => stripeService.createPortalSession().then(url => {
              if (url) window.location.href = url;
            })}
            disabled={!organization?.stripe_customer_id}
          >
            Portal Pelanggan Stripe
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Available Plans for Upgrade/Downgrade */}
      <div className="space-y-3">
        <h2 className="text-xl font-medium">Pilih Paket Baru</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Perubahan paket akan di-prorata hingga akhir periode langganan saat ini
        </p>
        
        <div className="grid gap-4 md:grid-cols-3">
          {availablePlans.map((plan) => {
            const isCurrent = plan.id === organization?.subscription_plan_id;
            
            return (
              <Card key={plan.id} className={`${isCurrent ? 'border-primary bg-primary/5' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    {isCurrent && (
                      <span className="bg-primary text-primary-foreground text-xs py-1 px-2 rounded">
                        Paket Saat Ini
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-lg font-bold">
                    {formatCurrency(plan.price, 'IDR', 'id-ID')}/bulan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check size={16} className="mr-2 text-green-500" />
                      Hingga {plan.max_members} anggota
                    </li>
                    {plan.features && Object.entries(plan.features).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <Check size={16} className="mr-2 text-green-500" />
                        {key === 'storage' ? `${value} penyimpanan` : String(value)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isCurrent ? "outline" : "default"}
                    className="w-full"
                    disabled={isCurrent || isUpgrading}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {isCurrent ? 'Paket Saat Ini' : 'Pilih Paket'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* Proration Confirmation Dialog */}
      <Dialog open={showProrateConfirm} onOpenChange={setShowProrateConfirm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan Paket</DialogTitle>
            <DialogDescription>
              Langganan Anda akan di-prorata. Berikut adalah rinciannya.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Proration Details */}
            {prorationData && (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Dari: {currentPlan?.name || ''}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(currentPlan?.price || 0, 'IDR', 'id-ID')}/bulan</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Ke: {targetPlan?.name || ''}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(targetPlan?.price || 0, 'IDR', 'id-ID')}/bulan</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center">
                      <BarChart size={16} className="mr-2" />
                      Rincian Prorate
                    </h3>
                    
                    <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Sisa hari periode saat ini:</span>
                        <span>{prorationData.daysLeft} dari {prorationData.totalDaysInPeriod} hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kredit dari paket saat ini:</span>
                        <span className="text-green-600">-{formatCurrency(prorationData.credit || 0, 'IDR', 'id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Biaya paket baru (prorata):</span>
                        <span>{formatCurrency(prorationData.newAmount || 0, 'IDR', 'id-ID')}</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between font-medium">
                        <span>Total yang perlu dibayar:</span>
                        <span>{formatCurrency(prorationData.amountDue || 0, 'IDR', 'id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Options */}
                <PaymentMethodOptions onSelectionChange={handlePaymentMethodChange} />
              </>
            )}
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={handleCancelProrateDialog} disabled={isUpgrading}>
              Batal
            </Button>
            <Button onClick={executePlanChange} disabled={isUpgrading}>
              {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUpgrading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagement;
