import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, AlertTriangle, CreditCard, Sparkles, Shield, Clock, Building, X, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TrialPersonalizedRecommendation } from "@/components/TrialPersonalizedRecommendation";

interface Plan {
  id: string;
  name: string;
  price: number;
  max_members: number | null;
  features: Record<string, any> | null;
  current: boolean;
  popular?: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  type: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'retail';
  isPopular: boolean;
}

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [extensionReason, setExtensionReason] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { organization, refreshData, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();
  
  // Indonesian payment methods
  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'midtrans_cc',
      name: 'Kartu Kredit/Debit', 
      logo: 'https://midtrans.com/assets/images/logo-midtrans-color.png', 
      type: 'credit_card',
      isPopular: true
    },
    { 
      id: 'xendit_va_bca',
      name: 'Bank Transfer BCA', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png', 
      type: 'bank_transfer',
      isPopular: true
    },
    { 
      id: 'xendit_va_mandiri',
      name: 'Bank Transfer Mandiri', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg', 
      type: 'bank_transfer',
      isPopular: false
    },
    { 
      id: 'xendit_va_bni',
      name: 'Bank Transfer BNI', 
      logo: 'https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg', 
      type: 'bank_transfer',
      isPopular: false
    },
    { 
      id: 'xendit_ovo',
      name: 'OVO', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png', 
      type: 'e_wallet',
      isPopular: true
    },
    { 
      id: 'xendit_dana',
      name: 'DANA', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg', 
      type: 'e_wallet',
      isPopular: false
    },
    { 
      id: 'xendit_gopay',
      name: 'GoPay', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png', 
      type: 'e_wallet',
      isPopular: true
    },
    { 
      id: 'xendit_alfamart',
      name: 'Alfamart', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_of_Alfamart.png', 
      type: 'retail',
      isPopular: false 
    }
  ];
  
  // Mock billing history for UI demonstration
  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: '1',
      date: new Date().toISOString(),
      plan: 'Standard',
      amount: 249000,
      status: 'paid'
    },
    {
      id: '2',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      plan: 'Basic',
      amount: 0,
      status: 'paid'
    }
  ]);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    setIsLoading(true);
    try {
      const { data: plansData, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;

      // Format plans with proper pricing and mark current plan
      if (plansData) {
        const formattedPlans: Plan[] = plansData.map(plan => ({
          ...plan,
          price: plan.price || 0,
          current: organization?.subscription_plan_id === plan.id,
          features: plan.features as Record<string, any> | null,
          popular: false
        }));

        // Sort by price
        formattedPlans.sort((a, b) => a.price - b.price);
        
        // Find the middle plan to mark as popular (if there are at least 3 plans)
        if (formattedPlans.length >= 3) {
          const middleIndex = Math.floor(formattedPlans.length / 2);
          formattedPlans[middleIndex] = {
            ...formattedPlans[middleIndex],
            popular: true
          };
        }

        setPlans(formattedPlans);
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("Gagal memuat data paket berlangganan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    // Set the selected plan and show payment methods
    setSelectedPlanId(planId);
    setShowPaymentMethods(true);
  };

  const handleProcessPayment = async () => {
    if (!organization || !selectedPlanId || !selectedPaymentMethod) {
      toast.error("Silakan pilih metode pembayaran");
      return;
    }
    
    // Get the plan details
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    
    if (!selectedPlan) {
      toast.error("Paket berlangganan tidak ditemukan");
      return;
    }
    
    setIsUpgrading(true);
    try {
      // Here we would integrate with the Indonesian payment gateway API
      // For this example, we'll simulate a successful payment
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update organization subscription plan
      const { error } = await supabase
        .from('organizations')
        .update({ 
          subscription_plan_id: selectedPlanId,
          // If moving to a paid plan, clear trial expiration data
          ...(selectedPlan.price > 0 ? {
            trial_expired: false,
            trial_end_date: null,
            subscription_status: 'active'
          } : {})
        })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      // Log the subscription change in audit logs
      await supabase
        .from('subscription_audit_logs')
        .insert({
          organization_id: organization.id,
          action: 'subscription_changed',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          data: {
            previous_plan_id: organization.subscription_plan_id,
            new_plan_id: selectedPlanId,
            payment_method: selectedPaymentMethod,
            amount: selectedPlan.price
          }
        });
      
      // Create notification for all organization admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('organization_id', organization.id)
        .in('role', ['super_admin', 'admin']);
        
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await supabase
            .from('notifications')
            .insert({
              user_id: admin.id,
              organization_id: organization.id,
              title: 'Paket Berlangganan Diperbarui',
              message: `Paket berlangganan organisasi Anda telah diubah ke ${selectedPlan.name}.`,
              type: 'success',
              action_url: '/settings/subscription'
            });
        }
      }
      
      // Track the upgrade event for analytics
      try {
        await supabase.functions.invoke('track-event', {
          body: {
            event_type: 'subscription_upgraded',
            organization_id: organization.id,
            plan_id: selectedPlanId,
            previous_plan_id: organization.subscription_plan_id,
            payment_method: selectedPaymentMethod
          }
        });
      } catch (err) {
        console.error("Failed to track upgrade event:", err);
      }
      
      toast.success(`Berlangganan paket ${selectedPlan.name} berhasil!`);
      setShowPaymentMethods(false);
      setSelectedPaymentMethod(null);
      await refreshData();
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Gagal berlangganan paket. Silakan coba lagi.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleStartTrial = async () => {
    if (!organization) return;
    
    setIsUpgrading(true);
    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial
      
      // Update organization trial data
      const { error } = await supabase
        .from('organizations')
        .update({ 
          trial_start_date: new Date().toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          trial_expired: false,
          subscription_status: 'trial'
        })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      // Log the trial start in audit logs
      await supabase
        .from('subscription_audit_logs')
        .insert({
          organization_id: organization.id,
          action: 'trial_started',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          data: {
            trial_start_date: new Date().toISOString(),
            trial_end_date: trialEndDate.toISOString()
          }
        });
      
      // Create notification for all organization admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('organization_id', organization.id)
        .in('role', ['super_admin', 'admin']);
        
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await supabase
            .from('notifications')
            .insert({
              user_id: admin.id,
              organization_id: organization.id,
              title: 'Periode Trial Dimulai',
              message: 'Periode trial 14 hari Anda telah dimulai. Nikmati semua fitur premium!',
              type: 'info',
              action_url: '/settings/subscription'
            });
        }
      }
      
      toast.success("Periode trial 14 hari berhasil dimulai!");
      await refreshData();
    } catch (error) {
      console.error("Error starting trial:", error);
      toast.error("Gagal memulai periode trial. Silakan coba lagi.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!organization || !organization.subscription_plan_id) return;
    
    // Get the basic plan
    const basicPlan = plans.find(p => p.name === "Basic");
    if (!basicPlan) {
      toast.error("Tidak dapat menemukan paket Basic");
      return;
    }
    
    setIsUpgrading(true);
    try {
      // Update organization subscription to Basic plan
      const { error } = await supabase
        .from('organizations')
        .update({ 
          subscription_plan_id: basicPlan.id
        })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      // Create notification for all organization admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('organization_id', organization.id)
        .in('role', ['super_admin', 'admin']);
        
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await supabase
            .from('notifications')
            .insert({
              user_id: admin.id,
              organization_id: organization.id,
              title: 'Langganan Dibatalkan',
              message: 'Langganan Anda telah dibatalkan. Anda sekarang menggunakan paket Basic.',
              type: 'warning',
              action_url: '/settings/subscription'
            });
        }
      }
      
      toast.success("Langganan berhasil dibatalkan. Anda sekarang menggunakan paket Basic.");
      await refreshData();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Gagal membatalkan langganan. Silakan coba lagi.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleRequestTrialExtension = async () => {
    if (!organization || !extensionReason.trim()) {
      toast.error("Alasan perpanjangan trial harus diisi");
      return;
    }
    
    setIsExtending(true);
    try {
      // Update organization with extension request
      const { error } = await supabase
        .from('organizations')
        .update({
          trial_extension_requested: true,
          trial_extension_reason: extensionReason
        })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      // Log the extension request in audit logs
      await supabase
        .from('subscription_audit_logs')
        .insert({
          organization_id: organization.id,
          action: 'trial_extension_requested',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          data: {
            reason: extensionReason,
            requested_at: new Date().toISOString()
          }
        });
      
      // Create notification for super admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'super_admin');
        
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await supabase
            .from('notifications')
            .insert({
              user_id: admin.id,
              organization_id: organization.id,
              title: 'Permintaan Perpanjangan Trial',
              message: `Organisasi ${organization.name} meminta perpanjangan masa trial dengan alasan: ${extensionReason}`,
              type: 'info'
            });
        }
      }
      
      toast.success("Permintaan perpanjangan trial telah dikirim");
      setExtensionReason("");
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      toast.error("Gagal mengirim permintaan perpanjangan trial");
    } finally {
      setIsExtending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          {isTrialActive && <Skeleton className="h-20 w-full mb-8" />}
          <Tabs defaultValue="plans">
            <TabsList className="mb-8">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24 ml-1" />
            </TabsList>
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get features for a plan
  const getPlanFeatures = (plan: Plan) => {
    const features = [];
    
    // Add max members feature
    features.push(`Hingga ${plan.max_members} anggota`);
    
    // Add other features from the plan's features object
    if (plan.features) {
      if (plan.features.storage) features.push(`Penyimpanan ${plan.features.storage}`);
      if (plan.features.api_calls) features.push(`${plan.features.api_calls} API calls/bulan`);
      
      // For Standard and above
      if (plan.price >= 249000) {
        features.push("Prioritas support");
        features.push("Kolaborasi antar organisasi");
      }
      
      // For Premium
      if (plan.price >= 499000) {
        features.push("Support 24/7");
        features.push("API akses");
        features.push("Keamanan tingkat lanjut");
      }
    }
    
    return features;
  };
  
  // Get appropriate action button for a plan
  const getPlanActionButton = (plan: Plan) => {
    // If this is the current plan
    if (plan.current) {
      return (
        <Button className="w-full" disabled>
          <Check className="mr-2 h-4 w-4" /> Paket Saat Ini
        </Button>
      );
    }
    
    // If this is the Basic plan (downgrade)
    if (plan.name === 'Basic' && hasPaidSubscription) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">Downgrade ke Basic</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Downgrade</AlertDialogTitle>
              <AlertDialogDescription>
                Anda yakin ingin downgrade ke paket Basic? Anda akan kehilangan akses ke fitur premium
                yang hanya tersedia di paket berbayar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleSubscribe(plan.id)}
                disabled={isUpgrading}
              >
                Ya, Downgrade
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    
    // For paid upgrades
    if (plan.price > 0) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.popular && <Sparkles className="mr-2 h-4 w-4" />}
              Berlangganan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Berlangganan</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan berlangganan paket {plan.name} dengan harga {formatPrice(plan.price)}/bulan.
                {organization?.trial_end_date && !organization.trial_expired && 
                  " Periode trial Anda akan diakhiri bila Anda melanjutkan."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleSubscribe(plan.id)}
                disabled={isUpgrading}
              >
                Ya, Berlangganan Sekarang
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    
    // Default action
    return (
      <Button 
        className="w-full" 
        variant={plan.popular ? "default" : "outline"}
        onClick={() => handleSubscribe(plan.id)}
        disabled={isUpgrading}
      >
        {isUpgrading ? "Memproses..." : "Pilih Paket"}
      </Button>
    );
  };

  const isTrialExpired = organization?.trial_expired && !organization?.subscription_plan_id;
  const currentPlan = plans.find(p => p.current);
  const isTrialExtensionRequested = organization?.trial_extension_requested;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600 mb-8">Manage your subscription plan and billing details</p>
        
        {isTrialActive && (
          <TrialPersonalizedRecommendation className="mb-8" />
        )}
        
        {currentPlan && (
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Status Berlangganan
                </div>
                {hasPaidSubscription && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Aktif
                  </Badge>
                )}
                {isTrialActive && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Trial
                  </Badge>
                )}
                {isTrialExpired && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Trial Berakhir
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                    {currentPlan.price > 0 && (
                      <span className="text-lg">{formatPrice(currentPlan.price)}/bulan</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mt-1">
                    {currentPlan.name === 'Basic' ? (
                      'Paket gratis dengan fitur terbatas'
                    ) : (
                      `Paket premium dengan ${currentPlan.max_members} anggota`
                    )}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  {hasPaidSubscription && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-red-600 border-red-200">
                          Batalkan Langganan
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Pembatalan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Anda yakin ingin membatalkan langganan paket {currentPlan.name}?
                            Anda akan kehilangan akses ke fitur premium dan hanya dapat menggunakan paket Basic.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Kembali</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleCancelSubscription}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ya, Batalkan Langganan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  
                  {isTrialActive && (
                    <div className="text-sm">
                      Trial berakhir dalam: <span className="font-bold">{daysLeftInTrial} hari</span>
                    </div>
                  )}
                  
                  {isTrialExpired && !organization?.subscription_plan_id && (
                    <div className="text-sm text-amber-600">
                      Trial Anda telah berakhir. Silakan berlangganan.
                    </div>
                  )}
                </div>
              </div>
              
              {isTrialActive && (
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>0 hari</span>
                    <span>14 hari</span>
                  </div>
                  <Progress value={(daysLeftInTrial / 14) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isTrialActive && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-blue-800">
              <span className="font-medium">Periode Trial: </span>
              {daysLeftInTrial} hari lagi sebelum trial berakhir. Berlangganan untuk terus menggunakan semua fitur.
            </p>
          </div>
        )}

        {isTrialExpired && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium">
                  Periode trial Anda telah berakhir
                </p>
                <p className="text-amber-700 mb-3">
                  Pilih paket berlangganan di bawah untuk melanjutkan menggunakan semua fitur.
                </p>
                
                {!isTrialExtensionRequested && (
                  <div className="bg-white rounded p-4 border border-amber-100">
                    <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Butuh waktu tambahan?
                    </h4>
                    <textarea
                      className="w-full p-2 border border-amber-200 rounded mb-2 text-sm"
                      rows={2}
                      placeholder="Alasan perpanjangan trial..."
                      value={extensionReason}
                      onChange={(e) => setExtensionReason(e.target.value)}
                    ></textarea>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-amber-700 border-amber-200"
                      onClick={handleRequestTrialExtension}
                      disabled={isExtending || !extensionReason.trim()}
                    >
                      {isExtending ? "Mengirim..." : "Minta Perpanjangan Trial"}
                    </Button>
                  </div>
                )}
                
                {isTrialExtensionRequested && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-700 text-sm">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-blue-500" />
                      Permintaan perpanjangan trial Anda telah dikirim dan sedang dalam peninjauan.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isTrialActive && !hasPaidSubscription && !isTrialExpired && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
              <p className="text-blue-800">
                <span className="font-medium">Mulai trial 14 hari gratis!</span> Akses semua fitur premium selama periode trial.
              </p>
            </div>
            <Button onClick={handleStartTrial} disabled={isUpgrading}>
              {isUpgrading ? "Memproses..." : "Mulai Trial"}
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans">
              <CreditCard className="h-4 w-4 mr-2" />
              Paket
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Clock className="h-4 w-4 mr-2" />
              Riwayat Tagihan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                      Paling Populer
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      {plan.current && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Aktif</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {plan.name === 'Basic' && 'Untuk tim kecil atau awal memulai'}
                      {plan.name === 'Standard' && 'Untuk tim berkembang'}
                      {plan.name === 'Premium' && 'Untuk perusahaan besar'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-gray-500">/bulan</span>
                    </div>
                    <ul className="space-y-2">
                      {getPlanFeatures(plan).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {getPlanActionButton(plan)}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Riwayat Tagihan
                </CardTitle>
                <CardDescription>
                  Lihat riwayat transaksi dan status pembayaran Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billingHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Paket</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>{item.plan}</TableCell>
                          <TableCell>{formatPrice(item.amount)}</TableCell>
                          <TableCell>
                            {item.status === 'paid' && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="mr-1 h-3 w-3" /> Lunas
                              </Badge>
                            )}
                            {item.status === 'pending' && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="mr-1 h-3 w-3" /> Menunggu
                              </Badge>
                            )}
                            {item.status === 'failed' && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <X className="mr-1 h-3 w-3" /> Gagal
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Belum ada riwayat tagihan</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <p className="text-sm text-gray-500">
                  Untuk bantuan terkait pembayaran, hubungi support
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment Methods Dialog */}
      <Dialog open={showPaymentMethods} onOpenChange={setShowPaymentMethods}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
            <DialogDescription>
              Silakan pilih metode pembayaran yang ingin Anda gunakan untuk berlangganan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 py-4">
            {paymentMethods.map((method) => (
              <TooltipProvider key={method.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all flex flex-col items-center justify-center h-24
                      ${selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}
                      ${method.isPopular ? 'relative' : ''}`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      {method.isPopular && (
                        <div className="absolute -top-2 -right-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            Populer
                          </Badge>
                        </div>
                      )}
                      <div className="h-10 flex items-center justify-center mb-2">
                        <img src={method.logo} alt={method.name} className="max-h-10 max-w-full" />
                      </div>
                      <span className="text-xs text-center font-medium">{method.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{method.type === 'bank_transfer' ? 'Transfer Bank' : 
                        method.type === 'e_wallet' ? 'E-Wallet' : 
                        method.type === 'credit_card' ? 'Kartu Kredit/Debit' : 'Ritel'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentMethods(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleProcessPayment}
              disabled={isUpgrading || !selectedPaymentMethod}
            >
              {isUpgrading ? "Memproses..." : "Bayar Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscription;
