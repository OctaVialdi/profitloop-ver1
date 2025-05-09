
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";

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
    const xenditWebhookToken = Deno.env.get("XENDIT_WEBHOOK_TOKEN") || "";
    
    if (!xenditWebhookToken) {
      console.error("Xendit webhook token not configured");
      throw new Error("Xendit webhook token not configured");
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Get request body
    const requestData = await req.json();
    console.log("Webhook payload received:", JSON.stringify(requestData));
    
    // Verify webhook signature - important for production!
    const xenditSignature = req.headers.get("x-callback-token");
    if (!xenditSignature || xenditSignature !== xenditWebhookToken) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid signature" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }
    
    // Extract necessary information from the webhook payload
    // The structure will vary depending on the payment method
    let externalId = "";
    let paymentStatus = "";
    let paymentId = "";
    let paymentAmount = 0;
    
    // Process different webhook event types
    const eventType = requestData.event || requestData.event_type || "";
    
    switch (eventType) {
      case "virtual_account_payment_paid":
        // Virtual Account payments
        externalId = requestData.external_id;
        paymentStatus = "completed";
        paymentId = requestData.payment_id || requestData.id;
        paymentAmount = requestData.amount || 0;
        break;
        
      case "ewallet.payment_status_updated":
      case "ewallet.payment_succeeded":
        // E-wallet payments
        externalId = requestData.data?.reference_id || "";
        paymentStatus = requestData.data?.status === "SUCCEEDED" ? "completed" : 
                        requestData.data?.status === "FAILED" ? "failed" : "pending";
        paymentId = requestData.data?.id || "";
        paymentAmount = requestData.data?.amount || 0;
        break;
        
      case "fixed_payment_code_payment_paid":
        // Retail outlet payments
        externalId = requestData.external_id;
        paymentStatus = "completed";
        paymentId = requestData.payment_id || requestData.id;
        paymentAmount = requestData.amount || 0;
        break;
        
      case "invoice_paid":
        // Invoice payments (credit card)
        externalId = requestData.external_id;
        paymentStatus = "completed";
        paymentId = requestData.payment_id || requestData.id;
        paymentAmount = requestData.paid_amount || 0;
        break;
        
      case "invoice_expired":
        // Invoice expired
        externalId = requestData.external_id;
        paymentStatus = "expired";
        paymentId = requestData.id;
        paymentAmount = requestData.amount || 0;
        break;
        
      default:
        console.log(`Unhandled event type: ${eventType}`);
        return new Response(
          JSON.stringify({ success: true, message: "Event type not processed" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200, // Return 200 to acknowledge receipt
          }
        );
    }
    
    if (!externalId || !paymentStatus) {
      console.error("Missing required information in webhook payload");
      return new Response(
        JSON.stringify({ success: false, message: "Missing required information" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    const organizationId = externalId.split('-')[0]; // Extract org ID from external_id
    
    // Find the invoice related to this payment
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, subscription_plan_id, organization_id")
      .filter("payment_details->external_id", "eq", externalId)
      .single();
      
    if (invoiceError || !invoice) {
      console.error("Invoice not found for external_id:", externalId);
      return new Response(
        JSON.stringify({ success: false, message: "Invoice not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Find the transaction related to this invoice
    const { data: transaction, error: transactionError } = await supabase
      .from("payment_transactions")
      .select("id")
      .eq("invoice_id", invoice.id)
      .single();
      
    if (transactionError || !transaction) {
      console.error("Transaction not found for invoice:", invoice.id);
      return new Response(
        JSON.stringify({ success: false, message: "Transaction not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Update transaction status
    await supabase
      .from("payment_transactions")
      .update({
        status: paymentStatus,
        payment_details: {
          ...requestData,
          provider_payment_id: paymentId
        }
      })
      .eq("id", transaction.id);
    
    // Update invoice status
    await supabase
      .from("invoices")
      .update({
        status: paymentStatus === "completed" ? "paid" : 
               paymentStatus === "failed" || paymentStatus === "expired" ? "cancelled" : "issued"
      })
      .eq("id", invoice.id);
    
    // If payment is completed, update the organization's subscription
    if (paymentStatus === "completed") {
      // Get the organization's current subscription data
      const { data: organization } = await supabase
        .from("organizations")
        .select("subscription_plan_id, trial_end_date, subscription_status")
        .eq("id", invoice.organization_id)
        .single();
      
      // Update organization's subscription plan
      await supabase
        .from("organizations")
        .update({
          subscription_plan_id: invoice.subscription_plan_id,
          subscription_status: "active",
          // If they're moving from trial to paid, clear trial data
          ...(organization?.subscription_status === "trial" ? {
            trial_expired: false,
            trial_end_date: null
          } : {})
        })
        .eq("id", invoice.organization_id);
      
      // Create audit log for successful payment
      await supabase
        .from("subscription_audit_logs")
        .insert({
          organization_id: invoice.organization_id,
          action: "payment_succeeded",
          data: {
            invoice_id: invoice.id,
            transaction_id: transaction.id,
            amount_paid: paymentAmount,
            payment_id: paymentId,
            previous_plan_id: organization?.subscription_plan_id,
            new_plan_id: invoice.subscription_plan_id
          }
        });
        
      // Create notification for organization admins
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("organization_id", invoice.organization_id)
        .in("role", ["super_admin", "admin"]);
        
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await supabase
            .from("notifications")
            .insert({
              user_id: admin.id,
              organization_id: invoice.organization_id,
              title: "Pembayaran Berhasil",
              message: "Pembayaran langganan Anda telah berhasil diproses.",
              type: "success",
              action_url: "/subscription"
            });
        }
      }
    } else if (paymentStatus === "failed" || paymentStatus === "expired") {
      // Create audit log for failed payment
      await supabase
        .from("subscription_audit_logs")
        .insert({
          organization_id: invoice.organization_id,
          action: "payment_failed",
          data: {
            invoice_id: invoice.id,
            transaction_id: transaction.id,
            reason: paymentStatus === "expired" ? "Payment expired" : "Payment failed",
            payment_id: paymentId
          }
        });
      
      // Create notification for organization admins about failed payment
      const { data: admins } = await supabase
        .from("profiles")
        .select("id")
        .eq("organization_id", invoice.organization_id)
        .in("role", ["super_admin", "admin"]);
        
      if (admins && admins.length > 0) {
        for (const admin of admins) {
          await supabase
            .from("notifications")
            .insert({
              user_id: admin.id,
              organization_id: invoice.organization_id,
              title: paymentStatus === "expired" ? "Pembayaran Kadaluarsa" : "Pembayaran Gagal",
              message: paymentStatus === "expired" ? 
                "Batas waktu pembayaran langganan Anda telah berakhir. Silakan coba lagi." : 
                "Terjadi masalah dengan pembayaran Anda. Silakan coba lagi.",
              type: "warning",
              action_url: "/subscription"
            });
        }
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Payment ${paymentStatus} processed successfully`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred while processing the webhook",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
