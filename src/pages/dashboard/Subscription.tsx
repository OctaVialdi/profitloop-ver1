import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, AlertTriangle, CreditCard, Sparkles, Shield, Clock, Building, X, HelpCircle, Receipt, FileText, Download, Loader2 } from "lucide-react";
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
import { createPayment, downloadBase64Pdf, formatPrice, generateInvoicePdf, getInvoices, getPaymentMethods } from "@/services/paymentService";
import { PaymentMethod, BillingItem } from "@/types/payment";

interface Plan {
  id: string;
  name: string;
  price: number;
  max_members: number | null;
  features: Record<string, any> | null;
  current: boolean;
  popular?: boolean;
}

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState<Record<string, any> | null>(null);
  const [extensionReason, setExtensionReason] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingItem[]>([]);
  const { organization, refreshData, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();

  useEffect(() => {
    fetchSubscriptionPlans();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (organization) {
      fetchBillingHistory();
    }
  }, [organization]);

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

  const fetchPaymentMethods = async () => {
    const methods = await getPaymentMethods();
    setPaymentMethods(methods);
  };

  const fetchBillingHistory = async () => {
    if (!organization) return;
    
    try {
      const invoices = await getInvoices(organization.id);
      
      const formattedHistory = invoices.map((invoice: any) => ({
        id: invoice.id,
        date: invoice.created_at,
        invoice_number: invoice.invoice_number,
        status: invoice.status,
        amount: invoice.total_amount,
        plan_name: invoice.subscription_plans?.name || "Unknown Plan",
        currency: invoice.currency || "IDR",
        payment_method: invoice.payment_transactions?.[0]?.payment_methods?.name
      }));
      
      setBillingHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching billing history:", error);
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
    
    setIsUpgrading(true);
    try {
      const response = await createPayment({
        organizationId: organization.id,
        planId: selectedPlanId,
        paymentMethodCode: selectedPaymentMethod
      });
      
      if (!response) {
        throw new Error("Failed to create payment");
      }
      
      // Hide payment method selection
      setShowPaymentMethods(false);
      
      // Get payment method type
      const paymentMethod = paymentMethods.find(pm => pm.code === selectedPaymentMethod);
      
      // Handle different payment flows based on the payment method type
      if (paymentMethod?.type === 'credit_card') {
        // For credit card, redirect to payment page
        window.location.href = response.transaction.payment_url;
        return;
      } else if (paymentMethod?.type === 'e_wallet' && response.transaction.payment_url !== "N/A") {
        // For e-wallet with redirect URL, open in new tab
        window.open(response.transaction.payment_url, '_blank');
      }
      
      // Show payment instructions for bank transfer, retail, or e-wallet QR
      setPaymentInstructions({
        ...response.transaction.payment_details,
        transaction_id: response.transaction.id,
        invoice_number: response.invoice.invoice_number,
        amount: response.invoice.amount,
        expires_at: response.transaction.expires_at,
        paymentMethodType: paymentMethod?.type
      });
      
      setShowPaymentInstructions(true);
      
      // Track the payment creation event
      try {
        await supabase.functions.invoke('track-event', {
          body: {
            event_type: 'payment_initiated',
            organization_id: organization.id,
            plan_id: selectedPlanId,
            payment_method: selectedPaymentMethod
          }
        });
      } catch (err) {
        console.error("Failed to track payment event:", err);
      }
      
      toast.success("Pembayaran berhasil dibuat.");
      await refreshData();
      await fetchBillingHistory();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Gagal membuat pembayaran. Silakan coba lagi.");
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
              action_url: '/subscription'
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

  const handleGenerateInvoice = async (invoiceId: string, invoiceNumber: string) => {
    setIsGeneratingInvoice(true);
    try {
      const pdfData = await generateInvoicePdf(invoiceId);
      
      if (pdfData) {
        // Download the PDF
        downloadBase64Pdf(pdfData, `Invoice-${invoiceNumber}.pdf`);
        toast.success("Invoice berhasil diunduh");
      } else {
        toast.error("Gagal membuat invoice PDF");
      }
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      toast.error("Gagal membuat invoice PDF");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const renderPaymentInstructions = () => {
    if (!paymentInstructions) return null;
    
    const { paymentMethodType } = paymentInstructions;
    const expirationTime = new Date(paymentInstructions.expires_at);
    const timeLeft = Math.max(0, Math.floor((expirationTime.getTime() - Date.now()) / 1000));
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
          <div className="text-yellow-800 text-sm">
            <p className="font-medium">Harap selesaikan pembayaran Anda dalam:</p>
            <p className="font-bold">{hours} jam {minutes} menit</p>
            <p className="mt-1">Pembayaran yang tidak selesai dalam waktu tersebut akan otomatis dibatalkan.</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md border">
          <h3 className="text-lg font-bold mb-4">Detail Pembayaran</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Bayar</span>
              <span className="font-bold">{formatPrice(paymentInstructions.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nomor Invoice</span>
              <span>{paymentInstructions.invoice_number}</span>
            </div>
          </div>
          
          {paymentMethodType === 'bank_transfer' && (
            <div className="space-y-4">
              <h4 className="font-medium">Instruksi Transfer Bank</h4>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <p className="font-bold mb-2">{paymentInstructions.payment_method}</p>
                <p className="text-sm text-gray-600 mb-1">Nomor Rekening Virtual:</p>
                <div className="flex justify-between items-center">
                  <p className="font-mono text-lg font-bold">{paymentInstructions.virtual_account_number}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInstructions.virtual_account_number);
                      toast.success("Nomor rekening disalin ke clipboard");
                    }}
                  >
                    Salin
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium">Langkah-langkah transfer:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Login ke aplikasi mobile banking atau internet banking Anda</li>
                  <li>Pilih menu Transfer / Virtual Account</li>
                  <li>Masukkan nomor virtual account seperti tertera di atas</li>
                  <li>Pastikan nama penerima adalah "PT Aplikasi Indonesia"</li>
                  <li>Masukkan jumlah transfer sesuai total bayar</li>
                  <li>Selesaikan transaksi Anda</li>
                </ol>
              </div>
            </div>
          )}
          
          {paymentMethodType === 'e_wallet' && paymentInstructions.checkout_url && (
            <div className="space-y-4">
              <h4 className="font-medium">Instruksi Pembayaran E-Wallet</h4>
              
              <div className="border rounded-md p-3 bg-gray-50 text-center">
                <p className="mb-3">Klik tombol di bawah untuk melanjutkan pembayaran dengan {paymentInstructions.payment_method}</p>
                <Button onClick={() => window.open(paymentInstructions.checkout_url, '_blank')}>
                  Lanjut ke Pembayaran
                </Button>
              </div>
            </div>
          )}
          
          {paymentMethodType === 'retail' && (
            <div className="space-y-4">
              <h4 className="font-medium">Instruksi Pembayaran di {paymentInstructions.retail_outlet}</h4>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <p className="font-bold mb-2">{paymentInstructions.payment_method}</p>
                <p className="text-sm text-gray-600 mb-1">Kode Pembayaran:</p>
                <div className="flex justify-between items-center">
                  <p className="font-mono text-lg font-bold">{paymentInstructions.payment_code}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInstructions.payment_code);
                      toast.success("Kode pembayaran disalin ke clipboard");
                    }}
                  >
                    Salin
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium">Langkah-langkah pembayaran:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Kunjungi gerai {paymentInstructions.retail_outlet} terdekat</li>
                  <li>Beritahu kasir bahwa Anda akan melakukan pembayaran untuk "PT Aplikasi Indonesia"</li>
                  <li>Berikan kode pembayaran kepada kasir</li>
                  <li>Bayar sesuai dengan jumlah total yang tertera</li>
                  <li>Simpan bukti pembayaran Anda</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kelola Subscription</h1>
          <p className="text-gray-600">Pilih paket yang sesuai dengan kebutuhan organisasi Anda</p>
        </header>

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
              <Receipt className="h-4 w-4 mr-2" />
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
                  <Receipt className="h-5 w-5" />
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
                        <TableHead>No. Invoice</TableHead>
                        <TableHead>Paket</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>{item.invoice_number}</TableCell>
                          <TableCell>{item.plan_name}</TableCell>
                          <TableCell>{formatPrice(item.amount, item.currency)}</TableCell>
                          <TableCell>
                            {item.status === 'paid' && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="mr-1 h-3 w-3" /> Lunas
                              </Badge>
                            )}
                            {item.status === 'issued' && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="mr-1 h-3 w-3" /> Menunggu
                              </Badge>
                            )}
                            {item.status === 'cancelled' && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <X className="mr-1 h-3 w-3" /> Dibatalkan
                              </Badge>
                            )}
                            {item.status === 'draft' && (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                <FileText className="mr-1 h-3 w-3" /> Draft
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => handleGenerateInvoice(item.id, item.invoice_number)}
                              disabled={isGeneratingInvoice}
                            >
                              {isGeneratingInvoice ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Download className="h-3 w-3" />
                              )}
                              Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
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
          
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2">Transfer Bank</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {paymentMethods
                .filter(method => method.type === 'bank_transfer')
                .map((method) => (
                  <TooltipProvider key={method.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`border rounded-lg p-3 cursor-pointer transition-all flex flex-col items-center justify-center h-24
                          ${selectedPaymentMethod === method.code ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                          onClick={() => setSelectedPaymentMethod(method.code)}
                        >
                          <div className="h-10 flex items-center justify-center mb-2">
                            <img src={method.logo_url} alt={method.name} className="max-h-10 max-w-full" />
                          </div>
                          <span className="text-xs text-center font-medium">{method.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Transfer Bank Virtual Account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              ))}
            </div>
            
            <h3 className="text-sm font-medium mb-2">E-Wallet</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {paymentMethods
                .filter(method => method.type === 'e_wallet')
                .map((method) => (
                  <TooltipProvider key={method.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`border rounded-lg p-3 cursor-pointer transition-all flex flex-col items-center justify-center h-20
                          ${selectedPaymentMethod === method.code ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                          onClick={() => setSelectedPaymentMethod(method.code)}
                        >
                          <div className="h-8 flex items-center justify-center mb-2">
                            <img src={method.logo_url} alt={method.name} className="max-h-8 max-w-full" />
                          </div>
                          <span className="text-xs text-center font-medium">{method.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>E-Wallet</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              ))}
            </div>
            
            <h3 className="text-sm font-medium mb-2">Lainnya</h3>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods
                .filter(method => method.type === 'retail' || method.type === 'credit_card')
                .map((method) => (
                  <TooltipProvider key={method.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`border rounded-lg p-3 cursor-pointer transition-all flex flex-col items-center justify-center h-20
                          ${selectedPaymentMethod === method.code ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
                          onClick={() => setSelectedPaymentMethod(method.code)}
                        >
                          <div className="h-8 flex items-center justify-center mb-2">
                            <img src={method.logo_url} alt={method.name} className="max-h-8 max-w-full" />
                          </div>
                          <span className="text-xs text-center font-medium">{method.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{method.type === 'retail' ? 'Pembayaran di Gerai' : 'Kartu Kredit/Debit'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              ))}
            </div>
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
      
      {/* Payment Instructions Dialog */}
      <Dialog open={showPaymentInstructions} onOpenChange={setShowPaymentInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Instruksi Pembayaran</DialogTitle>
            <DialogDescription>
              Silahkan ikuti instruksi pembayaran di bawah ini.
            </DialogDescription>
          </DialogHeader>
          
          {renderPaymentInstructions()}
          
          <DialogFooter>
            <Button onClick={() => setShowPaymentInstructions(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscription;
