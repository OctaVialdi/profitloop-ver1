
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Midtrans integration service
 * Handles interactions with Midtrans payment gateway edge functions
 */
export const midtransService = {
  /**
   * Create a payment transaction for a plan using Midtrans
   * @param planId The ID of the subscription plan
   * @returns The token and redirect URL for Midtrans payment page
   */
  createPayment: async (planId: string): Promise<{ token: string, redirectUrl: string, orderId: string } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("create-midtrans-payment", {
        body: { planId }
      });
      
      if (error) throw new Error(`Error creating payment: ${error.message}`);
      if (!data?.token || !data?.redirectUrl) throw new Error("No payment data returned");
      
      return {
        token: data.token,
        redirectUrl: data.redirectUrl,
        orderId: data.orderId
      };
    } catch (error) {
      console.error("Error creating Midtrans payment:", error);
      toast.error("Gagal memuat halaman pembayaran. Silakan coba lagi.");
      return null;
    }
  },
  
  /**
   * Verify the payment status using the order ID
   * @param orderId The Midtrans order ID
   * @returns Payment status information
   */
  verifyPaymentStatus: async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select(`
          id,
          status,
          subscription_plan_id,
          subscription_plan:subscription_plans(name)
        `)
        .eq("order_id", orderId)
        .single();
      
      if (error) throw new Error(`Error verifying payment: ${error.message}`);
      
      return {
        success: data?.status === "success",
        status: data?.status || 'pending',
        subscription_tier: data?.subscription_plan?.name || null
      };
    } catch (error) {
      console.error("Error verifying payment status:", error);
      return { success: false, status: 'error', subscription_tier: null };
    }
  },
  
  /**
   * Open Midtrans Snap payment page with the given token
   * @param snapToken The Midtrans Snap token
   */
  openPaymentPage: (snapToken: string): void => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Check if Midtrans Snap library is loaded
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function(result){
            console.log("Payment success!", result);
            toast.success("Pembayaran berhasil!");
            // Redirect to success page
            window.location.href = `/settings/subscription?success=true&order_id=${result.order_id}`;
          },
          onPending: function(result){
            console.log("Payment pending", result);
            toast.info("Pembayaran sedang diproses.");
            // Redirect to pending page
            window.location.href = `/settings/subscription?pending=true&order_id=${result.order_id}`;
          },
          onError: function(result){
            console.log("Payment failed!", result);
            toast.error("Pembayaran gagal. Silakan coba lagi.");
            window.location.href = "/settings/subscription?canceled=true";
          },
          onClose: function(){
            console.log("Customer closed the payment window");
            toast.info("Jendela pembayaran ditutup.");
          }
        });
      } else {
        // If Snap library isn't loaded, redirect to the redirect URL
        toast.error("Midtrans library not loaded. Redirecting to payment page.");
        throw new Error("Midtrans Snap library not loaded");
      }
    }
  },
  
  /**
   * Load Midtrans Snap library
   * @returns Promise that resolves when the library is loaded
   */
  loadSnapLibrary: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Skip if already loaded or not in browser
      if (typeof window === 'undefined' || window.snap) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://app.midtrans.com/snap/snap.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(new Error('Failed to load Midtrans Snap library'));
      document.head.appendChild(script);
    });
  }
};

// Add TypeScript interface for global window object with Snap
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    }
  }
}
