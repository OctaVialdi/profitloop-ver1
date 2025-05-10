
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubscriptionFAQPage from '@/pages/subscription/FAQPage';

export const subscriptionRoutes = [
  <Route
    key="subscription-faq"
    path="/subscription/faq"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <SubscriptionFAQPage />
        </DashboardLayout>
      </ProtectedRoute>
    }
  />
];
