
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Midtrans integration service
 * Handles interactions with Midtrans payment gateway
 */
export const midtransService = {
  /**
   * Create a checkout session for a plan
   * @param planId The ID of the subscription plan
   * @returns Midtrans checkout data including token and redirect URL
   */
  createCheckout: async (planId: string): Promise<{
    token: string;
    redirect_url: string;
    order_id: string;
    client_key: string;
    transaction_id: string;
  } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("create-midtrans-checkout", {
        body: { 
          planId,
          successUrl: window.location.origin + "/settings/subscription?success=true",
          cancelUrl: window.location.origin + "/settings/subscription?canceled=true"
        }
      });
      
      if (error) throw new Error(`Error creating checkout: ${error.message}`);
      if (!data?.token) throw new Error("No checkout token returned");
      
      return data;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Gagal memuat halaman pembayaran. Silakan coba lagi.");
      return null;
    }
  },
  
  /**
   * Verify payment status by order ID
   * @param orderId The order ID to check
   * @returns Payment status information
   */
  checkPaymentStatus: async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*, subscription_plan:subscription_plans(*)")
        .eq("order_id", orderId)
        .single();
      
      if (error) throw new Error(`Error checking payment: ${error.message}`);
      
      return {
        success: data?.status === "success",
        status: data?.status || "unknown",
        subscription_plan: data?.subscription_plan || null,
        transaction: data
      };
    } catch (error) {
      console.error("Error checking payment status:", error);
      return { success: false, status: "error", subscription_plan: null, transaction: null };
    }
  },
  
  /**
   * Open Midtrans checkout snap in modal
   * @param token The Midtrans snap token
   * @param onSuccess Callback for successful payment
   * @param onError Callback for payment error
   * @param onClose Callback when modal is closed
   */
  openSnapModal: async (
    token: string,
    onSuccess?: () => void,
    onError?: (error: any) => void,
    onClose?: () => void
  ) => {
    try {
      // Wait for the Midtrans Snap script to load
      if (!window.snap) {
        // Load the Midtrans Snap script if not already loaded
        const script = document.createElement("script");
        script.src = "https://app.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "YOUR_CLIENT_KEY"); // This is public so it's ok
        document.body.appendChild(script);
        
        // Wait for the script to load
        await new Promise(resolve => {
          script.onload = resolve;
        });
      }
      
      // Open the Snap modal
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: () => {
            toast.success("Pembayaran berhasil!");
            if (onSuccess) onSuccess();
          },
          onPending: () => {
            toast.info("Pembayaran sedang diproses.");
          },
          onError: (error: any) => {
            console.error("Payment error:", error);
            toast.error("Pembayaran gagal. Silakan coba lagi.");
            if (onError) onError(error);
          },
          onClose: () => {
            toast.info("Modal pembayaran ditutup.");
            if (onClose) onClose();
          }
        });
      }
    } catch (error) {
      console.error("Error opening Snap modal:", error);
      toast.error("Gagal membuka halaman pembayaran. Silakan coba lagi.");
    }
  },
  
  /**
   * Redirect to Midtrans checkout URL
   * @param redirectUrl The Midtrans redirect URL
   */
  redirectToPayment: (redirectUrl: string) => {
    window.location.href = redirectUrl;
  },
  
  /**
   * Redirect to checkout page
   * @param redirectUrl The checkout URL
   */
  redirectToCheckout: (redirectUrl: string) => {
    window.location.href = redirectUrl;
  }
};
