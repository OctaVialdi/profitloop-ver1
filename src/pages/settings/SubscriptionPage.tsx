
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { SubscriptionOverview } from './subscription/SubscriptionOverview';
import { SubscriptionPlans } from './subscription/SubscriptionPlans';
import { SubscriptionHistory } from './subscription/SubscriptionHistory';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, HelpCircle, FileText, CheckCircle, ArrowUpDown } from "lucide-react";
import { midtransService } from '@/services/midtransService';
import { stripeService } from '@/services/stripeService';
import { toast } from 'sonner';

const Subscription = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);

  // Track page view when component mounts
  useEffect(() => {
    // If we're at the base subscription route, handle potential search params
    if (location.pathname === '/settings/subscription') {
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      const pending = searchParams.get('pending');
      const sessionId = searchParams.get('session_id'); // For Stripe
      const orderId = searchParams.get('order_id'); // For Midtrans
      
      // Verify payment status based on payment gateway
      const verifyPayment = async () => {
        setIsVerifying(true);
        try {
          if (success === 'true' && sessionId) {
            // Verify Stripe payment
            const result = await stripeService.verifyPaymentStatus(sessionId);
            if (result.success) {
              toast.success("Pembayaran berhasil diverifikasi! Langganan Anda telah aktif.");
            } else {
              toast.warning("Pembayaran sedang diproses. Status langganan akan diperbarui secara otomatis.");
            }
          } else if ((success === 'true' || pending === 'true') && orderId) {
            // Verify Midtrans payment
            const result = await midtransService.verifyPaymentStatus(orderId);
            if (result.success) {
              toast.success("Pembayaran berhasil diverifikasi! Langganan Anda telah aktif.");
            } else if (result.status === 'pending') {
              toast.info("Pembayaran sedang diproses. Status langganan akan diperbarui setelah pembayaran selesai.");
            } else {
              toast.warning("Menunggu verifikasi pembayaran. Status langganan akan diperbarui secara otomatis.");
            }
          } else if (canceled === 'true') {
            toast.error("Proses pembayaran dibatalkan. Silakan coba lagi.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("Gagal memverifikasi status pembayaran.");
        } finally {
          setIsVerifying(false);
        }
      };
      
      if (success === 'true' || pending === 'true' || canceled === 'true') {
        verifyPayment();
      }
    }
  }, [location.pathname, searchParams]);

  // Handle nested routes within the subscription page
  if (location.pathname !== '/settings/subscription') {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/settings/subscription" replace />} />
      </Routes>
    );
  }

  return (
    <div className="container mx-auto py-8" data-subscription-page="true">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Kelola Langganan</h1>
        <p className="text-gray-600">
          Pilih paket yang sesuai dengan kebutuhan organisasi Anda
        </p>
      </div>
      
      {/* Payment verification indicator */}
      {isVerifying && (
        <Card className="mb-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2 text-blue-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Memverifikasi status pembayaran...</p>
          </div>
        </Card>
      )}
      
      {/* Quick Links to New Pages */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/settings/subscription/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard Langganan
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/settings/subscription/success">
            <CheckCircle className="h-4 w-4" />
            Halaman Sukses
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/settings/subscription/faq">
            <HelpCircle className="h-4 w-4" />
            FAQ Langganan
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/settings/subscription/management">
            <ArrowUpDown className="h-4 w-4" />
            Upgrade/Downgrade Prorata
          </Link>
        </Button>
      </div>

      {/* Current Plan Status */}
      <SubscriptionOverview />
      
      {/* Plans and History in separate components */}
      <Card className="mb-8">
        <SubscriptionPlans />
        <SubscriptionHistory />
      </Card>
    </div>
  );
};

export default Subscription;
