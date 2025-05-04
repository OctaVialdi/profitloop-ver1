
// Follow Deno deployment model for edge functions
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Get Supabase client using environment variables
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id, user_email, user_full_name, is_email_verified } = await req.json()

    if (!user_id || !user_email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if profile exists using a direct query with service role
    // This bypasses any RLS policies that might cause infinite recursion
    const { data: existingProfile, error: queryError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .maybeSingle()

    if (queryError) {
      console.error("Error checking existing profile:", queryError)
      return new Response(
        JSON.stringify({ success: false, error: queryError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (existingProfile) {
      // Profile exists, update it
      const { data: updatedProfile, error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          email: user_email.toLowerCase(),
          full_name: user_full_name,
          email_verified: is_email_verified
        })
        .eq('id', user_id)
        .select()

      if (updateError) {
        console.error("Error updating profile:", updateError)
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, action: 'updated', profile: updatedProfile }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else {
      // Create new profile
      const { data: newProfile, error: insertError } = await supabaseClient
        .from('profiles')
        .insert([{
          id: user_id,
          email: user_email.toLowerCase(),
          full_name: user_full_name,
          email_verified: is_email_verified
        }])
        .select()

      if (insertError) {
        console.error("Error creating profile:", insertError)
        // Check for unique violation - conflict
        if (insertError.code === '23505') {
          // Profile was likely created in a race condition - try to retrieve it
          const { data: existingData } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user_id)
            .maybeSingle()
            
          if (existingData) {
            return new Response(
              JSON.stringify({ success: true, action: 'retrieved', profile: existingData }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        return new Response(
          JSON.stringify({ success: false, error: insertError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, action: 'created', profile: newProfile }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error("Unhandled error:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
