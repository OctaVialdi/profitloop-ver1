
import { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, AlertTriangle, Loader2, Calendar
} from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { stripeService } from "@/services/stripeService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";

export const SubscriptionOverview = () => {
  const navigate = useNavigate();
  const { organization, refreshData } = useOrganization();
  const { isTrialActive, daysLeftInTrial, progress, isTrialExpired } = 
    useTrialStatus(organization?.id || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Enhanced effect for payment status handling
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');
    
    const handlePaymentStatus = async () => {
      if (success === 'true' && sessionId) {
        // Verify payment status with the backend
        const paymentStatus = await stripeService.verifyPaymentStatus(sessionId);
        
        if (paymentStatus.success) {
          toast.success('Pembayaran berhasil! Langganan Anda telah diaktifkan.');
        } else {
          toast.warning('Pembayaran sedang diproses. Status akan diperbarui segera.');
        }
        
        // Refresh organization data
        await refreshData();
        
        // Track payment status
        subscriptionAnalyticsService.trackEvent({
          eventType: 'payment_status',
          organizationId: organization?.id,
          additionalData: { 
            status: paymentStatus.success ? 'success' : 'processing',
            source: 'stripe_redirect',
            sessionId
          }
        });
      } else if (canceled === 'true') {
        toast.error('Pembayaran dibatalkan. Silakan coba lagi jika Anda ingin berlangganan.');
        
        // Track canceled payment
        subscriptionAnalyticsService.trackEvent({
          eventType: 'payment_status',
          organizationId: organization?.id,
          additionalData: { 
            status: 'canceled',
            source: 'stripe_redirect'
          }
        });
      }
    };
    
    if (success === 'true' || canceled === 'true') {
      handlePaymentStatus();
    }
  }, [searchParams, organization?.id, refreshData]);

  const handleManageSubscription = async () => {
    try {
      setIsSubmitting(true);
      const portalUrl = await stripeService.createPortalSession();
      
      if (portalUrl) {
        // Track portal access
        subscriptionAnalyticsService.trackEvent({
          eventType: 'customer_portal_access',
          organizationId: organization?.id
        });
        
        // Redirect to Stripe Customer Portal
        window.location.href = portalUrl;
      } else {
        throw new Error("Failed to create customer portal session");
      }
    } catch (error) {
      console.error("Error accessing customer portal:", error);
      toast.error("Gagal mengakses portal pelanggan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define plans for reference
  const plans = [
    { id: "basic_plan", name: "Basic" },
    { id: "standard_plan", name: "Standard" },
    { id: "premium_plan", name: "Premium" },
  ];

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Status Langganan
            </CardTitle>
            
            {organization?.subscription_status === 'active' && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Aktif
              </Badge>
            )}
            
            {isTrialActive && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Trial
              </Badge>
            )}
            
            {isTrialExpired && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                Trial Berakhir
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          {isTrialActive && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Mode Trial {organization?.subscription_plan_id ? `(${plans.find(p => p.id === organization.subscription_plan_id)?.name || 'Basic'})` : ''}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Trial Anda berakhir dalam {daysLeftInTrial} hari
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate('/settings/subscription/request-extension')}
                  >
                    Minta Perpanjangan
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0 hari</span>
                  <span>14 hari</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}
          
          {organization?.subscription_status === 'active' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {plans.find(p => p.id === organization.subscription_plan_id)?.name || 'Paket Tidak Diketahui'}
                </h3>
                <p className="text-sm text-gray-600">
                  Aktif | Diperpanjang otomatis setiap bulan
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleManageSubscription}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Memproses...
                  </>
                ) : 'Kelola Metode Pembayaran'}
              </Button>
            </div>
          )}
          
          {isTrialExpired && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">
                    Trial Anda Telah Berakhir
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pilih paket di bawah untuk melanjutkan menggunakan layanan
                  </p>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/settings/subscription/request-extension')}
              >
                Minta Perpanjangan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Payment status alert */}
      {location.search.includes('success=true') && (
        <Alert className="mb-8 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Pembayaran Berhasil</AlertTitle>
          <AlertDescription className="text-green-700">
            Terima kasih! Langganan Anda telah berhasil diaktifkan. Anda sekarang memiliki akses ke semua fitur premium.
          </AlertDescription>
        </Alert>
      )}
      
      {location.search.includes('canceled=true') && (
        <Alert className="mb-8 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Pembayaran Dibatalkan</AlertTitle>
          <AlertDescription className="text-amber-700">
            Proses pembayaran telah dibatalkan. Anda dapat mencoba kembali kapan saja dengan memilih paket yang diinginkan.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Trial information */}
      {!isTrialExpired && !isTrialActive && !organization?.subscription_plan_id && (
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Calendar className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-700">Trial 14 Hari Gratis</AlertTitle>
          <AlertDescription className="text-blue-700">
            Mulai trial 14 hari gratis dan akses semua fitur premium. Tidak ada kartu kredit yang diperlukan.
          </AlertDescription>
          <div className="mt-2">
            <Button 
              className="bg-blue-700 hover:bg-blue-800" 
              onClick={async () => {
                try {
                  if (!organization?.id) return;
                  
                  // Track trial start
                  subscriptionAnalyticsService.trackTrialStarted(organization.id);
                  
                  // Set trial start date to now and end date to 14 days later
                  const trialStartDate = new Date();
                  const trialEndDate = new Date();
                  trialEndDate.setDate(trialEndDate.getDate() + 14);
                  
                  const { error } = await supabase
                    .from('organizations')
                    .update({
                      trial_start_date: trialStartDate.toISOString(),
                      trial_end_date: trialEndDate.toISOString(),
                      trial_expired: false,
                      subscription_status: 'trial'
                    })
                    .eq('id', organization.id);
                    
                  if (error) throw error;
                  
                  toast.success("Trial 14 hari berhasil dimulai!");
                  refreshData();
                } catch (error) {
                  console.error("Error starting trial:", error);
                  toast.error("Gagal memulai trial");
                }
              }}
            >
              Mulai Trial Sekarang
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
};
