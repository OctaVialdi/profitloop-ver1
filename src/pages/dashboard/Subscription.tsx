import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, AlertTriangle, CreditCard, Sparkles, Shield, Clock, Building, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubscriptionPlan } from "@/types/organization";

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

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");
  const { organization, refreshData, isTrialActive, daysLeftInTrial, hasPaidSubscription } = useOrganization();
  
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
    // Mock subscription plans
    const mockPlans: Plan[] = [
      {
        id: "basic_plan",
        name: "Basic",
        price: 0,
        max_members: 3,
        features: {
          storage: "1GB",
          api_calls: "100"
        },
        current: !organization?.subscription_plan_id || organization.subscription_plan_id === "basic_plan",
        popular: false
      },
      {
        id: "standard_plan",
        name: "Standard",
        price: 249000,
        max_members: 10,
        features: {
          storage: "10GB",
          api_calls: "1000"
        },
        current: organization?.subscription_plan_id === "standard_plan",
        popular: true
      },
      {
        id: "premium_plan",
        name: "Premium",
        price: 499000,
        max_members: 25,
        features: {
          storage: "100GB",
          api_calls: "Unlimited"
        },
        current: organization?.subscription_plan_id === "premium_plan",
        popular: false
      }
    ];
    
    setPlans(mockPlans);
    setIsLoading(false);
  }, [organization?.subscription_plan_id]);

  const handleSubscribe = async (planId: string) => {
    if (!organization) return;
    
    // Prevent switching to the same plan
    if (organization.subscription_plan_id === planId) {
      toast.info("Anda sudah berlangganan paket ini");
      return;
    }
    
    // Get the plan details
    const selectedPlan = plans.find(p => p.id === planId);
    
    if (!selectedPlan) {
      toast.error("Paket berlangganan tidak ditemukan");
      return;
    }
    
    setIsUpgrading(true);
    try {
      // For demonstration, we're directly updating the subscription plan
      // In a real application, you'd integrate with a payment gateway here
      
      // Update organization subscription plan
      const { error } = await supabase
        .from('organizations')
        .update({ 
          subscription_plan_id: planId,
          // If moving to a paid plan, clear trial expiration data
          ...(selectedPlan.price > 0 ? {
            trial_expired: false,
            trial_end_date: null
          } : {})
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
              title: 'Paket Berlangganan Diperbarui',
              message: `Paket berlangganan organisasi Anda telah diubah ke ${selectedPlan.name}.`,
              type: 'success',
              action_url: '/subscription'
            });
        }
      }
      
      toast.success(`Berlangganan paket ${selectedPlan.name} berhasil!`);
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
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      
      // Update organization trial data
      const { error } = await supabase
        .from('organizations')
        .update({ 
          trial_end_date: trialEndDate.toISOString(),
          trial_expired: false
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
              title: 'Periode Trial Dimulai',
              message: 'Periode trial 30 hari Anda telah dimulai. Nikmati semua fitur premium!',
              type: 'info',
              action_url: '/subscription'
            });
        }
      }
      
      toast.success("Periode trial 30 hari berhasil dimulai!");
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
                    <span>30 hari</span>
                  </div>
                  <Progress value={(daysLeftInTrial / 30) * 100} className="h-2" />
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
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">
                Periode trial Anda telah berakhir
              </p>
              <p className="text-amber-700">
                Pilih paket berlangganan di bawah untuk melanjutkan menggunakan semua fitur.
              </p>
            </div>
          </div>
        )}

        {!isTrialActive && !hasPaidSubscription && !isTrialExpired && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
              <p className="text-blue-800">
                <span className="font-medium">Mulai trial 30 hari gratis!</span> Akses semua fitur premium selama periode trial.
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
    </div>
  );
};

export default Subscription;
