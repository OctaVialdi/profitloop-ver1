import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Calendar, AlertTriangle, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { requestTrialExtension } from "@/services/subscriptionService";
import { trackAnalyticsEvent } from "@/services/subscriptionAnalyticsService"; // Add this import
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface PlanProps {
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  onSelect: () => void;
}

const PlanCard = ({ name, price, features, isActive, isPopular, onSelect }: PlanProps) => {
  return (
    <Card className={`relative flex flex-col ${isActive ? 'subscription-tier-current' : ''} ${isPopular ? 'shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-sm py-1 text-center font-medium rounded-t-lg">
          Paling Popular
        </div>
      )}
      <CardHeader className={isPopular ? 'pt-8' : ''}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          {isActive && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Aktif</Badge>
          )}
        </div>
        <CardDescription>
          {name === 'Basic' ? 'Untuk tim kecil atau awal memulai' :
           name === 'Standard' ? 'Untuk tim berkembang' :
           'Untuk perusahaan besar'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-3xl font-bold">{new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(price)}</span>
          <span className="text-gray-500">/bulan</span>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex gap-2 items-start">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isPopular ? "default" : isActive ? "outline" : "secondary"}
          onClick={onSelect}
          disabled={isActive}
        >
          {isActive ? 'Paket Anda Saat Ini' : 'Pilih Paket'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SubscriptionPage = () => {
  const { organization, refreshData } = useOrganization();
  const { isTrialActive, daysLeftInTrial, progress, trialEndDate, isTrialExpired } = 
    useTrialStatus(organization?.id || null);
  const [activeTab, setActiveTab] = useState("plans");
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [extensionReason, setExtensionReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set contact email from auth user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setContactEmail(data.user.email);
      }
    };
    
    getUser();
    
    // Track subscription page view
    trackAnalyticsEvent({
      organizationId: organization?.id,
      eventType: 'subscription_page_view',
      eventData: {
        source: new URLSearchParams(window.location.search).get('source') || 'direct',
        tab: activeTab
      }
    });
  }, []);

  const handleSelectPlan = async (planId: string) => {
    try {
      // Track plan selection
      trackAnalyticsEvent({
        organizationId: organization?.id,
        eventType: 'plan_selected',
        eventData: {
          plan_id: planId
        }
      });
      
      // Temporary simulation before Stripe integration
      if (!organization) return;
      
      // Update organization subscription plan
      const { error } = await supabase
        .from('organizations')
        .update({ 
          subscription_plan_id: planId,
          subscription_status: 'active', // In real implementation, wait for Stripe webhook
          trial_expired: false // Reset trial expired status when paying
        })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      toast.success("Paket berlangganan berhasil diperbarui!");
      refreshData();
      
      // Track successful upgrade
      trackAnalyticsEvent({
        organizationId: organization?.id,
        eventType: 'checkout_completed',
        eventData: {
          plan_id: planId
        }
      });
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast.error("Terjadi kesalahan saat memilih paket");
    }
  };

  const handleTrialExtensionRequest = async () => {
    if (!extensionReason.trim()) {
      toast.error("Mohon berikan alasan untuk perpanjangan trial");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!organization?.id) throw new Error("Organization ID not found");
      
      const success = await requestTrialExtension(
        organization.id, 
        extensionReason, 
        contactEmail
      );
      
      if (success) {
        setShowExtensionDialog(false);
        setExtensionReason("");
      }
    } catch (error) {
      console.error("Error requesting trial extension:", error);
      toast.error("Gagal mengirim permintaan perpanjangan trial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const plans = [
    {
      id: "basic_plan",
      name: "Basic",
      price: 0,
      features: [
        "Hingga 5 anggota",
        "Penyimpanan 1GB",
        "5 proyek aktif",
        "Email support"
      ],
      isPopular: false
    },
    {
      id: "standard_plan",
      name: "Standard",
      price: 299000,
      features: [
        "Hingga 15 anggota",
        "Penyimpanan 10GB",
        "15 proyek aktif",
        "Priority support",
        "Fitur analitik lanjutan",
        "Integrasi API dasar"
      ],
      isPopular: true
    },
    {
      id: "premium_plan", 
      name: "Premium",
      price: 599000,
      features: [
        "Anggota tidak terbatas",
        "Penyimpanan 50GB",
        "Proyek tidak terbatas",
        "Support 24/7",
        "Semua fitur analitik",
        "API akses penuh",
        "Custom branding",
        "Keamanan lanjutan"
      ],
      isPopular: false
    }
  ];

  return (
    <div className="container mx-auto py-8" data-subscription-page="true">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Kelola Langganan</h1>
        <p className="text-gray-600">
          Pilih paket yang sesuai dengan kebutuhan organisasi Anda
        </p>
      </div>

      {/* Current Plan Status */}
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
                    onClick={() => setShowExtensionDialog(true)}
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
              
              <Button variant="outline" size="sm">
                Kelola Metode Pembayaran
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
                onClick={() => setShowExtensionDialog(true)}
              >
                Minta Perpanjangan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
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

      {/* Tabs for Plans and History */}
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList>
          <TabsTrigger value="plans">
            <CreditCard className="h-4 w-4 mr-2" />
            Paket Langganan
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Riwayat Transaksi
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                isActive={organization?.subscription_plan_id === plan.id}
                isPopular={plan.isPopular}
                onSelect={() => handleSelectPlan(plan.id)}
              />
            ))}
          </div>
          
          {/* Premium Feature Highlight */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Fitur Premium yang Tersedia</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-md p-4 border border-blue-100">
                <h4 className="font-medium mb-2">Analytics Lanjutan</h4>
                <p className="text-sm text-gray-600">Dapatkan wawasan mendalam tentang kinerja organisasi Anda</p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-blue-100">
                <h4 className="font-medium mb-2">Anggota Tidak Terbatas</h4>
                <p className="text-sm text-gray-600">Tambahkan semua anggota tim tanpa batasan jumlah</p>
              </div>
              
              <div className="bg-white rounded-md p-4 border border-blue-100">
                <h4 className="font-medium mb-2">Penyimpanan Besar</h4>
                <p className="text-sm text-gray-600">Simpan dokumen, gambar, dan file tanpa khawatir kehabisan ruang</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>
                Daftar semua transaksi yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada riwayat transaksi</p>
                <p className="text-sm mt-2">Riwayat transaksi akan muncul di sini setelah Anda berlangganan</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Trial Extension Request Dialog */}
      <Dialog open={showExtensionDialog} onOpenChange={setShowExtensionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Minta Perpanjangan Trial</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk meminta perpanjangan masa trial Anda.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="extension-reason" className="text-sm font-medium">
                Alasan Perpanjangan
              </label>
              <Textarea
                id="extension-reason"
                placeholder="Ceritakan mengapa Anda memerlukan perpanjangan trial..."
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email Kontak
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="Email untuk dihubungi"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
            <Button 
              onClick={handleTrialExtensionRequest} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Permintaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
