
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export async function createStripeCustomerPortalLink(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      method: 'POST'
    });

    if (error) {
      console.error("Error creating customer portal link:", error);
      toast.error("Failed to create customer portal link");
      return null;
    }

    return data.url;
  } catch (error) {
    console.error("Error in createStripeCustomerPortalLink:", error);
    toast.error("Failed to create customer portal link");
    return null;
  }
}

export async function redirectToStripeCustomerPortal(): Promise<boolean> {
  try {
    const url = await createStripeCustomerPortalLink();
    
    if (!url) {
      return false;
    }
    
    window.location.href = url;
    return true;
  } catch (error) {
    console.error("Error redirecting to customer portal:", error);
    toast.error("Failed to access customer portal");
    return false;
  }
}
