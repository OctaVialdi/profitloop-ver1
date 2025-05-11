
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Download, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Invoice } from "@/types/organization";
import { InvoiceDetailDialog } from "./InvoiceDetailDialog";

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
}

export function InvoiceHistoryTable({
  invoices,
  isLoading,
  totalCount,
  page,
  setPage,
  limit,
  setLimit,
  filterStatus,
  setFilterStatus,
}: InvoiceHistoryTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const totalPages = Math.ceil(totalCount / limit);

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailOpen(true);
  };

  const handleDownload = (invoice: Invoice) => {
    if (invoice.invoice_pdf_url) {
      window.open(invoice.invoice_pdf_url, "_blank");
    }
  };

  const statusColors = {
    paid: "bg-green-100 text-green-800 border-green-300",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    overdue: "bg-red-100 text-red-800 border-red-300",
    canceled: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-xl font-bold mb-4 lg:mb-0">Invoice History</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Select
            value={filterStatus || "all"}
            onValueChange={(value) => setFilterStatus(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="month"
              className="max-w-[180px]"
              onChange={(e) => {
                // Handle date filtering - this would be connected to a date filter prop
                console.log(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <p>No invoices found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => handleViewDetail(invoice)}
                    >
                      {invoice.invoice_number}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(invoice.created_at),
                      "dd MMM yyyy"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: invoice.currency || "IDR",
                      minimumFractionDigits: 0,
                    }).format(invoice.total_amount)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusColors[invoice.status as keyof typeof statusColors] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(invoice)}
                      disabled={!invoice.invoice_pdf_url}
                      title={invoice.invoice_pdf_url ? "Download PDF" : "PDF not available"}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {invoices.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} invoices
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={limit.toString()}
            onValueChange={(value) => setLimit(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-8 w-8 rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="h-8 w-8 rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDetailDialog
          invoice={selectedInvoice}
          open={detailOpen}
          setOpen={setDetailOpen}
        />
      )}
    </Card>
  );
}
