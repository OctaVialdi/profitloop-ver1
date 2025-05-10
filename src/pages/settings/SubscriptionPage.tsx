
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { SubscriptionOverview } from './subscription/SubscriptionOverview';
import { SubscriptionPlans } from './subscription/SubscriptionPlans';
import { SubscriptionHistory } from './subscription/SubscriptionHistory';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, HelpCircle, FileText, CheckCircle, ArrowUpDown } from "lucide-react";

const Subscription = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Track page view when component mounts
  useEffect(() => {
    // If we're at the base subscription route, handle potential search params
    if (location.pathname === '/settings/subscription') {
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      
      if (success === 'true' || canceled === 'true') {
        // Handle payment status notifications
        // This is now handled in the main component to avoid missing status updates
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
