
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { BillingAddressForm } from "@/components/billing/BillingAddressForm";
import { InvoiceHistoryTable } from "@/components/billing/InvoiceHistoryTable";
import { PaymentMethodSection } from "@/components/billing/PaymentMethodSection";
import { CustomerPortalSection } from "@/components/billing/CustomerPortalSection";
import { organizationService } from "@/services/organizationService";
import { BillingSettings as BillingSettingsType, Invoice } from "@/types/organization";

const BillingSettings: React.FC = () => {
  const { organization, hasPaidSubscription } = useOrganization();
  
  const [billingSettings, setBillingSettings] = useState<BillingSettingsType | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalInvoiceCount, setTotalInvoiceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  
  // Fetch billing settings and invoices
  useEffect(() => {
    const loadBillingData = async () => {
      if (!organization?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch billing settings
        const settings = await organizationService.getBillingSettings(organization.id);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBillingData();
  }, [organization?.id, page, limit, filterStatus]);
  
  const handleRefreshData = () => {
    if (organization?.id) {
      setIsLoading(true);
      Promise.all([
        organizationService.getBillingSettings(organization.id),
        organizationService.getOrganizationInvoices(
          organization.id,
          page,
          limit,
          filterStatus as 'paid' | 'unpaid' | 'pending' | undefined
        )
      ]).then(([settings, invoiceResponse]) => {
        setBillingSettings(settings);
        setInvoices(invoiceResponse.invoices);
        setTotalInvoiceCount(invoiceResponse.total_count);
        setIsLoading(false);
      }).catch(error => {
        console.error('Error refreshing data:', error);
        setIsLoading(false);
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Billing Settings</h1>
      
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
      <CustomerPortalSection subscriptionActive={!!hasPaidSubscription} />
    </div>
  );
};

export default BillingSettings;
