
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoice_id");
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoiceId) {
        navigate("/subscription");
        return;
      }

      try {
        // Get invoice details
        const { data: invoice, error } = await supabase
          .from("invoices")
          .select(`
            id,
            invoice_number,
            status,
            subscription_plans(name)
          `)
          .eq("id", invoiceId)
          .single();

        if (error || !invoice) {
          throw new Error("Invoice not found");
        }

        setInvoiceData(invoice);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        navigate("/subscription");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [invoiceId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Memuat...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Pembayaran Berhasil</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <p>Terima kasih atas pembayaran Anda.</p>
          <p className="text-gray-600 text-sm">
            Invoice #{invoiceData?.invoice_number} untuk layanan {invoiceData?.subscription_plans?.name} telah berhasil dibayar.
          </p>
          <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-4">
            <p className="text-green-800 text-sm">
              Akun Anda telah diaktifkan dan Anda sekarang memiliki akses ke semua fitur.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/subscription">Kembali ke Halaman Langganan</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
