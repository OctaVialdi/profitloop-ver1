
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Confetti } from "@/components/ui/confetti";
import { useOrganization } from "@/hooks/useOrganization";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { organization, refreshData } = useOrganization();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    // Track successful subscription
    if (organization?.id && sessionId) {
      subscriptionAnalyticsService.trackEvent({
        eventType: 'subscription_activated',
        organizationId: organization.id,
        additionalData: { sessionId }
      });
    }
    
    // Refresh organization data to get latest subscription info
    refreshData();
  }, [organization?.id, sessionId, refreshData]);
  
  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <Confetti />
      
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="text-center pb-6 border-b border-green-100">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Pembayaran Berhasil!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600">
              Terima kasih telah berlangganan. Langganan Anda telah berhasil diaktifkan dan Anda sekarang memiliki akses ke semua fitur premium.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Akses Premium Aktif</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Akses tanpa batas ke semua fitur premium</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Dukungan pelanggan prioritas</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Pembaruan otomatis untuk semua fitur baru</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Laporan dan analitik lanjutan</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              ID Sesi: {sessionId || 'Tidak tersedia'}
            </p>
            <p className="mt-1">
              Status pembayaran akan diperbarui dalam beberapa menit.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings/subscription/dashboard')}
          >
            Lihat Dashboard Langganan
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
