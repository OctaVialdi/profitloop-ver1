
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

    // Check if profile exists for this user
    const { data: existingProfile } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .maybeSingle()

    if (existingProfile) {
      // Profile exists, update it
      const { data: updatedProfile, error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          email: user_email,
          full_name: user_full_name,
          email_verified: is_email_verified
        })
        .eq('id', user_id)
        .select()

      if (updateError) throw updateError

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
          email: user_email,
          full_name: user_full_name,
          email_verified: is_email_verified
        }])
        .select()

      if (insertError) throw insertError

      return new Response(
        JSON.stringify({ success: true, action: 'created', profile: newProfile }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
