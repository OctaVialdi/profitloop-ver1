import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";
import { stripeService } from "@/services/stripeService";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Calendar, CircleDollarSign, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SubscriptionManagement() {
  const { organization, refreshData, isLoading } = useOrganization();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [proratedCalculation, setProratedCalculation] = useState<{
    prorationDate: Date | null;
    amountDue: number | null;
    credit: number | null;
    newAmount: number | null;
    daysLeft: number | null;
    totalDaysInPeriod: number | null;
    currentPlanName?: string;
    newPlanName?: string;
  }>({
    prorationDate: null,
    amountDue: null,
    credit: null,
    newAmount: null,
    daysLeft: null,
    totalDaysInPeriod: null
  });
  
  // For demo purposes - simulating plan details
  const plans = {
    'basic_plan': { name: 'Basic', price: 0, features: ['Maksimal 3 anggota', 'Fitur dasar', 'Penyimpanan 500MB'] },
    'standard_plan': { name: 'Standard', price: 299000, features: ['Hingga 15 anggota', 'Semua fitur Basic', 'Penyimpanan 5GB', 'Dukungan prioritas'] },
    'premium_plan': { name: 'Premium', price: 599000, features: ['Anggota tidak terbatas', 'Semua fitur Standard', 'Penyimpanan 50GB', 'API integrasi'] },
    'standard_yearly_plan': { name: 'Standard (Tahunan)', price: 3049000, features: ['Hingga 15 anggota', 'Semua fitur Basic', 'Penyimpanan 5GB', 'Dukungan prioritas'] },
    'premium_yearly_plan': { name: 'Premium (Tahunan)', price: 6109000, features: ['Anggota tidak terbatas', 'Semua fitur Standard', 'Penyimpanan 50GB', 'API integrasi'] },
  };
  
  const currentPlanId = organization?.subscription_plan_id || 'basic_plan';
  // Using mocked data for missing properties
  const currentPlan = plans[currentPlanId as keyof typeof plans]?.name || 'Basic';
  const currentPrice = plans[currentPlanId as keyof typeof plans]?.price || 0;
  const subscriptionEndDate = organization?.trial_end_date ? new Date(organization.trial_end_date) : null;
  
  const calculateProration = async (newPlanId: string) => {
    try {
      setIsCalculating(true);
      setSelectedPlanId(newPlanId);
      
      // Call our new edge function to calculate accurate proration
      const proratedResult = await stripeService.getProratedCalculation(newPlanId, currentPlanId);
      
      if (proratedResult) {
        setProratedCalculation(proratedResult);
      } else {
        // Fallback to frontend calculation if API call fails
        const today = new Date();
        const endDate = subscriptionEndDate || new Date(today.setMonth(today.getMonth() + 1));
        const daysLeft = Math.round((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const totalDaysInPeriod = 30; // Assuming 30 day billing cycles
        
        // Calculate prorated credit for remaining time on current plan
        const currentPlanDailyRate = currentPrice / totalDaysInPeriod;
        const credit = Math.round(currentPlanDailyRate * daysLeft);
        
        // Calculate prorated charge for new plan
        const newPlanPrice = plans[newPlanId as keyof typeof plans]?.price || 0;
        const newPlanDailyRate = newPlanPrice / totalDaysInPeriod;
        const newCharge = Math.round(newPlanDailyRate * daysLeft);
        
        // Calculate amount due (could be positive or negative)
        const amountDue = newCharge - credit;
        
        setProratedCalculation({
          prorationDate: new Date(),
          amountDue: amountDue > 0 ? amountDue : 0,
          credit: credit,
          newAmount: newPlanPrice,
          daysLeft: daysLeft,
          totalDaysInPeriod: totalDaysInPeriod,
          currentPlanName: currentPlan,
          newPlanName: plans[newPlanId as keyof typeof plans]?.name
        });
      }
      
      subscriptionAnalyticsService.trackFeatureImpression('prorated_calculation', 'subscription_management', organization?.id);
    } catch (error) {
      console.error("Error calculating proration:", error);
      toast.error("Gagal menghitung biaya prorata. Silakan coba lagi.");
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handlePlanChange = async () => {
    if (!selectedPlanId) return;
    setShowConfirmDialog(false);
    
    try {
      setIsProcessing(true);
      
      // Track analytics
      subscriptionAnalyticsService.trackPlanSelected(selectedPlanId, organization?.id);
      
      // Create a prorated checkout session
      const checkoutUrl = await stripeService.createProratedCheckout(
        selectedPlanId, 
        currentPlanId,
        'mock-subscription-id' // Using mock ID since subscription_id doesn't exist
      );
      
      if (checkoutUrl) {
        // Success! Redirect to Stripe checkout
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Gagal memproses perubahan paket. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Pengelolaan Langganan</h1>
        <p className="text-gray-600">
          Upgrade atau downgrade paket langganan Anda dengan perhitungan prorata
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Paket Langganan Anda Saat Ini</CardTitle>
          <CardDescription>
            Detail paket langganan yang Anda gunakan saat ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-medium">Paket:</span>
              <span className="font-semibold">{currentPlan}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Harga:</span>
              <span>{currentPrice === 0 ? "Gratis" : `Rp ${currentPrice.toLocaleString('id')}`}</span>
            </div>
            {subscriptionEndDate && (
              <div className="flex justify-between">
                <span className="font-medium">Tanggal Perpanjangan:</span>
                <span>{format(subscriptionEndDate, 'dd MMMM yyyy', { locale: id })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <Badge variant={organization?.subscription_status === 'active' ? 'success' : 'default'}>
                {organization?.subscription_status === 'active' ? 'Aktif' : 
                 organization?.subscription_status === 'trial' ? 'Masa Percobaan' : 'Tidak Aktif'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upgrade atau Downgrade Paket</CardTitle>
          <CardDescription>
            Pilih paket baru dan lihat perhitungan biaya prorata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="space-y-8">
            <TabsList>
              <TabsTrigger value="monthly">Bulanan</TabsTrigger>
              <TabsTrigger value="yearly">Tahunan (Hemat 15%)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Plan */}
                <Card className={currentPlanId === 'basic_plan' ? "bg-muted" : ""}>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">Gratis</span>
                    </div>
                    {currentPlanId === 'basic_plan' && (
                      <Badge variant="outline">Paket Anda Saat Ini</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plans.basic_plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlanId !== 'basic_plan' ? (
                      <Button 
                        variant={selectedPlanId === 'basic_plan' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => calculateProration('basic_plan')}
                        disabled={isCalculating || isProcessing}
                      >
                        {isCalculating && selectedPlanId === 'basic_plan' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</>
                        ) : (
                          <>
                            <ArrowDownCircle className="mr-2 h-4 w-4" />
                            Downgrade ke Basic
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Paket Anda Saat Ini
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Standard Plan */}
                <Card className={currentPlanId === 'standard_plan' ? "bg-muted" : ""}>
                  <CardHeader>
                    <CardTitle>Standard</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">Rp 299.000</span>
                      <span className="text-sm text-muted-foreground">/bulan</span>
                    </div>
                    {currentPlanId === 'standard_plan' && (
                      <Badge variant="outline">Paket Anda Saat Ini</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plans.standard_plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlanId !== 'standard_plan' ? (
                      <Button 
                        variant={selectedPlanId === 'standard_plan' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => calculateProration('standard_plan')}
                        disabled={isCalculating || isProcessing}
                      >
                        {isCalculating && selectedPlanId === 'standard_plan' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</>
                        ) : currentPlanId === 'premium_plan' ? (
                          <>
                            <ArrowDownCircle className="mr-2 h-4 w-4" />
                            Downgrade ke Standard
                          </>
                        ) : (
                          <>
                            <ArrowUpCircle className="mr-2 h-4 w-4" />
                            Upgrade ke Standard
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Paket Anda Saat Ini
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Premium Plan */}
                <Card className={currentPlanId === 'premium_plan' ? "bg-muted" : ""}>
                  <CardHeader>
                    <CardTitle>Premium</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">Rp 599.000</span>
                      <span className="text-sm text-muted-foreground">/bulan</span>
                    </div>
                    {currentPlanId === 'premium_plan' && (
                      <Badge variant="outline">Paket Anda Saat Ini</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plans.premium_plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlanId !== 'premium_plan' ? (
                      <Button 
                        variant={selectedPlanId === 'premium_plan' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => calculateProration('premium_plan')}
                        disabled={isCalculating || isProcessing}
                      >
                        {isCalculating && selectedPlanId === 'premium_plan' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</>
                        ) : (
                          <>
                            <ArrowUpCircle className="mr-2 h-4 w-4" />
                            Upgrade ke Premium
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Paket Anda Saat Ini
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="yearly" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Plan (Yearly) */}
                <Card className={currentPlanId === 'basic_plan' ? "bg-muted" : ""}>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">Gratis</span>
                    </div>
                    {currentPlanId === 'basic_plan' && (
                      <Badge variant="outline">Paket Anda Saat Ini</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plans.basic_plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlanId !== 'basic_plan' ? (
                      <Button 
                        variant={selectedPlanId === 'basic_plan' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => calculateProration('basic_plan')}
                        disabled={isCalculating || isProcessing}
                      >
                        {isCalculating && selectedPlanId === 'basic_plan' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</>
                        ) : (
                          <>
                            <ArrowDownCircle className="mr-2 h-4 w-4" />
                            Downgrade ke Basic
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Paket Anda Saat Ini
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Standard Plan (Yearly) */}
                <Card className={currentPlanId === 'standard_yearly_plan' ? "bg-muted" : ""}>
                  <CardHeader>
                    <CardTitle>Standard (Tahunan)</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">Rp 3.049.000</span>
                      <span className="text-sm text-muted-foreground">/tahun</span>
                    </div>
                    {currentPlanId === 'standard_yearly_plan' && (
                      <Badge variant="outline">Paket Anda Saat Ini</Badge>
                    )}
                    <Badge variant="secondary" className="mt-1">Hemat 15%</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plans.standard_yearly_plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlanId !== 'standard_yearly_plan' ? (
                      <Button 
                        variant={selectedPlanId === 'standard_yearly_plan' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => calculateProration('standard_yearly_plan')}
                        disabled={isCalculating || isProcessing}
                      >
                        {isCalculating && selectedPlanId === 'standard_yearly_plan' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</>
                        ) : currentPlanId === 'premium_yearly_plan' ? (
                          <>
                            <ArrowDownCircle className="mr-2 h-4 w-4" />
                            Downgrade ke Standard (Tahunan)
                          </>
                        ) : (
                          <>
                            <ArrowUpCircle className="mr-2 h-4 w-4" />
                            {currentPlanId === 'standard_plan' ? 'Ubah ke Tahunan' : 'Upgrade ke Standard (Tahunan)'}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Paket Anda Saat Ini
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Premium Plan (Yearly) */}
                <Card className={currentPlanId === 'premium_yearly_plan' ? "bg-muted" : ""}>
                  <CardHeader>
                    <CardTitle>Premium (Tahunan)</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">Rp 6.109.000</span>
                      <span className="text-sm text-muted-foreground">/tahun</span>
                    </div>
                    {currentPlanId === 'premium_yearly_plan' && (
                      <Badge variant="outline">Paket Anda Saat Ini</Badge>
                    )}
                    <Badge variant="secondary" className="mt-1">Hemat 15%</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {plans.premium_yearly_plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlanId !== 'premium_yearly_plan' ? (
                      <Button 
                        variant={selectedPlanId === 'premium_yearly_plan' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => calculateProration('premium_yearly_plan')}
                        disabled={isCalculating || isProcessing}
                      >
                        {isCalculating && selectedPlanId === 'premium_yearly_plan' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</>
                        ) : (
                          <>
                            <ArrowUpCircle className="mr-2 h-4 w-4" />
                            {currentPlanId === 'premium_plan' ? 'Ubah ke Tahunan' : 'Upgrade ke Premium (Tahunan)'}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Paket Anda Saat Ini
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedPlanId && proratedCalculation.prorationDate && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Perhitungan Prorata</CardTitle>
            <CardDescription>
              Detail perubahan paket dari {proratedCalculation.currentPlanName || currentPlan} ke {proratedCalculation.newPlanName || plans[selectedPlanId]?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Informasi Perubahan Paket</AlertTitle>
              <AlertDescription>
                Perubahan paket akan berlaku segera setelah pembayaran diproses. Biaya prorata 
                dihitung berdasarkan sisa waktu paket langganan Anda saat ini.
              </AlertDescription>
            </Alert>
            
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Tanggal Perhitungan:</span>
                  </span>
                  <span>{format(proratedCalculation.prorationDate, 'dd MMMM yyyy', { locale: id })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Sisa Hari pada Periode Saat Ini:</span>
                  </span>
                  <span>{proratedCalculation.daysLeft} dari {proratedCalculation.totalDaysInPeriod} hari</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between">
                  <span>Paket Saat Ini ({proratedCalculation.currentPlanName || currentPlan}):</span>
                  <span>{currentPrice === 0 ? "Gratis" : `Rp ${currentPrice.toLocaleString('id')}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Paket Baru ({proratedCalculation.newPlanName || plans[selectedPlanId]?.name}):</span>
                  <span>Rp {plans[selectedPlanId]?.price.toLocaleString('id')}</span>
                </div>
                
                <div className="flex justify-between font-semibold text-green-600">
                  <span>Kredit untuk Sisa Waktu Paket Saat Ini:</span>
                  <span>- Rp {proratedCalculation.credit?.toLocaleString('id')}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total yang Harus Dibayar:</span>
                  <span>Rp {proratedCalculation.amountDue?.toLocaleString('id')}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setShowConfirmDialog(true)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                ) : (
                  <>
                    <CircleDollarSign className="mr-2 h-4 w-4" />
                    {proratedCalculation.amountDue === 0 
                      ? 'Proses Perubahan Paket' 
                      : `Bayar Rp ${proratedCalculation.amountDue?.toLocaleString('id')}`}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Perubahan Paket</DialogTitle>
            <DialogDescription>
              Anda akan mengubah paket langganan dari {proratedCalculation.currentPlanName || currentPlan} ke {proratedCalculation.newPlanName || plans[selectedPlanId || '']?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between mb-2">
              <span>Total Tagihan:</span>
              <span className="font-semibold">Rp {proratedCalculation.amountDue?.toLocaleString('id')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Anda akan diarahkan ke halaman pembayaran Stripe untuk menyelesaikan transaksi.
              Perubahan paket akan segera berlaku setelah pembayaran selesai.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Batal</Button>
            <Button onClick={handlePlanChange} disabled={isProcessing}>
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : (
                'Lanjutkan ke Pembayaran'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
