
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Service to handle subscription notifications and reminders
 */
export const subscriptionNotificationService = {
  /**
   * Send trial expiration reminder to user
   * @param organizationId The organization ID
   * @param daysLeft Days left in trial
   * @param userEmail User email to send notification to
   */
  sendTrialExpirationReminder: async (
    organizationId: string,
    daysLeft: number,
    userEmail: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke("send-trial-reminder", {
        body: { 
          organizationId,
          daysLeft,
          email: userEmail
        }
      });
      
      if (error) throw new Error(`Error sending trial reminder: ${error.message}`);
      
      // Track this notification in local storage to prevent duplicate sends
      localStorage.setItem(`trial_reminder_${organizationId}_${daysLeft}`, new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error("Error sending trial reminder:", error);
      return false;
    }
  },
  
  /**
   * Create in-app notifications for trial expiration
   * @param organizationId The organization ID
   * @param daysLeft Days left in trial
   */
  createTrialExpirationNotification: async (
    organizationId: string,
    daysLeft: number
  ): Promise<boolean> => {
    try {
      // Get all admin users in the organization
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("organization_id", organizationId)
        .in("role", ["super_admin", "admin"]);
      
      if (!admins || admins.length === 0) return false;
      
      // Determine notification message based on days left
      let message = "";
      let title = "";
      let type: "info" | "warning" | "error" = "info";
      
      if (daysLeft <= 1) {
        title = "Trial Berakhir Besok!";
        message = "Trial Anda akan berakhir dalam 24 jam. Upgrade sekarang untuk menjaga akses ke semua fitur.";
        type = "error";
      } else if (daysLeft <= 3) {
        title = "Trial Hampir Berakhir";
        message = `Trial Anda akan berakhir dalam ${daysLeft} hari. Segera upgrade untuk menghindari kehilangan akses.`;
        type = "warning";
      } else if (daysLeft <= 7) {
        title = "Pengingat Trial";
        message = `Trial Anda akan berakhir dalam ${daysLeft} hari. Pertimbangkan untuk upgrade sekarang.`;
        type = "info";
      } else {
        return false; // Don't create notification for more than 7 days left
      }
      
      // Create notifications for all admins
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        organization_id: organizationId,
        title,
        message,
        type,
        action_url: "/settings/subscription"
      }));
      
      const { error } = await supabase
        .from("notifications")
        .insert(notifications);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error creating trial expiration notification:", error);
      return false;
    }
  },
  
  /**
   * Show toast notification for trial expiration
   * @param daysLeft Days left in trial
   * @param navigate Navigation function
   */
  showTrialExpirationToast: (
    daysLeft: number,
    navigate: (path: string) => void
  ) => {
    const storageKey = `trial_toast_${daysLeft}`;
    const lastShown = localStorage.getItem(storageKey);
    const today = new Date().toDateString();
    
    // Only show once per day per daysLeft value
    if (lastShown !== today) {
      let message = "";
      let duration = 8000; // Default duration
      
      if (daysLeft <= 1) {
        message = "Trial Anda akan berakhir dalam kurang dari 24 jam! Upgrade sekarang untuk menghindari gangguan layanan.";
        duration = 15000; // Longer duration for urgent messages
      } else if (daysLeft <= 3) {
        message = `Trial Anda akan berakhir dalam ${daysLeft} hari. Segera upgrade untuk menghindari kehilangan akses.`;
        duration = 12000;
      } else if (daysLeft <= 7) {
        message = `Trial Anda akan berakhir dalam ${daysLeft} hari. Pertimbangkan untuk upgrade sekarang.`;
        duration = 10000;
      } else {
        return; // Don't show toast for more than 7 days left
      }
      
      toast.warning(message, {
        duration,
        action: {
          label: "Upgrade",
          onClick: () => navigate("/settings/subscription")
        }
      });
      
      // Save that we've shown this toast today
      localStorage.setItem(storageKey, today);
    }
  },
  
  /**
   * Show payment success toast notification
   * @param planName The name of the subscription plan
   */
  showPaymentSuccessToast: (planName: string) => {
    toast.success(
      `Pembayaran untuk paket ${planName} berhasil! Akun Anda telah diupgrade.`, 
      { duration: 10000 }
    );
  },
  
  /**
   * Show payment error toast notification
   */
  showPaymentErrorToast: () => {
    toast.error(
      "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi atau hubungi dukungan.", 
      { duration: 8000 }
    );
  },
  
  /**
   * Show payment pending toast notification
   */
  showPaymentPendingToast: () => {
    toast.info(
      "Pembayaran Anda sedang diproses. Status langganan akan diperbarui setelah pembayaran selesai.", 
      { duration: 8000 }
    );
  }
};
