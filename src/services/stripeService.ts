
// Mock Stripe service for subscription management

export const stripeService = {
  createCheckoutSession: async (planId: string): Promise<string> => {
    console.log(`Creating checkout session for plan: ${planId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return `https://checkout.stripe.com/mock-checkout/${planId}`;
  },
  
  createPortalSession: async (): Promise<string> => {
    console.log('Creating customer portal session');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return 'https://billing.stripe.com/mock-portal';
  },
  
  verifyPaymentStatus: async (sessionId: string): Promise<{ success: boolean }> => {
    console.log(`Verifying payment status for session: ${sessionId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  
  getProratedCalculation: async (newPlanId: string, currentPlanId: string): Promise<{
    prorated_amount: number;
    total: number;
    currency: string;
  }> => {
    console.log(`Getting prorated calculation from ${currentPlanId} to ${newPlanId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      prorated_amount: 15000,
      total: 45000,
      currency: 'IDR'
    };
  },
  
  createProratedCheckout: async (newPlanId: string, currentPlanId: string): Promise<string> => {
    console.log(`Creating prorated checkout from ${currentPlanId} to ${newPlanId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return `https://checkout.stripe.com/mock-prorated-checkout/${newPlanId}`;
  },
  
  // Added missing methods
  createCheckout: async (planId: string): Promise<string> => {
    console.log(`Creating checkout for plan: ${planId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return `https://checkout.stripe.com/mock-checkout/${planId}`;
  },
  
  sendTrialReminderEmail: async (daysLeft: number): Promise<boolean> => {
    console.log(`Sending trial reminder email for ${daysLeft} days left`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};
