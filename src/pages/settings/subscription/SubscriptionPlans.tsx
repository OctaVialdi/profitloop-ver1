
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Loader2, Package } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { useOrganization } from "@/hooks/useOrganization";
import { midtransService } from "@/services/midtransService"; 
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { MidtransPaymentModal } from '@/components/subscription/MidtransPaymentModal';
import { supabase } from "@/integrations/supabase/client";
import { formatRupiah } from "@/utils/formatUtils";

// Define our subscription plan type
interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  max_members: number | null;
  features: Record<string, any> | null;
  is_active: boolean;
  direct_payment_url?: string | null;
  description?: string | null;
}

export const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    redirectUrl: string;
    planName: string;
  } | null>(null);
  const { organization, refreshData } = useOrganization();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch plans from the database
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPlans(data as SubscriptionPlan[]);
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        toast.error("Gagal memuat data paket langganan");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  // Add effect to check for payment success and refresh data
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get('success');
    
    if (success === 'true') {
      // Refresh organization data to reflect new subscription
      refreshData();
    }
  }, [refreshData]);
  
  const handleCheckout = async (planId: string, planName: string) => {
    try {
      setIsSubmitting(true);
      setSelectedPlanId(planId);
      
      // Track analytics for checkout initiation
      subscriptionAnalyticsService.trackCheckoutInitiated(planId, organization?.id || '');
      
      // Use Midtrans payment
      const result = await midtransService.createPayment(planId);
      
      if (result) {
        // For standard plan (direct URL), redirect immediately
        if (planId === 'standard_plan') {
          midtransService.redirectToPayment(result.redirectUrl);
        } else {
          // For other plans, show modal first
          setPaymentData({
            redirectUrl: result.redirectUrl,
            planName: planName
          });
          setPaymentModalOpen(true);
        }
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Gagal memulai proses pembayaran. Silakan coba lagi.");
      setSelectedPlanId(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if current organization is subscribed to a specific plan
  const isSubscribedToPlan = (planId: string) => {
    return organization?.subscription_status === 'active' && 
           organization?.subscription_plan_id === planId;
  };

  // Get yearly price (15% discount)
  const calculateYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12 * 0.85; // 15% off for annual billing
    return yearlyPrice;
  };

  // Calculate savings
  const calculateYearlySavings = (monthlyPrice: number) => {
    const normalYearlyPrice = monthlyPrice * 12;
    const discountedYearlyPrice = calculateYearlyPrice(monthlyPrice);
    return normalYearlyPrice - discountedYearlyPrice;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter for active plans only
  const activePlans = plans.filter(plan => plan.is_active);
  
  // Find basic, standard and premium plans
  const basicPlan = activePlans.find(plan => plan.slug === 'basic_plan' || plan.name.toLowerCase().includes('basic'));
  const standardPlan = activePlans.find(plan => plan.slug === 'standard_plan' || plan.name.toLowerCase().includes('standard'));
  const premiumPlan = activePlans.find(plan => plan.slug === 'premium_plan' || plan.name.toLowerCase().includes('premium'));

  // Find yearly plans or create slugs for them
  const getYearlyPlanSlug = (monthlyPlan: SubscriptionPlan | undefined) => {
    if (!monthlyPlan) return '';
    
    const yearlyPlanSlug = `${monthlyPlan.slug}_yearly`;
    // Check if a yearly plan exists in the database
    const yearlyPlan = plans.find(p => p.slug === yearlyPlanSlug);
    
    // If yearly plan exists, use its slug, otherwise use constructed yearly slug
    return yearlyPlan ? yearlyPlan.slug : yearlyPlanSlug;
  };

  // Extract features from plan features object
  const getPlanFeatures = (plan: SubscriptionPlan | undefined) => {
    if (!plan || !plan.features) return [];
    
    const featuresList: string[] = [];
    
    // Add max members feature
    if (plan.max_members) {
      featuresList.push(`Maksimal ${plan.max_members} anggota`);
    } else {
      featuresList.push('Anggota tidak terbatas');
    }
    
    // Add features from the features object
    Object.entries(plan.features).forEach(([key, value]) => {
      switch(key) {
        case 'storage':
          featuresList.push(`Penyimpanan ${value}`);
          break;
        case 'api_calls':
          featuresList.push(`${value} API calls/bulan`);
          break;
        case 'support':
          featuresList.push(`Dukungan ${value}`);
          break;
        case 'collaboration':
          featuresList.push(`Kolaborasi ${value}`);
          break;
        case 'security':
          featuresList.push(`Keamanan ${value}`);
          break;
        default:
          featuresList.push(`${key}: ${value}`);
      }
    });
    
    return featuresList;
  };
  
  return (
    <>
      <Tabs defaultValue="monthly" className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="monthly">Bulanan</TabsTrigger>
            <TabsTrigger value="yearly">Tahunan (Hemat 15%)</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="monthly" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Plan */}
            {basicPlan && (
              <Card className={
                isSubscribedToPlan(basicPlan.id) 
                  ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" 
                  : ""
              }>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{basicPlan.name}</CardTitle>
                    {isSubscribedToPlan(basicPlan.id) && (
                      <Badge className="bg-blue-100 text-blue-800">Paket Anda</Badge>
                    )}
                  </div>
                  <CardDescription>{basicPlan.description || 'Paket dasar untuk organisasi kecil'}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {basicPlan.price === 0 ? "Gratis" : formatRupiah(basicPlan.price)}
                    </span>
                    {basicPlan.price > 0 && <span className="text-gray-500">/bulan</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {getPlanFeatures(basicPlan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSubscribedToPlan(basicPlan.id) ? (
                    <Button disabled className="w-full">
                      Paket Anda Saat Ini
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled={basicPlan.price === 0}>
                      Paket Gratis
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
            
            {/* Standard Plan */}
            {standardPlan && (
              <Card className={
                isSubscribedToPlan(standardPlan.id) 
                  ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" 
                  : ""
              }>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{standardPlan.name}</CardTitle>
                    {isSubscribedToPlan(standardPlan.id) ? (
                      <Badge className="bg-blue-100 text-blue-800">Paket Anda</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700">Populer</Badge>
                    )}
                  </div>
                  <CardDescription>{standardPlan.description || 'Solusi lengkap untuk sebagian besar organisasi'}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{formatRupiah(standardPlan.price)}</span>
                    <span className="text-gray-500">/bulan</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {getPlanFeatures(standardPlan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSubmitting && selectedPlanId === standardPlan.slug ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </Button>
                  ) : isSubscribedToPlan(standardPlan.id) ? (
                    <Button disabled className="w-full">
                      Paket Anda Saat Ini
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleCheckout(standardPlan.slug, standardPlan.name)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Berlangganan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
            
            {/* Premium Plan */}
            {premiumPlan && (
              <Card className={
                isSubscribedToPlan(premiumPlan.id) 
                  ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" 
                  : ""
              }>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{premiumPlan.name}</CardTitle>
                    {isSubscribedToPlan(premiumPlan.id) && (
                      <Badge className="bg-blue-100 text-blue-800">Paket Anda</Badge>
                    )}
                  </div>
                  <CardDescription>{premiumPlan.description || 'Solusi lengkap untuk organisasi besar'}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{formatRupiah(premiumPlan.price)}</span>
                    <span className="text-gray-500">/bulan</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {getPlanFeatures(premiumPlan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSubmitting && selectedPlanId === premiumPlan.slug ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </Button>
                  ) : isSubscribedToPlan(premiumPlan.id) ? (
                    <Button disabled className="w-full">
                      Paket Anda Saat Ini
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleCheckout(premiumPlan.slug, premiumPlan.name)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Berlangganan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="yearly" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Plan (Yearly) */}
            {basicPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>{basicPlan.name}</CardTitle>
                  <CardDescription>{basicPlan.description || 'Paket dasar untuk organisasi kecil'}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {basicPlan.price === 0 ? "Gratis" : formatRupiah(basicPlan.price * 12)}
                    </span>
                    {basicPlan.price > 0 && <span className="text-gray-500">/tahun</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {getPlanFeatures(basicPlan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled={basicPlan.price === 0}>
                    Paket Gratis
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Standard Plan (Yearly) */}
            {standardPlan && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{standardPlan.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Populer</Badge>
                  </div>
                  <CardDescription>{standardPlan.description || 'Solusi lengkap untuk sebagian besar organisasi'}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {formatRupiah(calculateYearlyPrice(standardPlan.price))}
                    </span>
                    <span className="text-gray-500">/tahun</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Hemat {formatRupiah(calculateYearlySavings(standardPlan.price))} (15%)
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {getPlanFeatures(standardPlan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSubmitting && selectedPlanId === getYearlyPlanSlug(standardPlan) ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleCheckout(getYearlyPlanSlug(standardPlan), `${standardPlan.name} (Tahunan)`)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Berlangganan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
            
            {/* Premium Plan (Yearly) */}
            {premiumPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>{premiumPlan.name}</CardTitle>
                  <CardDescription>{premiumPlan.description || 'Solusi lengkap untuk organisasi besar'}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {formatRupiah(calculateYearlyPrice(premiumPlan.price))}
                    </span>
                    <span className="text-gray-500">/tahun</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Hemat {formatRupiah(calculateYearlySavings(premiumPlan.price))} (15%)
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {getPlanFeatures(premiumPlan).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSubmitting && selectedPlanId === getYearlyPlanSlug(premiumPlan) ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleCheckout(getYearlyPlanSlug(premiumPlan), `${premiumPlan.name} (Tahunan)`)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Berlangganan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>
            Semua harga belum termasuk pajak yang berlaku. Langganan diperpanjang secara otomatis.{' '}
            <Button variant="link" asChild className="p-0 h-auto text-blue-600">
              <Link to="/settings/subscription/faq">Pelajari lebih lanjut</Link>
            </Button>
          </p>
        </div>
      </Tabs>
      
      {/* Payment Modal - Now uses the direct URL approach */}
      {paymentData && (
        <MidtransPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          redirectUrl={paymentData.redirectUrl}
          planName={paymentData.planName}
        />
      )}
    </>
  );
};
