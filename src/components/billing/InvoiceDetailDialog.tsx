
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Calendar, CreditCard, Building } from "lucide-react";
import { Invoice } from "@/types/organization";

interface InvoiceDetailDialogProps {
  invoice: Invoice;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function InvoiceDetailDialog({
  invoice,
  open,
  setOpen,
}: InvoiceDetailDialogProps) {
  const handleDownload = () => {
    if (invoice.invoice_pdf_url) {
      window.open(invoice.invoice_pdf_url, "_blank");
    }
  };

  const statusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
  };

  // Format currency amounts
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: invoice.currency || "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Invoice #{invoice.invoice_number}</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[invoice.status as keyof typeof statusColors] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </DialogTitle>
          <DialogDescription>
            {format(new Date(invoice.created_at), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Invoice date:{" "}
                {format(new Date(invoice.created_at), "dd MMMM yyyy")}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Due date: {format(new Date(invoice.due_date), "dd MMMM yyyy")}
              </span>
            </div>

            {invoice.payment_details?.method && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>
                  Payment method: {invoice.payment_details.method}
                </span>
              </div>
            )}

            {invoice.payment_details?.billingName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>
                  Billed to: {invoice.payment_details.billingName}
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Invoice Summary</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y">
                  <tr className="bg-muted/50">
                    <td className="px-4 py-2 font-medium">Description</td>
                    <td className="px-4 py-2 text-right">Amount</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">
                      Subscription Plan
                      {invoice.payment_details?.planName &&
                        ` - ${invoice.payment_details.planName}`}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(invoice.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Tax</td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(invoice.tax_amount)}
                    </td>
                  </tr>
                  <tr className="font-medium">
                    <td className="px-4 py-2">Total</td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={!invoice.invoice_pdf_url}
              title={invoice.invoice_pdf_url ? "Download PDF" : "PDF not available"}
            >
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
