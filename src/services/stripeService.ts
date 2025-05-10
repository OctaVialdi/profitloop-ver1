
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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
        body: { planId }
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
   * Create a customer portal session
   * @returns The URL to redirect to for customer portal
   */
  createPortalSession: async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw new Error(`Error creating portal session: ${error.message}`);
      if (!data?.url) throw new Error("No portal URL returned");
      
      return data.url;
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      toast.error("Gagal memuat portal pelanggan. Silakan coba lagi.");
      return null;
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
  }
};
