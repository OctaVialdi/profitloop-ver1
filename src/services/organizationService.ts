import { supabase } from "@/integrations/supabase/client";
import { Organization, SubscriptionPlan, BillingSettings, Invoice, InvoiceHistoryResponse } from "@/types/organization";
import { OrganizationFormData } from "@/types/onboarding";

export async function getOrganization(organizationId: string): Promise<Organization | null> {
  try {
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .maybeSingle();
    
    if (orgError) {
      console.error("Organization fetch error:", orgError);
      throw orgError;
    }
    
    if (!orgData) {
      console.error("No organization found with ID:", organizationId);
      return null;
    }
    
    // Ensure theme_settings matches our interface structure
    let themeSettings = orgData.theme_settings || {
      primary_color: "#1E40AF",
      secondary_color: "#3B82F6",
      accent_color: "#60A5FA",
      sidebar_color: "#F1F5F9",
    };
    
    // Convert from JSON string if needed
    if (typeof themeSettings === 'string') {
      try {
        themeSettings = JSON.parse(themeSettings);
      } catch (e) {
        console.warn('Could not parse theme_settings JSON:', e);
        themeSettings = {
          primary_color: "#1E40AF",
          secondary_color: "#3B82F6",
          accent_color: "#60A5FA",
          sidebar_color: "#F1F5F9",
        };
      }
    }
    
    return {
      ...orgData as unknown as Organization,
      theme_settings: themeSettings,
      trial_expired: orgData.trial_expired !== null ? orgData.trial_expired : false,
      subscription_status: orgData.subscription_status as 'trial' | 'active' | 'expired' || 'trial',
      trial_start_date: orgData.trial_start_date || null,
      grace_period_end: orgData.grace_period_end || null,
      stripe_customer_id: orgData.stripe_customer_id || null, // Added new field
      billing_email: orgData.billing_email || null // Added new field
    };
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  try {
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .maybeSingle();
        
    if (planError || !planData) {
      return null;
    }
    
    // Parse features from JSON if needed
    let features = planData.features;
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features);
      } catch (e) {
        console.warn('Could not parse features JSON:', e);
        features = null;
      }
    }
    
    return {
      ...planData,
      features
    } as SubscriptionPlan;
  } catch (error) {
    console.error("Error fetching subscription plan:", error);
    return null;
  }
}

// New function to get organization's billing settings
export async function getBillingSettings(organizationId: string): Promise<BillingSettings | null> {
  try {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('*')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching billing settings:", error);
      throw error;
    }

    return data as BillingSettings;
  } catch (error) {
    console.error("Error in getBillingSettings:", error);
    return null;
  }
}

// Save or update billing settings
export async function saveBillingSettings(settings: BillingSettings): Promise<BillingSettings | null> {
  try {
    // Check if settings exist for this organization
    const { data: existingSettings } = await supabase
      .from('billing_settings')
      .select('id')
      .eq('organization_id', settings.organization_id)
      .maybeSingle();
      
    let result;
    
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('billing_settings')
        .update({
          payment_method: settings.payment_method,
          invoice_address: settings.invoice_address,
          last_payment_date: settings.last_payment_date
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Create new settings
      result = await supabase
        .from('billing_settings')
        .insert({
          organization_id: settings.organization_id,
          payment_method: settings.payment_method,
          invoice_address: settings.invoice_address,
          last_payment_date: settings.last_payment_date
        })
        .select()
        .single();
    }
    
    if (result.error) {
      console.error("Error saving billing settings:", result.error);
      throw result.error;
    }
    
    return result.data as BillingSettings;
  } catch (error) {
    console.error("Error in saveBillingSettings:", error);
    return null;
  }
}

// Get invoices for an organization with pagination
export async function getOrganizationInvoices(
  organizationId: string,
  page: number = 1,
  limit: number = 10,
  status?: 'paid' | 'unpaid' | 'pending'
): Promise<InvoiceHistoryResponse> {
  try {
    let query = supabase
      .from('invoices')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('due_date', { ascending: false });
      
    // Add status filter if specified
    if (status) {
      query = query.eq('status', status);
    }
    
    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
    
    return {
      invoices: data as Invoice[],
      total_count: count || 0
    };
  } catch (error) {
    console.error("Error in getOrganizationInvoices:", error);
    return { invoices: [], total_count: 0 };
  }
}

// Get a single invoice by ID
export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
    
    return data as Invoice;
  } catch (error) {
    console.error("Error in getInvoiceById:", error);
    return null;
  }
}
