
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST requests for the actual submission
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      );
    }

    // Parse the request body
    const body = await req.json();
    
    // Extract application data from request body
    const {
      token,
      formData,
      familyMembers,
      formalEducation,
      informalEducation,
      workExperience,
      linkInfo
    } = body;

    console.log("Received job application submission for token:", token);

    if (!token || !formData || !linkInfo) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create a Supabase client with the Supabase URL and service role key from environment variables
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Format date fields for database
    const formatDateForDb = (date: Date | null): string | null => {
      if (!date) return null;
      return date instanceof Date ? date.toISOString().split('T')[0] : date;
    };

    // Call our secure database function to submit the application
    const { data, error } = await supabaseAdmin.rpc('internal_submit_job_application', {
      p_job_position_id: linkInfo.job_position_id || null,
      p_recruitment_link_id: token,
      p_full_name: formData.fullName,
      p_email: formData.email,
      p_phone: formData.mobilePhone || null,
      p_address: formData.residentialAddress || null,
      p_birth_date: formatDateForDb(formData.birthdate),
      p_birth_place: formData.birthPlace || null,
      p_gender: formData.gender || null,
      p_religion: formData.religion || null,
      p_marital_status: formData.maritalStatus || null,
      p_blood_type: formData.bloodType || null,
      p_nik: formData.nik || null,
      p_passport_number: formData.passportNumber || null,
      p_passport_expiry: formatDateForDb(formData.passportExpiry),
      p_postal_code: formData.postalCode || null,
      p_citizen_address: formData.citizenAddress || null,
      p_organization_id: linkInfo.organization_id,
      p_family_members: familyMembers && familyMembers.length > 0 ? familyMembers : null,
      p_formal_education: formalEducation && formalEducation.length > 0 ? formalEducation : null,
      p_informal_education: informalEducation && informalEducation.length > 0 ? informalEducation : null,
      p_work_experience: workExperience && workExperience.length > 0 ? workExperience : null
    });

    if (error) {
      console.error("Error submitting application:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          details: error
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Update the recruitment link submissions counter
    try {
      await supabaseAdmin.rpc('increment_submissions_counter', { token });
    } catch (counterError) {
      console.warn("Failed to update submissions counter, but application was saved:", counterError);
    }

    console.log("Application submitted successfully, result:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error("Unexpected error in submit-job-application function:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
