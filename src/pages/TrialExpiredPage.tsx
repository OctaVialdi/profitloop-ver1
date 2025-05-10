
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from '@/hooks/useOrganization';
import { trackAnalyticsEvent } from '@/services/subscriptionAnalyticsService';
import { Check, AlertTriangle, Sparkles } from 'lucide-react';

const TrialExpiredPage = () => {
  const { organization, hasPaidSubscription, isTrialActive } = useOrganization();
  const navigate = useNavigate();

  // Redirect if trial is not expired
  useEffect(() => {
    if (hasPaidSubscription || isTrialActive) {
      navigate('/dashboard');
    } else {
      // Track pageview of trial expired page
      trackAnalyticsEvent({
        organizationId: organization?.id,
        eventType: 'trial_expired_page_view',
        eventData: {}
      });
    }
  }, [hasPaidSubscription, isTrialActive, navigate, organization]);

  // Handle subscription button click
  const handleSubscribe = () => {
    trackAnalyticsEvent({
      organizationId: organization?.id,
      eventType: 'upgrade_button_click',
      eventData: {
        source: 'trial_expired_page'
      }
    });
    navigate('/settings/subscription');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {organization?.name || 'Your Organization'}
            </h1>
            <Button onClick={handleSubscribe}>Berlangganan</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Masa Trial Anda Telah Berakhir</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Terima kasih telah mencoba layanan kami. Untuk terus mengakses fitur premium, silakan pilih paket berlangganan yang sesuai dengan kebutuhan Anda.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            {/* Basic Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Basic</span>
                  <span className="text-sm font-normal bg-gray-100 px-2 py-0.5 rounded-full">Gratis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">Rp 0<span className="text-sm font-normal text-gray-500">/bulan</span></p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Fitur dasar</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Hingga 5 anggota</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Support email</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                  Kembali ke Dashboard
                </Button>
              </CardFooter>
            </Card>

            {/* Standard Plan - Highlighted */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-sm py-1 text-center font-medium rounded-t-md">
                Paling Populer
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="flex justify-between items-center">
                  <span>Standard</span>
                  <span className="text-sm font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Rekomendasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">Rp 299.000<span className="text-sm font-normal text-gray-500">/bulan</span></p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Semua fitur Basic</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Hingga 15 anggota</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Analitik lanjutan</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubscribe}>
                  Pilih Standard
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Premium</span>
                  <span className="text-sm font-normal bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Enterprise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">Rp 599.000<span className="text-sm font-normal text-gray-500">/bulan</span></p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Semua fitur Standard</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Anggota tidak terbatas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>API akses penuh</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Keamanan lanjutan</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleSubscribe}>
                  Pilih Premium
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Feature comparison */}
          <div className="bg-white border rounded-lg p-6 mb-10">
            <h2 className="text-xl font-bold mb-4">Fitur Premium yang Tersedia</h2>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-600">Analisis mendalam untuk data bisnis Anda</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Financial Reports</h3>
                  <p className="text-sm text-gray-600">Laporan keuangan lengkap dan terperinci</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">AI Recommendations</h3>
                  <p className="text-sm text-gray-600">Saran cerdas berdasarkan data Anda</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={handleSubscribe}>
              Berlangganan Sekarang
            </Button>
            <p className="mt-3 text-sm text-gray-500">
              Butuh bantuan? Hubungi <a href="#" className="text-blue-600">support@example.com</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrialExpiredPage;
