
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Loader2, Package } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import { useOrganization } from "@/hooks/useOrganization";
import { stripeService } from "@/services/stripeService";
import { midtransService } from "@/services/midtransService"; 
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { organization, refreshData } = useOrganization();
  
  useEffect(() => {
    // Load Midtrans Snap library when component mounts
    midtransService.loadSnapLibrary()
      .catch(error => console.error("Failed to load Midtrans library:", error));
  }, []);
  
  const handleCheckout = async (planId: string) => {
    try {
      setIsSubmitting(true);
      setSelectedPlanId(planId);
      
      // Track analytics for checkout initiation
      subscriptionAnalyticsService.trackCheckoutInitiated(planId, organization?.id || '');
      
      // Use Midtrans payment
      const paymentData = await midtransService.createPayment(planId);
      
      if (paymentData) {
        try {
          // Try to open Snap payment page
          midtransService.openPaymentPage(paymentData.token);
        } catch (snapError) {
          console.error("Failed to open Snap payment page:", snapError);
          // Fallback to redirect URL
          window.location.href = paymentData.redirectUrl;
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
  
  return (
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
          <Card className={
            isSubscribedToPlan('basic_plan') 
              ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" 
              : ""
          }>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Basic</CardTitle>
                {isSubscribedToPlan('basic_plan') && (
                  <Badge className="bg-blue-100 text-blue-800">Paket Anda</Badge>
                )}
              </div>
              <CardDescription>Paket dasar untuk organisasi kecil</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">Gratis</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Maksimal 3 anggota</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Manajemen karyawan dasar</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Penyimpanan 500MB</span>
                </li>
                <li className="flex items-center opacity-50">
                  <span className="mr-2 h-4 w-4">✗</span>
                  <span>Fitur premium</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isSubscribedToPlan('basic_plan') ? (
                <Button disabled className="w-full">
                  Paket Anda Saat Ini
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Paket Gratis
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Standard Plan */}
          <Card className={
            isSubscribedToPlan('standard_plan') 
              ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" 
              : ""
          }>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Standard</CardTitle>
                {isSubscribedToPlan('standard_plan') ? (
                  <Badge className="bg-blue-100 text-blue-800">Paket Anda</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700">Populer</Badge>
                )}
              </div>
              <CardDescription>Solusi lengkap untuk sebagian besar organisasi</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">Rp 299.000</span>
                <span className="text-gray-500">/bulan</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Hingga 15 anggota</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Manajemen karyawan lengkap</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Penyimpanan 5GB</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Fitur HR premium</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Dukungan prioritas</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isSubmitting && selectedPlanId === 'standard_plan' ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </Button>
              ) : isSubscribedToPlan('standard_plan') ? (
                <Button disabled className="w-full">
                  Paket Anda Saat Ini
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout('standard_plan')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Berlangganan
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className={
            isSubscribedToPlan('premium_plan') 
              ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50" 
              : ""
          }>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Premium</CardTitle>
                {isSubscribedToPlan('premium_plan') && (
                  <Badge className="bg-blue-100 text-blue-800">Paket Anda</Badge>
                )}
              </div>
              <CardDescription>Solusi lengkap untuk organisasi besar</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">Rp 599.000</span>
                <span className="text-gray-500">/bulan</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Anggota tidak terbatas</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Semua fitur Standard</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Penyimpanan 50GB</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Laporan analitik lanjutan</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>API integrasi khusus</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Dukungan 24/7</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isSubmitting && selectedPlanId === 'premium_plan' ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </Button>
              ) : isSubscribedToPlan('premium_plan') ? (
                <Button disabled className="w-full">
                  Paket Anda Saat Ini
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout('premium_plan')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Berlangganan
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="yearly" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Plan (Yearly) */}
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>Paket dasar untuk organisasi kecil</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">Gratis</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Maksimal 3 anggota</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Manajemen karyawan dasar</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Penyimpanan 500MB</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Paket Gratis
              </Button>
            </CardFooter>
          </Card>
          
          {/* Standard Plan (Yearly) */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Standard</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700">Populer</Badge>
              </div>
              <CardDescription>Solusi lengkap untuk sebagian besar organisasi</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">Rp 3.049.000</span>
                <span className="text-gray-500">/tahun</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Hemat Rp 539.000 (15%)</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Hingga 15 anggota</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Manajemen karyawan lengkap</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Penyimpanan 5GB</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Fitur HR premium</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Dukungan prioritas</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isSubmitting && selectedPlanId === 'standard_yearly_plan' ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout('standard_yearly_plan')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Berlangganan
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Premium Plan (Yearly) */}
          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>Solusi lengkap untuk organisasi besar</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">Rp 6.109.000</span>
                <span className="text-gray-500">/tahun</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Hemat Rp 1.079.000 (15%)</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Anggota tidak terbatas</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Semua fitur Standard</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Penyimpanan 50GB</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Laporan analitik lanjutan</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>API integrasi khusus</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Dukungan 24/7</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isSubmitting && selectedPlanId === 'premium_yearly_plan' ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleCheckout('premium_yearly_plan')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Berlangganan
                </Button>
              )}
            </CardFooter>
          </Card>
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
  );
};
