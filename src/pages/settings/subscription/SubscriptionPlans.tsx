
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { stripeService } from "@/services/stripeService";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { toast } from "@/components/ui/sonner";

interface PlanProps {
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

const PlanCard = ({ name, price, features, isActive, isPopular, onSelect, isLoading = false }: PlanProps) => {
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
          disabled={isActive || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : isActive ? 'Paket Anda Saat Ini' : 'Pilih Paket'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const SubscriptionPlans = () => {
  const { organization } = useOrganization();
  const [activeTab, setActiveTab] = useState("plans");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);
  
  const handleSelectPlan = async (planId: string) => {
    try {
      // Track plan selection
      subscriptionAnalyticsService.trackPlanSelected(planId, organization?.id);
      
      if (!organization) return;
      
      // Show loading state for the selected plan
      setIsCheckoutLoading(planId);
      
      // Call Stripe checkout
      const checkoutUrl = await stripeService.createCheckout(planId);
      
      if (checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast.error("Terjadi kesalahan saat memilih paket");
    } finally {
      setIsCheckoutLoading(null);
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
    <div>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          if (value === "plans") {
            subscriptionAnalyticsService.trackEvent({
              eventType: 'subscription_page_view',
              organizationId: organization?.id,
              additionalData: { view: 'plans' }
            });
          }
        }}
        className="space-y-8"
      >
        <TabsList>
          <TabsTrigger value="plans">
            <CreditCard className="h-4 w-4 mr-2" />
            Paket Langganan
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
                isLoading={isCheckoutLoading === plan.id}
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
      </Tabs>
    </div>
  );
};
