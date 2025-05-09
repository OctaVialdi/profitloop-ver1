
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EventPayload {
  event_type: string;
  organization_id: string;
  plan_id?: string; 
  previous_plan_id?: string;
  payment_method?: string;
  user_id?: string;
  additional_data?: Record<string, any>;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get request payload
    const { 
      event_type, 
      organization_id, 
      plan_id, 
      previous_plan_id,
      payment_method,
      user_id,
      additional_data 
    } = await req.json() as EventPayload;

    if (!event_type || !organization_id) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Missing required parameters" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the user ID from auth if not provided
    let authenticatedUserId = user_id;
    if (!authenticatedUserId) {
      try {
        // Extract auth token from headers
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          const { data: { user } } = await supabaseClient.auth.getUser(token);
          if (user) {
            authenticatedUserId = user.id;
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        // Continue without user ID if auth fails
      }
    }

    // Log the event in the analytics_events table
    const { data, error } = await supabaseClient
      .from('subscription_analytics')
      .insert({
        event_type,
        organization_id,
        user_id: authenticatedUserId,
        plan_id,
        previous_plan_id,
        payment_method,
        additional_data
      });

    if (error) {
      console.error("Error inserting event:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Event tracked successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in track-event function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
