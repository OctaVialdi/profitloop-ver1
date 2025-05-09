
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PaymentMethod } from "@/types/payment";

interface CreatePaymentParams {
  organizationId: string;
  planId: string;
  paymentMethodCode: string;
}

interface PaymentResponse {
  transaction: {
    id: string;
    status: string;
    payment_url: string;
    payment_details: Record<string, any>;
    expires_at: string;
  };
  invoice: {
    id: string;
    invoice_number: string;
    amount: number;
  };
}

export const createPayment = async (params: CreatePaymentParams): Promise<PaymentResponse | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: params,
    });

    if (error) {
      console.error('Error creating payment:', error);
      toast.error('Gagal membuat pembayaran. Silakan coba lagi.');
      return null;
    }

    if (!data.success) {
      console.error('Payment creation failed:', data.message);
      toast.error(data.message || 'Gagal membuat pembayaran. Silakan coba lagi.');
      return null;
    }

    return data as PaymentResponse;
  } catch (error) {
    console.error('Error creating payment:', error);
    toast.error('Terjadi kesalahan saat membuat pembayaran');
    return null;
  }
};

export const generateInvoicePdf = async (invoiceId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-invoice', {
      body: { invoiceId },
    });

    if (error) {
      console.error('Error generating invoice:', error);
      toast.error('Gagal membuat invoice PDF. Silakan coba lagi.');
      return null;
    }

    if (!data.success) {
      console.error('Invoice generation failed:', data.message);
      toast.error(data.message || 'Gagal membuat invoice PDF. Silakan coba lagi.');
      return null;
    }

    return data.pdf_data; // Base64 PDF data
  } catch (error) {
    console.error('Error generating invoice:', error);
    toast.error('Terjadi kesalahan saat membuat invoice PDF');
    return null;
  }
};

export const getInvoices = async (organizationId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        id,
        invoice_number,
        amount,
        tax_amount,
        total_amount,
        currency,
        status,
        due_date,
        created_at,
        subscription_plans (id, name),
        payment_transactions (id, status, payment_url, payment_details, payment_methods (name))
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Gagal mengambil data invoice');
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    toast.error('Terjadi kesalahan saat mengambil data invoice');
    return [];
  }
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }

    // Ensure the data is properly typed
    return (data as PaymentMethod[]) || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const formatPrice = (price: number, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};

export const downloadBase64Pdf = (base64Data: string, fileName: string) => {
  const linkSource = `data:application/pdf;base64,${base64Data}`;
  const downloadLink = document.createElement('a');
  
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};
