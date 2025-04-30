
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Skeleton } from "@/components/ui/skeleton";

interface Plan {
  id: string;
  name: string;
  price: number;
  max_members: number;
  features: Record<string, any>;
  current: boolean;
}

const Subscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { organization, refreshData, isTrialActive, daysLeftInTrial } = useOrganization();

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
        const formattedPlans = plansData.map(plan => ({
          ...plan,
          price: plan.price || 0,
          current: organization?.subscription_plan_id === plan.id,
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
    if (!organization) return;
    
    setIsUpgrading(true);
    try {
      // Update organization subscription plan
      const { error } = await supabase
        .from('organizations')
        .update({ subscription_plan_id: planId })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      toast.success("Berlangganan berhasil diperbarui!");
      await refreshData();
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Gagal berlangganan paket. Silakan coba lagi.");
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
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
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

  const isTrialExpired = organization?.trial_expired && !organization?.subscription_plan_id;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kelola Subscription</h1>
          <p className="text-gray-600">Pilih paket yang sesuai dengan kebutuhan organisasi Anda</p>
        </header>

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

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  Paling Populer
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
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
                {plan.current ? (
                  <Button className="w-full" disabled>
                    Paket Saat Ini
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? "Memproses..." : "Berlangganan"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
