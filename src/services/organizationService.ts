import { supabase } from "@/integrations/supabase/client";
import { Organization } from "@/types/organization";
import { SubscriptionPlan } from "@/types/subscription";

export const getOrganization = async (organizationId: string): Promise<Organization | null> => {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Cast to Organization type and handle potential missing fields
    const organization: Organization = {
      ...data,
      logo_path: data.logo_path || "", // Handle potentially missing logo_path
      grace_period_end: data.grace_period_end || "", // Handle potentially missing grace_period_end
    };

    return organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return null;
  }
};

export const getSubscriptionPlan = async (planId: string): Promise<SubscriptionPlan | null> => {
  try {
    // Direct query to subscription_plans table
    const { data: planData, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error || !planData) {
      console.error("Error fetching subscription plan:", error);
      return null;
    }

    return planData as unknown as SubscriptionPlan;
  } catch (error) {
    console.error("Error in getSubscriptionPlan:", error);
    return null;
  }
};
