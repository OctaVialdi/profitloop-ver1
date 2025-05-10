// Mock service for Midtrans integration since we don't have the actual implementation
// This prevents build errors while keeping the UI functional

export const midtransService = {
  createPaymentTransaction: async (planId: string) => {
    console.log(`Mock: Creating payment transaction for plan ${planId}`);
    return Promise.resolve({
      paymentUrl: `https://example.com/midtrans-pay/${planId}`,
      orderId: `order-${Date.now()}`
    });
  },

  validatePayment: async (orderId: string) => {
    console.log(`Mock: Validating payment for order ${orderId}`);
    return Promise.resolve({ success: true });
  },

  // Get plan details for a given plan ID
  getPlanDetails: async (planId: string) => {
    console.log(`Mock: Getting plan details for ${planId}`);
    
    // Mock plans data
    const plans = {
      'basic_plan': { name: 'Basic', price: 0, slug: 'basic' },
      'standard_plan': { name: 'Standard', price: 299000, slug: 'standard' },
      'premium_plan': { name: 'Premium', price: 599000, slug: 'premium' }
    };
    
    // Return the plan details or a default
    return Promise.resolve(plans[planId as keyof typeof plans] || { name: 'Unknown', price: 0, slug: 'unknown' });
  },

  // Generate direct payment URL for a plan
  generateDirectPaymentUrl: async (planId: string, organizationId: string) => {
    console.log(`Mock: Generating direct payment URL for plan ${planId}`);
    return Promise.resolve(`https://example.com/pay-direct/${planId}`);
  },
  
  createPayment: async (planId: string) => {
    console.log(`Mock: Creating payment for plan ${planId}`);
    return Promise.resolve({
      redirectUrl: `https://example.com/midtrans-checkout/${planId}`,
      orderId: `order-${Date.now()}`
    });
  },
  
  redirectToPayment: (url: string) => {
    console.log(`Mock: Redirecting to payment URL: ${url}`);
    // In a real implementation, this would redirect the browser
    window.location.href = url;
  }
};
