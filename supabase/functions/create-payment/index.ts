
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const xenditApiKey = Deno.env.get("XENDIT_API_KEY") || "";
    
    if (!xenditApiKey) {
      throw new Error("Xendit API key not configured");
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
    const { organizationId, planId, paymentMethodCode } = requestData;
    
    if (!organizationId || !planId || !paymentMethodCode) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields: organizationId, planId, or paymentMethodCode",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get subscription plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("id, name, price, features")
      .eq("id", planId)
      .single();
      
    if (planError || !plan) {
      return new Response(
        JSON.stringify({ success: false, message: "Subscription plan not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, creator_email")
      .eq("id", organizationId)
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

    // Get payment method details
    const { data: paymentMethod, error: paymentMethodError } = await supabase
      .from("payment_methods")
      .select("id, name, provider, type, code")
      .eq("code", paymentMethodCode)
      .eq("is_active", true)
      .single();
      
    if (paymentMethodError || !paymentMethod) {
      return new Response(
        JSON.stringify({ success: false, message: "Payment method not found or inactive" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }
    
    // Generate unique external ID for this transaction
    const externalId = `${organizationId}-${new Date().getTime()}`;
    
    // Generate invoice number
    const { data: invoiceNumberData } = await supabase.rpc("generate_invoice_number");
    const invoiceNumber = invoiceNumberData || `INV-${new Date().getTime()}`;
    
    // Create invoice record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3); // 3 days from now
    
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        organization_id: organizationId,
        subscription_plan_id: planId,
        amount: plan.price,
        tax_amount: 0, // Set tax amount as needed
        total_amount: plan.price, // Adjust if tax is applied
        status: "issued",
        due_date: dueDate.toISOString(),
        invoice_number: invoiceNumber,
        payment_details: {
          plan_name: plan.name,
          external_id: externalId
        }
      })
      .select()
      .single();
      
    if (invoiceError) {
      console.error("Invoice creation error:", invoiceError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create invoice" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    // Create Xendit payment - API calls will differ based on payment method type
    let xenditResponse;
    const xenditHeaders = {
      "Authorization": `Basic ${btoa(xenditApiKey + ":")}`,
      "Content-Type": "application/json"
    };
    
    // Set expiration time (24 hours from now)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    
    // Default success and failure redirect URLs
    const successRedirectUrl = `${Deno.env.get("PUBLIC_APP_URL") || "http://localhost:5173"}/payment/success?invoice_id=${invoice.id}`;
    const failureRedirectUrl = `${Deno.env.get("PUBLIC_APP_URL") || "http://localhost:5173"}/payment/failed?invoice_id=${invoice.id}`;
    
    // Handle different payment method types
    let paymentUrl = "";
    let providerReference = "";
    let paymentDetails = {};
    
    console.log("Payment method type:", paymentMethod.type);
    console.log("Payment method code:", paymentMethod.code);
    
    if (paymentMethod.type === "bank_transfer") {
      // Create virtual account
      const bankCode = paymentMethodCode.replace("va_", "").toUpperCase();
      
      const response = await fetch("https://api.xendit.co/v2/virtual_accounts", {
        method: "POST",
        headers: xenditHeaders,
        body: JSON.stringify({
          external_id: externalId,
          bank_code: bankCode,
          name: organization.name,
          expected_amount: plan.price,
          expiration_date: expirationDate.toISOString(),
          is_single_use: true,
          is_closed: true
        })
      });
      
      xenditResponse = await response.json();
      
      if (!response.ok) {
        console.error("Xendit VA error:", xenditResponse);
        throw new Error(`Failed to create virtual account: ${xenditResponse.message}`);
      }
      
      paymentUrl = "N/A"; // VA doesn't have a payment URL
      providerReference = xenditResponse.id;
      paymentDetails = {
        virtual_account_number: xenditResponse.account_number,
        bank_code: xenditResponse.bank_code,
        payment_method: "Virtual Account"
      };
      
    } else if (paymentMethod.type === "e_wallet") {
      // Create e-wallet payment
      const ewallet = paymentMethodCode.toLowerCase();
      const channelCode = 
        ewallet === "gopay" ? "ID_GOPAY" : 
        ewallet === "ovo" ? "ID_OVO" : 
        ewallet === "dana" ? "ID_DANA" : "";
        
      const response = await fetch("https://api.xendit.co/ewallets/charges", {
        method: "POST",
        headers: xenditHeaders,
        body: JSON.stringify({
          reference_id: externalId,
          currency: "IDR",
          amount: plan.price,
          checkout_method: "ONE_TIME_PAYMENT",
          channel_code: channelCode,
          channel_properties: {
            success_redirect_url: successRedirectUrl,
            failure_redirect_url: failureRedirectUrl
          }
        })
      });
      
      xenditResponse = await response.json();
      
      if (!response.ok) {
        console.error("Xendit e-wallet error:", xenditResponse);
        throw new Error(`Failed to create e-wallet payment: ${xenditResponse.message}`);
      }
      
      paymentUrl = xenditResponse.actions?.desktop_web_checkout_url || xenditResponse.actions?.mobile_web_checkout_url;
      providerReference = xenditResponse.id;
      paymentDetails = {
        checkout_url: paymentUrl,
        payment_method: "E-Wallet",
        channel_code: channelCode
      };
      
    } else if (paymentMethod.type === "retail") {
      // Create retail outlet payment
      const retailCode = paymentMethodCode.toUpperCase();
      
      const response = await fetch("https://api.xendit.co/fixed_payment_code", {
        method: "POST",
        headers: xenditHeaders,
        body: JSON.stringify({
          external_id: externalId,
          retail_outlet_name: retailCode,
          name: organization.name,
          expected_amount: plan.price,
          expiration_date: expirationDate.toISOString()
        })
      });
      
      xenditResponse = await response.json();
      
      if (!response.ok) {
        console.error("Xendit retail error:", xenditResponse);
        throw new Error(`Failed to create retail payment: ${xenditResponse.message}`);
      }
      
      paymentUrl = "N/A"; // Retail doesn't have a payment URL
      providerReference = xenditResponse.id;
      paymentDetails = {
        payment_code: xenditResponse.payment_code,
        retail_outlet: xenditResponse.retail_outlet_name,
        payment_method: "Retail Outlet"
      };
      
    } else if (paymentMethod.type === "credit_card") {
      // Create credit card payment - using Xendit Invoice method for simplicity
      const response = await fetch("https://api.xendit.co/v2/invoices", {
        method: "POST",
        headers: xenditHeaders,
        body: JSON.stringify({
          external_id: externalId,
          amount: plan.price,
          payer_email: organization.creator_email,
          description: `Subscription to ${plan.name} plan for ${organization.name}`,
          invoice_duration: 86400, // 24 hours in seconds
          success_redirect_url: successRedirectUrl,
          failure_redirect_url: failureRedirectUrl,
          payment_methods: ["CREDIT_CARD"]
        })
      });
      
      xenditResponse = await response.json();
      
      if (!response.ok) {
        console.error("Xendit invoice error:", xenditResponse);
        throw new Error(`Failed to create credit card payment: ${xenditResponse.message}`);
      }
      
      paymentUrl = xenditResponse.invoice_url;
      providerReference = xenditResponse.id;
      paymentDetails = {
        invoice_url: xenditResponse.invoice_url,
        payment_method: "Credit Card"
      };
    }
    
    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("payment_transactions")
      .insert({
        organization_id: organizationId,
        invoice_id: invoice.id,
        payment_method_id: paymentMethod.id,
        amount: plan.price,
        status: "pending",
        payment_provider: "xendit",
        provider_reference: providerReference,
        payment_url: paymentUrl,
        payment_details: paymentDetails,
        expires_at: expirationDate.toISOString()
      })
      .select()
      .single();
      
    if (transactionError) {
      console.error("Transaction creation error:", transactionError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create transaction record" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    // Create an audit log entry
    await supabase.from("subscription_audit_logs").insert({
      organization_id: organizationId,
      action: "payment_initiated",
      data: {
        invoice_id: invoice.id,
        transaction_id: transaction.id,
        payment_method: paymentMethod.name,
        amount: plan.price,
        plan_id: planId,
        plan_name: plan.name
      }
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          payment_url: paymentUrl,
          payment_details: paymentDetails,
          expires_at: expirationDate.toISOString()
        },
        invoice: {
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.total_amount
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred while creating the payment",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
