// Mock service for Stripe integration since we don't have the actual subscription_plans table
// This prevents build errors while keeping the UI functional

export const stripeService = {
  createCheckoutSession: async (planId: string) => {
    console.log(`Mock: Creating checkout session for plan ${planId}`);
    return Promise.resolve(`https://example.com/checkout/${planId}`);
  },

  createPortalSession: async () => {
    console.log('Mock: Creating customer portal session');
    return Promise.resolve('https://example.com/customer-portal');
  },

  verifyPaymentStatus: async (sessionId: string) => {
    console.log(`Mock: Verifying payment status for session ${sessionId}`);
    return Promise.resolve({ success: true });
  },

  // Methods for proration calculation
  getProratedCalculation: async (newPlanId: string, currentPlanId: string) => {
    console.log(`Mock: Calculating proration from ${currentPlanId} to ${newPlanId}`);
    return Promise.resolve({
      prorationDate: new Date(),
      amountDue: 150000,
      credit: 75000,
      newAmount: 225000,
      daysLeft: 15,
      totalDaysInPeriod: 30,
      currentPlanName: 'Standard',
      newPlanName: 'Premium'
    });
  },

  createProratedCheckout: async (
    newPlanId: string,
    currentPlanId: string,
    subscriptionId?: string
  ) => {
    console.log(`Mock: Creating prorated checkout for ${newPlanId} from ${currentPlanId}`);
    return Promise.resolve(`https://example.com/prorated-checkout/${newPlanId}`);
  }
};
