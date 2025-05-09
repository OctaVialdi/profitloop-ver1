
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Get request body
    const requestData = await req.json();
    const { invoiceId } = requestData;
    
    if (!invoiceId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invoice ID is required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
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
        organization_id,
        subscription_plan_id,
        subscription_plans:subscription_plan_id (name)
      `)
      .eq("id", invoiceId)
      .single();
      
    if (invoiceError || !invoice) {
      return new Response(
        JSON.stringify({ success: false, message: "Invoice not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Get organization details
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select(`
        id,
        name,
        address,
        phone,
        company_profiles (
          email,
          tax_id
        )
      `)
      .eq("id", invoice.organization_id)
      .single();
      
    if (orgError || !organization) {
      return new Response(
        JSON.stringify({ success: false, message: "Organization not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Get transaction details if available
    const { data: transactions } = await supabase
      .from("payment_transactions")
      .select(`
        id,
        payment_provider,
        payment_details,
        status,
        payment_methods:payment_method_id (name, type)
      `)
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: false })
      .limit(1);
    
    const transaction = transactions && transactions.length > 0 ? transactions[0] : null;
    
    // Create PDF invoice
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    
    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const { width, height } = page.getSize();
    const margin = 50;
    
    // Add header
    page.drawText("INVOICE", {
      x: margin,
      y: height - margin,
      size: 24,
      font: helveticaBold,
    });
    
    // Invoice details
    page.drawText(`Nomor: ${invoice.invoice_number}`, {
      x: margin,
      y: height - margin - 30,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Tanggal: ${new Date(invoice.created_at).toLocaleDateString('id-ID')}`, {
      x: margin,
      y: height - margin - 50,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText(`Status: ${invoice.status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}`, {
      x: margin,
      y: height - margin - 70,
      size: 12,
      font: invoice.status === 'paid' ? helveticaBold : helveticaFont,
      color: invoice.status === 'paid' ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
    });
    
    // Organization details (bill to)
    page.drawText("Tagihan Untuk:", {
      x: margin,
      y: height - margin - 110,
      size: 12,
      font: helveticaBold,
    });
    
    page.drawText(organization.name, {
      x: margin,
      y: height - margin - 130,
      size: 12,
      font: helveticaFont,
    });
    
    if (organization.address) {
      page.drawText(organization.address, {
        x: margin,
        y: height - margin - 150,
        size: 10,
        font: helveticaFont,
      });
    }
    
    if (organization.company_profiles && organization.company_profiles.email) {
      page.drawText(`Email: ${organization.company_profiles.email}`, {
        x: margin,
        y: height - margin - 170,
        size: 10,
        font: helveticaFont,
      });
    }
    
    if (organization.phone) {
      page.drawText(`Phone: ${organization.phone}`, {
        x: margin,
        y: height - margin - 190,
        size: 10,
        font: helveticaFont,
      });
    }
    
    if (organization.company_profiles && organization.company_profiles.tax_id) {
      page.drawText(`NPWP: ${organization.company_profiles.tax_id}`, {
        x: margin,
        y: height - margin - 210,
        size: 10,
        font: helveticaFont,
      });
    }
    
    // Our company details
    page.drawText("Dari:", {
      x: width - margin - 200,
      y: height - margin - 110,
      size: 12,
      font: helveticaBold,
    });
    
    page.drawText("PT Aplikasi Indonesia", {
      x: width - margin - 200,
      y: height - margin - 130,
      size: 12,
      font: helveticaFont,
    });
    
    page.drawText("Jl. Teknologi No. 123", {
      x: width - margin - 200,
      y: height - margin - 150,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText("Jakarta Selatan, DKI Jakarta", {
      x: width - margin - 200,
      y: height - margin - 170,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText("info@aplikasi-indonesia.com", {
      x: width - margin - 200,
      y: height - margin - 190,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText("NPWP: 12.345.678.9-012.000", {
      x: width - margin - 200,
      y: height - margin - 210,
      size: 10,
      font: helveticaFont,
    });
    
    // Invoice table header
    const tableTop = height - margin - 260;
    const tableColWidths = [250, 70, 70, 100];
    const tableStartX = margin;
    
    // Table header background
    page.drawRectangle({
      x: tableStartX,
      y: tableTop - 20,
      width: tableColWidths.reduce((acc, val) => acc + val, 0),
      height: 20,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    // Table headers
    const headerLabels = ["Description", "Qty", "Price", "Amount"];
    let currentX = tableStartX + 10;
    
    headerLabels.forEach((label, index) => {
      page.drawText(label, {
        x: currentX,
        y: tableTop - 15,
        size: 10,
        font: helveticaBold,
      });
      currentX += tableColWidths[index];
    });
    
    // Table content
    const planName = invoice.subscription_plans ? invoice.subscription_plans.name : "Subscription";
    const rowY = tableTop - 40;
    
    // Draw row border lines
    page.drawLine({
      start: { x: tableStartX, y: tableTop },
      end: { x: tableStartX + tableColWidths.reduce((acc, val) => acc + val, 0), y: tableTop },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawLine({
      start: { x: tableStartX, y: tableTop - 20 },
      end: { x: tableStartX + tableColWidths.reduce((acc, val) => acc + val, 0), y: tableTop - 20 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    // Add subscription item
    page.drawText(`${planName} Plan Subscription`, {
      x: tableStartX + 10,
      y: rowY,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText("1", {
      x: tableStartX + tableColWidths[0] + 10,
      y: rowY,
      size: 10,
      font: helveticaFont,
    });
    
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: invoice.currency,
      minimumFractionDigits: 0,
    }).format(invoice.amount);
    
    page.drawText(formattedPrice, {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + 10,
      y: rowY,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText(formattedPrice, {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] + 10,
      y: rowY,
      size: 10,
      font: helveticaFont,
    });
    
    // Bottom line
    page.drawLine({
      start: { x: tableStartX, y: rowY - 10 },
      end: { x: tableStartX + tableColWidths.reduce((acc, val) => acc + val, 0), y: rowY - 10 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    // Summary section
    const summaryStartY = rowY - 50;
    
    // Draw summary box
    page.drawRectangle({
      x: tableStartX + tableColWidths[0] + tableColWidths[1],
      y: summaryStartY - 70,
      width: tableColWidths[2] + tableColWidths[3],
      height: 70,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    
    // Subtotal
    page.drawText("Subtotal:", {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + 10,
      y: summaryStartY - 20,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText(formattedPrice, {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] + 10,
      y: summaryStartY - 20,
      size: 10,
      font: helveticaFont,
    });
    
    // Tax
    const formattedTax = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: invoice.currency,
      minimumFractionDigits: 0,
    }).format(invoice.tax_amount);
    
    page.drawText("Tax:", {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + 10,
      y: summaryStartY - 40,
      size: 10,
      font: helveticaFont,
    });
    
    page.drawText(formattedTax, {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] + 10,
      y: summaryStartY - 40,
      size: 10,
      font: helveticaFont,
    });
    
    // Total
    const formattedTotal = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: invoice.currency,
      minimumFractionDigits: 0,
    }).format(invoice.total_amount);
    
    page.drawText("Total:", {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + 10,
      y: summaryStartY - 60,
      size: 10,
      font: helveticaBold,
    });
    
    page.drawText(formattedTotal, {
      x: tableStartX + tableColWidths[0] + tableColWidths[1] + tableColWidths[2] + 10,
      y: summaryStartY - 60,
      size: 10,
      font: helveticaBold,
    });
    
    // Payment information
    if (transaction) {
      const paymentInfoY = summaryStartY - 120;
      
      page.drawText("Informasi Pembayaran:", {
        x: margin,
        y: paymentInfoY,
        size: 12,
        font: helveticaBold,
      });
      
      page.drawText(`Metode: ${transaction.payment_methods?.name || 'Unknown'}`, {
        x: margin,
        y: paymentInfoY - 20,
        size: 10,
        font: helveticaFont,
      });
      
      page.drawText(`Status: ${
        transaction.status === 'completed' ? 'Pembayaran Berhasil' : 
        transaction.status === 'pending' ? 'Menunggu Pembayaran' : 
        transaction.status === 'failed' ? 'Pembayaran Gagal' : 
        'Status Tidak Diketahui'
      }`, {
        x: margin,
        y: paymentInfoY - 40,
        size: 10,
        font: helveticaFont,
      });
      
      if (transaction.status === 'completed') {
        page.drawText(`Tanggal Pembayaran: ${new Date().toLocaleDateString('id-ID')}`, {
          x: margin,
          y: paymentInfoY - 60,
          size: 10,
          font: helveticaFont,
        });
      }
    }
    
    // Terms and conditions
    page.drawText("Syarat dan Ketentuan:", {
      x: margin,
      y: 150,
      size: 10,
      font: helveticaBold,
    });
    
    const terms = [
      "1. Pembayaran harus dilakukan sebelum tanggal jatuh tempo.",
      "2. Layanan akan aktif setelah pembayaran berhasil diproses.",
      "3. Untuk pertanyaan mengenai invoice ini, silakan hubungi support@aplikasi-indonesia.com"
    ];
    
    terms.forEach((term, index) => {
      page.drawText(term, {
        x: margin,
        y: 130 - (index * 15),
        size: 8,
        font: helveticaFont,
      });
    });
    
    // Thank you note
    page.drawText("Terima kasih atas kepercayaan Anda menggunakan layanan kami.", {
      x: margin,
      y: 70,
      size: 10,
      font: helveticaFont,
    });
    
    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert to base64 for easier handling
    const base64Pdf = btoa(
      new Uint8Array(pdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    // In a real implementation, you'd upload this to Storage
    // For this example, we'll just store a reference that it was generated
    
    // Update the invoice record with PDF URL (in real implementation)
    await supabase
      .from("invoices")
      .update({
        invoice_pdf_url: `invoice_${invoiceId}.pdf`, // This would be a real URL in production
        payment_details: {
          ...invoice.payment_details,
          pdf_generated: true
        }
      })
      .eq("id", invoiceId);
    
    // Return success with base64 PDF data
    // In production, you might want to upload this to Storage first
    return new Response(
      JSON.stringify({
        success: true,
        invoice_id: invoiceId,
        invoice_number: invoice.invoice_number,
        pdf_data: base64Pdf
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error generating invoice:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred while generating the invoice",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
