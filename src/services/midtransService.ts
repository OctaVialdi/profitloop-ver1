
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Midtrans integration service
 * Handles interactions with Midtrans payment gateway edge functions
 */
export const midtransService = {
  /**
   * Create a payment transaction for a plan using Midtrans
   * @param planId The slug of the subscription plan
   * @returns The token and redirect URL for Midtrans payment page
   */
  createPayment: async (planId: string): Promise<{ token: string, redirectUrl: string, orderId: string } | null> => {
    try {
      // Use hardcoded URL for standard_plan
      if (planId === 'standard_plan') {
        const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Log the direct URL usage
        console.log("Using direct Midtrans URL for standard_plan with orderId:", orderId);
        
        // Get user organization from profiles
        const { data: profileData } = await supabase.auth.getUser();
        
        if (!profileData?.user) {
          throw new Error("User not authenticated");
        }
        
        const { data: userData } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", profileData.user.id)
          .single();
          
        if (!userData?.organization_id) {
          throw new Error("User organization not found");
        }
        
        // Store transaction in database to track it
        const { error: transactionError } = await supabase
          .from("payment_transactions")
          .insert({
            order_id: orderId,
            organization_id: userData.organization_id,
            subscription_plan_id: planId,
            payment_gateway: "midtrans",
            payment_provider: "midtrans",
            amount: 299000,
            currency: "IDR",
            status: "pending",
            payment_url: "https://app.midtrans.com/payment-links/1746870370812"
          });
          
        if (transactionError) {
          console.error("Error storing transaction:", transactionError);
          // Continue anyway as this is not critical for user experience
        }
        
        return {
          token: "direct-url-token",
          redirectUrl: "https://app.midtrans.com/payment-links/1746870370812",
          orderId: orderId
        };
      }
      
      // For other plans, use the normal flow with edge function
      const { data, error } = await supabase.functions.invoke("create-midtrans-payment", {
        body: { planId }
      });
      
      if (error) {
        console.error("Midtrans payment error:", error);
        throw new Error(`Error creating payment: ${error.message || "Terjadi kesalahan pada sistem pembayaran"}`);
      }
      
      if (!data?.token || !data?.redirectUrl) {
        console.error("Invalid Midtrans response:", data);
        throw new Error("Data pembayaran tidak lengkap dari server");
      }
      
      // Log successful request for debugging
      console.log("Payment initialized successfully:", {
        planId,
        orderId: data.orderId,
        hasToken: !!data.token,
        hasRedirectUrl: !!data.redirectUrl
      });
      
      return {
        token: data.token,
        redirectUrl: data.redirectUrl,
        orderId: data.orderId
      };
    } catch (error) {
      console.error("Error creating Midtrans payment:", error);
      toast.error(`Gagal memuat halaman pembayaran: ${error.message || "Silakan coba lagi"}`);
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
      
      if (error) {
        console.error("Error verifying payment status:", error);
        throw new Error(`Error verifying payment: ${error.message}`);
      }
      
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
   * Open Midtrans payment page directly by redirecting to the URL
   * @param redirectUrl The Midtrans payment redirect URL
   */
  redirectToPayment: (redirectUrl: string): void => {
    if (!redirectUrl) {
      toast.error("URL pembayaran tidak valid");
      return;
    }
    
    // Log redirection
    console.log("Redirecting to Midtrans payment page:", redirectUrl);
    
    // Redirect the browser to the Midtrans payment page
    window.location.href = redirectUrl;
  },
  
  /**
   * Load Midtrans Snap library - kept for backward compatibility
   * @returns Promise that resolves when the library is loaded
   */
  loadSnapLibrary: (): Promise<void> => {
    return new Promise((resolve) => {
      // This function is mostly for backward compatibility
      // Direct redirection is now the preferred payment method
      console.log("Note: Direct redirection is now the preferred payment method");
      resolve();
    });
  }
};

// Keep TypeScript interface for global window object with Snap
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
