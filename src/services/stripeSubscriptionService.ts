
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface StripeSubscriptionService {
  openCustomerPortal(): Promise<boolean>;
  getSubscriptionHistory(organizationId: string): Promise<any[]>;
  getActiveSubscription(organizationId: string): Promise<any>;
}

export const stripeSubscriptionService = {
  /**
   * Open the Stripe Customer Portal for managing subscription
   */
  async openCustomerPortal(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        throw error;
      }
      
      if (data && data.url) {
        window.location.href = data.url;
        return true;
      }
      
      throw new Error('No portal URL returned');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Gagal membuka portal manajemen langganan');
      return false;
    }
  },

  /**
   * Get subscription transaction history for an organization
   */
  async getSubscriptionHistory(organizationId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_billing_history', {
        org_id: organizationId
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      toast.error('Gagal memuat riwayat transaksi');
      return [];
    }
  },

  /**
   * Get active subscription details for an organization
   */
  async getActiveSubscription(organizationId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          subscription_status,
          subscription_id,
          subscription_plan_id,
          subscription_period_end,
          subscription_plans (*)
        `)
        .eq('id', organizationId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching active subscription:', error);
      return null;
    }
  },

  /**
   * Handle successful checkout return
   */
  async handleSuccessfulCheckout(organizationId: string): Promise<void> {
    try {
      // Refresh subscription data
      await supabase.functions.invoke('check-trial-expiration');
      
      // Log success in analytics
      // ... analytics tracking here if needed
      
      toast.success('Pembayaran berhasil! Langganan Anda telah diaktifkan.');
    } catch (error) {
      console.error('Error handling successful checkout:', error);
    }
  }
};
