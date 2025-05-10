
import { supabase } from "@/integrations/supabase/client";
import { subscriptionService } from "./subscriptionService";

/**
 * Mock service for Midtrans payment gateway integration
 */
export const midtransService = {
  createTransaction: async (planId: string, organizationId: string, userId: string): Promise<{
    token: string;
    redirect_url: string;
  }> => {
    console.log(`Creating Midtrans transaction for plan ${planId}, org ${organizationId}, user ${userId}`);
    
    // Get plan details from the mock service
    const plans = await subscriptionService.getSubscriptionPlans();
    const selectedPlan = plans.find(p => p.id === planId);
    
    if (!selectedPlan) {
      throw new Error("Selected plan not found");
    }

    // Mock response
    return {
      token: `mock-midtrans-token-${Date.now()}`,
      redirect_url: `https://app.midtrans.com/snap/v3/redirection/${Date.now()}`
    };
  },
  
  checkTransactionStatus: async (orderId: string): Promise<{
    status_code: string;
    transaction_status: string;
    order_id: string;
  }> => {
    console.log(`Checking Midtrans transaction status for order ${orderId}`);
    
    // Mock response
    return {
      status_code: "200",
      transaction_status: "settlement",
      order_id: orderId
    };
  }
};
