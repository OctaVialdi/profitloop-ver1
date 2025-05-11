
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Stripe integration service
 * Handles interactions with Stripe checkout and customer portal edge functions
 */
export const stripeService = {
  /**
   * Create a checkout session for a plan
   * @param planId The ID of the subscription plan
   * @returns The URL to redirect to for checkout
   */
  createCheckout: async (planId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { 
          planId,
          successUrl: window.location.origin + "/subscription/success"
        }
      });
      
      if (error) throw new Error(`Error creating checkout: ${error.message}`);
      if (!data?.sessionUrl) throw new Error("No checkout URL returned");
      
      return data.sessionUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Gagal memuat halaman pembayaran. Silakan coba lagi.");
      return null;
    }
  },
  
  /**
   * Create a checkout session with proration for plan changes
   * @param newPlanId The ID of the new subscription plan
   * @param currentPlanId The ID of the current subscription plan
   * @param subscriptionId Optional subscription ID for direct subscription updates
   * @returns The URL to redirect to for checkout
   */
  createProratedCheckout: async (
    newPlanId: string, 
    currentPlanId: string,
    subscriptionId?: string
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { 
          planId: newPlanId,
          currentPlanId: currentPlanId,
          subscriptionId: subscriptionId,
          prorate: true,
          successUrl: window.location.origin + "/subscription/success"
        }
      });
      
      if (error) throw new Error(`Error creating prorated checkout: ${error.message}`);
      if (!data?.sessionUrl) throw new Error("No checkout URL returned");
      
      return data.sessionUrl;
    } catch (error) {
      console.error("Error creating prorated checkout session:", error);
      toast.error("Gagal memuat halaman pembayaran prorata. Silakan coba lagi.");
      return null;
    }
  },
  
  /**
   * Create a customer portal session
   * @returns The URL to redirect to for customer portal
   */
  createPortalSession: async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) {
        // Special handling for missing Stripe API key
        if (error.message?.includes("STRIPE_SECRET_KEY is not set")) {
          console.error("Stripe secret key is not configured");
          throw new Error("Payment provider not properly configured");
        }
        throw new Error(`Error creating portal session: ${error.message}`);
      }
      
      if (!data?.url) throw new Error("No portal URL returned");
      
      return data.url;
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      throw error;
    }
  },
  
  /**
   * Check if the user has an active subscription
   * @returns Information about the user's subscription status
   */
  checkSubscription: async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw new Error(`Error checking subscription: ${error.message}`);
      
      return {
        subscribed: data?.subscribed || false,
        subscription_tier: data?.subscription_tier || null,
        subscription_end: data?.subscription_end || null
      };
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return { subscribed: false, subscription_tier: null, subscription_end: null };
    }
  },

  /**
   * Verify the payment status using the checkout session ID
   * @param sessionId The Stripe checkout session ID
   * @returns Payment status information
   */
  verifyPaymentStatus: async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { sessionId }
      });
      
      if (error) throw new Error(`Error verifying payment: ${error.message}`);
      
      return {
        success: data?.success || false,
        status: data?.status || 'unknown',
        subscription_tier: data?.subscription_tier || null
      };
    } catch (error) {
      console.error("Error verifying payment status:", error);
      return { success: false, status: 'error', subscription_tier: null };
    }
  },
  
  /**
   * Generate a proration preview to show what the customer will pay
   * @param newPlanId New plan ID to switch to
   * @param currentPlanId Current plan ID
   * @returns Proration calculation details
   */
  getProratedCalculation: async (newPlanId: string, currentPlanId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("calculate-proration", {
        body: { 
          newPlanId,
          currentPlanId
        }
      });
      
      if (error) throw new Error(`Error calculating proration: ${error.message}`);
      
      return {
        amountDue: data?.amountDue || 0,
        credit: data?.credit || 0,
        newAmount: data?.newAmount || 0,
        daysLeft: data?.daysLeft || 0,
        totalDaysInPeriod: data?.totalDaysInPeriod || 30,
        prorationDate: data?.prorationDate ? new Date(data.prorationDate) : new Date()
      };
    } catch (error) {
      console.error("Error calculating proration:", error);
      return null;
    }
  },
  
  /**
   * Send a trial expiration reminder email
   * @param daysLeft Days left in the trial
   * @returns Success status
   */
  sendTrialReminderEmail: async (daysLeft: number): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke("send-trial-reminder", {
        body: { daysLeft }
      });
      
      if (error) throw new Error(`Error sending trial reminder: ${error.message}`);
      return true;
    } catch (error) {
      console.error("Error sending trial reminder email:", error);
      return false;
    }
  },

  /**
   * Cancel subscription with reason
   * @param reason The reason for cancellation
   * @param feedback Optional feedback from the user
   * @returns Success status
   */
  cancelSubscription: async (reason: string, feedback?: string): Promise<boolean> => {
    try {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase.functions.invoke("cancel-subscription", {
        body: { 
          reason,
          feedback
        }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Error cancelling subscription: ${error.message}`);
      }
      
      if (!data?.success) {
        const errorMessage = data?.error || "Unknown error";
        console.error("Cancellation failed:", errorMessage);
        throw new Error(errorMessage);
      }
      
      // Store cancellation reason and feedback in audit logs
      await supabase.from('subscription_audit_logs').insert({
        action: 'subscription_cancelled',
        organization_id: user.id,
        user_id: user.id,
        data: {
          reason,
          feedback: feedback || null,
          timestamp: new Date().toISOString()
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  },

  /**
   * Apply a discount offer to the user's subscription
   * @param discountPercent The percentage discount to apply
   * @param durationMonths The number of months for the discount
   * @returns Success status
   */
  applyDiscountOffer: async (discountPercent: number = 30, durationMonths: number = 3): Promise<boolean> => {
    try {
      const session = await supabase.auth.getSession();
      const organizationId = session.data.session?.user.id || '';
      
      const { data, error } = await supabase.functions.invoke("apply-discount", {
        body: { 
          discountPercent,
          durationMonths
        }
      });
      
      if (error) throw new Error(`Error applying discount: ${error.message}`);
      
      // Store discount claim in audit logs
      await supabase.from('subscription_audit_logs').insert({
        action: 'discount_applied',
        organization_id: organizationId,
        user_id: session.data.session?.user.id,
        data: {
          discount_percent: discountPercent,
          duration_months: durationMonths,
          claimed_at: new Date().toISOString()
        }
      });
      
      return data?.success || false;
    } catch (error) {
      console.error("Error applying discount offer:", error);
      throw error;
    }
  }
};
