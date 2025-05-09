
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Clock, ExternalLink } from "lucide-react";

interface BillingRecord {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  status: string;
  invoice_url?: string;
  details?: any;
}

const BillingHistory = () => {
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { organization } = useOrganization();

  useEffect(() => {
    const fetchBillingHistory = async () => {
      if (!organization?.id) return;

      try {
        setLoading(true);
        
        // Use RPC function as workaround for TypeScript issues
        const { data, error } = await supabase.rpc('get_billing_history', {
          org_id: organization.id
        });

        if (error) {
          console.error('Error fetching billing history:', error);
          
          // Fallback - try direct query despite TypeScript errors
          const directQuery = await supabase.from('subscription_audit_logs')
            .select('*')
            .eq('organization_id', organization.id)
            .eq('action', 'payment_succeeded')
            .order('created_at', { ascending: false });
            
          if (directQuery.error) throw directQuery.error;
          
          // Transform to billing records
          const records: BillingRecord[] = (directQuery.data || []).map((record: any) => ({
            id: record.id,
            created_at: record.created_at,
            type: 'subscription_payment',
            amount: record.data?.amount_paid || 0,
            status: 'paid',
            invoice_url: record.data?.invoice_url,
            details: record.data
          }));
          
          setBillingHistory(records);
        } else {
          // Transform to billing records
          const records: BillingRecord[] = (data || []).map((record: any) => ({
            id: record.id,
            created_at: record.created_at,
            type: 'subscription_payment',
            amount: record.data?.amount_paid || 0,
            status: 'paid',
            invoice_url: record.data?.invoice_url,
            details: record.data
          }));
          
          setBillingHistory(records);
        }
      } catch (err) {
        console.error('Error fetching billing history:', err);
        // Set empty array to prevent UI errors
        setBillingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingHistory();
  }, [organization?.id]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Riwayat Pembayaran</h1>
        <p className="text-gray-600">
          Semua transaksi pembayaran langganan Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <p>Memuat riwayat pembayaran...</p>
            </div>
          ) : billingHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada riwayat transaksi</p>
              <p className="text-sm mt-2">Riwayat transaksi akan muncul di sini setelah Anda berlangganan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Deskripsi</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Jumlah</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">{formatDate(record.created_at)}</td>
                      <td className="py-4">Pembayaran Langganan</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Berhasil
                        </span>
                      </td>
                      <td className="py-4">{formatCurrency(record.amount)}</td>
                      <td className="py-4 text-right">
                        {record.invoice_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={record.invoice_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Invoice
                            </a>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory;
