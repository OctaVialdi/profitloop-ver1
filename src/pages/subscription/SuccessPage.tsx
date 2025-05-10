
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { subscriptionAnalyticsService } from '@/services/subscriptionAnalyticsService';
import { useOrganization } from '@/hooks/useOrganization';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const { organization, subscriptionPlan, refreshData } = useOrganization();
  
  useEffect(() => {
    // Refresh organization data to get updated subscription status
    refreshData();
    
    // Track this page view
    subscriptionAnalyticsService.trackEvent({
      eventType: 'subscription_activated',
      organizationId: organization?.id,
      planId: subscriptionPlan?.id,
      additionalData: { source: 'success_page' }
    });
  }, [organization?.id, refreshData, subscriptionPlan?.id]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Pembayaran Berhasil!</CardTitle>
          <CardDescription className="text-xl">
            Terima kasih telah berlangganan {subscriptionPlan?.name || 'Premium'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-semibold mb-2">Informasi Langganan</h3>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Paket</dt>
                <dd className="font-medium">{subscriptionPlan?.name || 'Premium'}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium text-green-600">Aktif</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Tagihan</dt>
                <dd className="font-medium">Bulanan</dd>
              </div>
            </dl>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Apa selanjutnya?</h3>
            <p className="text-muted-foreground text-sm">
              Anda sekarang memiliki akses penuh ke semua fitur premium. Langganan Anda akan diperpanjang secara otomatis setiap bulan.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => navigate('/settings/subscription')}
          >
            Kelola Langganan
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => navigate('/dashboard')}
          >
            Ke Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessPage;
