
import { supabase } from "@/integrations/supabase/client";

/**
 * Mock Stripe service for payment processing
 */
export const stripeService = {
  createCheckoutSession: async (planId: string): Promise<string> => {
    // Mock creating a checkout session URL
    return `https://checkout.example.com/${planId}`;
  },
  
  createPortalSession: async (): Promise<string> => {
    // Mock creating a customer portal URL
    return `https://billing.example.com/portal`;
  },
  
  verifyPaymentStatus: async (sessionId: string): Promise<{ success: boolean }> => {
    // Mock verifying payment status
    return { success: true };
  },
  
  getProratedCalculation: async (newPlanId: string, currentPlanId: string): Promise<{ 
    prorationDate: Date; 
    amountDue: number; 
    credit: number; 
    newAmount: number; 
    daysLeft: number;
    totalDaysInPeriod: number;
    currentPlanName?: string;
    newPlanName?: string;
  }> => {
    // Mock prorated calculation
    return {
      prorationDate: new Date(),
      amountDue: 200000,
      credit: 100000,
      newAmount: 300000,
      daysLeft: 15,
      totalDaysInPeriod: 30,
      currentPlanName: "Standard",
      newPlanName: "Premium"
    };
  },
  
  createProratedCheckout: async (newPlanId: string, currentPlanId: string): Promise<string> => {
    // Mock prorated checkout URL
    return `https://checkout.example.com/prorate/${currentPlanId}/${newPlanId}`;
  }
};
