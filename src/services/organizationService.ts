
import { supabase } from "@/integrations/supabase/client";
import { Organization, SubscriptionPlan, BillingSettings, Invoice, InvoiceHistoryResponse, BillingPaymentMethod } from "@/types/organization";
import { OrganizationFormData } from "@/types/onboarding";
import { parseJsonIfString } from "@/utils/jsonUtils";

class OrganizationService {
  async getOrganization(organizationId: string): Promise<Organization | null> {
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
      themeSettings = parseJsonIfString(themeSettings, {
        primary_color: "#1E40AF",
        secondary_color: "#3B82F6",
        accent_color: "#60A5FA",
        sidebar_color: "#F1F5F9",
      });
      
      const subscriptionStatus = orgData.subscription_status as 'trial' | 'active' | 'expired' || 'trial';
      
      return {
        ...orgData as unknown as Organization,
        theme_settings: themeSettings,
        trial_expired: orgData.trial_expired !== null ? orgData.trial_expired : false,
        subscription_status: subscriptionStatus,
        trial_start_date: orgData.trial_start_date || null,
        grace_period_end: orgData.grace_period_end || null,
        stripe_customer_id: orgData.stripe_customer_id || null,
        billing_email: orgData.billing_email || null
      };
    } catch (error) {
      console.error("Error fetching organization:", error);
      throw error;
    }
  }

  async getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
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
      const features = parseJsonIfString<Record<string, any> | null>(planData.features, null);
      
      return {
        ...planData,
        features
      } as SubscriptionPlan;
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
      return null;
    }
  }

  // Get organization's billing settings
  async getBillingSettings(organizationId: string): Promise<BillingSettings | null> {
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

      if (!data) return null;

      // Parse payment_method JSON if it's a string
      const paymentMethod = parseJsonIfString<BillingPaymentMethod | null>(data.payment_method, null);

      // Parse invoice_address JSON if it's a string
      const invoiceAddress = parseJsonIfString<any>(data.invoice_address, null);

      return {
        id: data.id,
        organization_id: data.organization_id,
        payment_method: paymentMethod,
        invoice_address: invoiceAddress,
        last_payment_date: data.last_payment_date,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error("Error in getBillingSettings:", error);
      return null;
    }
  }

  // Save or update billing settings
  async saveBillingSettings(settings: BillingSettings): Promise<BillingSettings | null> {
    try {
      // Check if settings exist for this organization
      const { data: existingSettings } = await supabase
        .from('billing_settings')
        .select('id')
        .eq('organization_id', settings.organization_id)
        .maybeSingle();
        
      let result;
      
      const dataToUpsert = {
        payment_method: settings.payment_method ? JSON.stringify(settings.payment_method) : null,
        invoice_address: settings.invoice_address ? JSON.stringify(settings.invoice_address) : null,
        last_payment_date: settings.last_payment_date,
        organization_id: settings.organization_id
      };
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('billing_settings')
          .update(dataToUpsert)
          .eq('id', existingSettings.id)
          .select()
          .single();
      } else {
        // Create new settings
        result = await supabase
          .from('billing_settings')
          .insert(dataToUpsert)
          .select()
          .single();
      }
      
      if (result.error) {
        console.error("Error saving billing settings:", result.error);
        throw result.error;
      }
      
      // Parse back the JSON fields
      const resultData = result.data;
      const paymentMethod = parseJsonIfString<BillingPaymentMethod | null>(resultData.payment_method, null);
      const invoiceAddress = parseJsonIfString<any>(resultData.invoice_address, null);
      
      return {
        id: resultData.id,
        organization_id: resultData.organization_id,
        payment_method: paymentMethod,
        invoice_address: invoiceAddress,
        last_payment_date: resultData.last_payment_date,
        created_at: resultData.created_at,
        updated_at: resultData.updated_at
      };
    } catch (error) {
      console.error("Error in saveBillingSettings:", error);
      return null;
    }
  }

  // Get invoices for an organization with pagination
  async getOrganizationInvoices(
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
      
      // Parse payment_details if it's a string
      const invoices = data.map(invoice => {
        const paymentDetails = parseJsonIfString<any>(invoice.payment_details, null);
        
        return {
          ...invoice,
          payment_details: paymentDetails
        };
      });
      
      return {
        invoices: invoices as Invoice[],
        total_count: count || 0
      };
    } catch (error) {
      console.error("Error in getOrganizationInvoices:", error);
      return { invoices: [], total_count: 0 };
    }
  }

  // Get a single invoice by ID
  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
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
      
      if (!data) return null;
      
      // Parse payment_details if it's a string
      const paymentDetails = parseJsonIfString<any>(data.payment_details, null);
      
      return {
        ...data,
        payment_details: paymentDetails
      } as Invoice;
    } catch (error) {
      console.error("Error in getInvoiceById:", error);
      return null;
    }
  }
}

// Export the service as a singleton instance
export const organizationService = new OrganizationService();
export const { getOrganization, getSubscriptionPlan } = organizationService;
