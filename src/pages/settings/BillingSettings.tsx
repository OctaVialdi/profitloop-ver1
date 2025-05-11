
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { BillingAddressForm } from "@/components/billing/BillingAddressForm";
import { InvoiceHistoryTable } from "@/components/billing/InvoiceHistoryTable";
import { PaymentMethodSection } from "@/components/billing/PaymentMethodSection";
import { CustomerPortalSection } from "@/components/billing/CustomerPortalSection";
import { organizationService } from "@/services/organizationService";
import { BillingSettings as BillingSettingsType, Invoice } from "@/types/organization";
import { toast } from "sonner";

const BillingSettings: React.FC = () => {
  const { organization, hasPaidSubscription } = useOrganization();
  
  const [billingSettings, setBillingSettings] = useState<BillingSettingsType | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalInvoiceCount, setTotalInvoiceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  
  // Fetch billing settings and invoices
  useEffect(() => {
    const loadBillingData = async () => {
      if (!organization?.id) return;
      
      setIsLoading(true);
      setLoadError(null);
      try {
        // Fetch billing settings
        const settings = await organizationService.getBillingSettings(organization.id);
        console.log("Loaded billing settings:", settings);
        setBillingSettings(settings);
        
        // Fetch invoices
        const invoiceResponse = await organizationService.getOrganizationInvoices(
          organization.id,
          page,
          limit,
          filterStatus as 'paid' | 'unpaid' | 'pending' | undefined
        );
        
        setInvoices(invoiceResponse.invoices);
        setTotalInvoiceCount(invoiceResponse.total_count);
        
        // Get pending invoices for notifications
        const pendingResponse = await organizationService.getOrganizationInvoices(
          organization.id,
          1,
          100,
          'pending'
        );
        setPendingInvoices(pendingResponse.invoices);
        
      } catch (error) {
        console.error('Error loading billing data:', error);
        setLoadError("Failed to load billing data. Please try again later.");
        toast.error("Failed to load billing information");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBillingData();
  }, [organization?.id, page, limit, filterStatus]);
  
  const handleRefreshData = async () => {
    if (organization?.id) {
      setIsLoading(true);
      setLoadError(null);
      try {
        // Fetch billing settings
        const settings = await organizationService.getBillingSettings(organization.id);
        setBillingSettings(settings);
        
        // Fetch invoices with current pagination and filters
        const invoiceResponse = await organizationService.getOrganizationInvoices(
          organization.id,
          page,
          limit,
          filterStatus as 'paid' | 'unpaid' | 'pending' | undefined
        );
        
        setInvoices(invoiceResponse.invoices);
        setTotalInvoiceCount(invoiceResponse.total_count);
        
        toast.success("Billing data refreshed successfully");
      } catch (error) {
        console.error('Error refreshing data:', error);
        setLoadError("Failed to refresh billing data");
        toast.error("Failed to refresh billing information");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Billing Settings</h1>
      
      {loadError && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}

      {/* Billing information note */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Manage your payment information and view your billing history below. Payment methods added here will be used for future subscription payments.
        </AlertDescription>
      </Alert>

      {/* Pending Invoice Notifications */}
      {pendingInvoices.length > 0 && (
        <Alert className="bg-yellow-50 text-yellow-800 border-yellow-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {pendingInvoices.length} pending {pendingInvoices.length === 1 ? 'invoice' : 'invoices'} that {pendingInvoices.length === 1 ? 'requires' : 'require'} payment.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Payment Method Section */}
      <PaymentMethodSection 
        billingSettings={billingSettings} 
        organizationId={organization?.id || null}
        onUpdate={handleRefreshData}
        hasPaidSubscription={!!hasPaidSubscription}
      />
      
      {/* Billing Information Form */}
      <BillingAddressForm 
        billingSettings={billingSettings} 
        organizationId={organization?.id || null}
        onUpdate={handleRefreshData}
      />
      
      {/* Invoice History Table */}
      <InvoiceHistoryTable
        invoices={invoices}
        isLoading={isLoading}
        totalCount={totalInvoiceCount}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {/* Customer Portal Section */}
      <CustomerPortalSection 
        subscriptionActive={!!hasPaidSubscription}
        organizationId={organization?.id || null}
      />
    </div>
  );
};

export default BillingSettings;
