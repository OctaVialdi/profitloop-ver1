
import { supabase } from "@/integrations/supabase/client";

/**
 * Mock Midtrans payment service
 */
export const midtransService = {
  generatePaymentUrl: async (planId: string): Promise<string> => {
    // Mock payment URL
    return `https://midtrans.example.com/pay/${planId}`;
  },
  
  getPaymentStatus: async (orderId: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    message?: string;
  }> => {
    // Mock payment status
    return { status: 'success' };
  },
  
  getCurrencyConversion: async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
    // Mock currency conversion (1 USD = ~15,000 IDR)
    if (fromCurrency === 'USD' && toCurrency === 'IDR') {
      return amount * 15000;
    } else if (fromCurrency === 'IDR' && toCurrency === 'USD') {
      return amount / 15000;
    }
    return amount;
  },
  
  // Mock subscription plan data
  getPlanPaymentDetails: async (planId: string): Promise<{
    amount: number;
    currency: string;
    name: string;
    description: string;
    directPaymentUrl: string;
  }> => {
    // Mock plan details based on plan ID
    const plans: Record<string, any> = {
      'basic-plan': {
        amount: 0,
        currency: 'IDR',
        name: 'Basic Plan',
        description: 'Basic features with up to 5 members',
        directPaymentUrl: 'https://midtrans.example.com/pay/basic-free'
      },
      'standard-plan': {
        amount: 299000,
        currency: 'IDR',
        name: 'Standard Plan',
        description: 'Standard features with up to 20 members',
        directPaymentUrl: 'https://midtrans.example.com/pay/standard'
      },
      'premium-plan': {
        amount: 599000,
        currency: 'IDR',
        name: 'Premium Plan',
        description: 'Premium features with up to 50 members',
        directPaymentUrl: 'https://midtrans.example.com/pay/premium'
      }
    };
    
    return plans[planId] || {
      amount: 0,
      currency: 'IDR',
      name: 'Unknown Plan',
      description: 'Unknown plan details',
      directPaymentUrl: 'https://midtrans.example.com/pay/default'
    };
  },
  
  getProratedAmount: async (newPlanId: string, currentPlanId: string): Promise<{
    prorated_amount: number;
    total: number;
    currency: string;
  }> => {
    // Mock prorated amount calculation
    return {
      prorated_amount: 150000,
      total: 449000,
      currency: 'IDR'
    };
  }
};
