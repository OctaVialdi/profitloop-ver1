
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useOrganization } from '@/hooks/useOrganization';
import { midtransService } from '@/services/midtransService';
import { subscriptionNotificationService } from '@/services/subscriptionNotificationService';
import { PricingDisplay } from '@/components/subscription/PricingDisplay';

const SubscriptionSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'error'>('pending');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshData } = useOrganization();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderIdParam = queryParams.get('order_id');
    
    if (!orderIdParam) {
      navigate('/settings/subscription');
      return;
    }
    
    setOrderId(orderIdParam);
    
    const checkPaymentStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check the status from our backend
        const result = await midtransService.checkPaymentStatus(orderIdParam);
        
        setTransaction(result.transaction);
        
        if (result.success) {
          setPaymentStatus('success');
          subscriptionNotificationService.showPaymentSuccessToast(
            result.subscription_plan?.name || 'subscription'
          );
          
          // Refresh organization data to update subscription status
          await refreshData();
        } else if (result.status === 'pending') {
          setPaymentStatus('pending');
          subscriptionNotificationService.showPaymentPendingToast();
        } else {
          setPaymentStatus('error');
          subscriptionNotificationService.showPaymentErrorToast();
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPaymentStatus();
  }, [location.search, navigate, refreshData]);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium text-center">Verifying payment status...</p>
        </div>
      );
    }
    
    switch (paymentStatus) {
      case 'success':
        return (
          <>
            <CardHeader>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-center">Payment Successful!</CardTitle>
              <CardDescription className="text-center">
                Your subscription has been successfully activated. Thank you for your payment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transaction?.subscription_plan && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Subscription Plan</h3>
                  <p className="text-lg font-semibold">{transaction.subscription_plan.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <PricingDisplay plan={transaction.subscription_plan} className="text-lg font-medium" />
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Order ID</span>
                    <span className="text-sm font-medium">{orderId}</span>
                  </div>
                  {transaction?.created_at && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Transaction Date</span>
                      <span className="text-sm font-medium">{new Date(transaction.created_at).toLocaleString()}</span>
                    </div>
                  )}
                  {transaction?.amount && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(transaction.amount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </>
        );
        
      case 'pending':
        return (
          <>
            <CardHeader>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mb-4">
                <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl text-center">Payment Processing</CardTitle>
              <CardDescription className="text-center">
                Your payment is being processed. We'll update your subscription status once the payment is confirmed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transaction?.subscription_plan && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Subscription Plan</h3>
                  <p className="text-lg font-semibold">{transaction.subscription_plan.name}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Order ID</span>
                    <span className="text-sm font-medium">{orderId}</span>
                  </div>
                  {transaction?.created_at && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Transaction Date</span>
                      <span className="text-sm font-medium">{new Date(transaction.created_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </>
        );
        
      case 'error':
        return (
          <>
            <CardHeader>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-center">Payment Issue</CardTitle>
              <CardDescription className="text-center">
                There was an issue processing your payment. Please try again or contact support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-4">
                If you believe this is an error, or if you've already made the payment, please contact our support team with your order reference.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-sm font-medium">{orderId}</span>
                </div>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Card>
        {renderContent()}
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/settings/subscription')}
            className="w-full"
          >
            Subscription Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
