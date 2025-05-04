
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

    // Check if profile exists using a security definer function
    // This avoids the RLS policies that might cause recursion
    const { data: profileResult, error: rpcError } = await supabaseClient
      .rpc('get_user_profile_by_id', {
        user_id: user_id
      })

    if (rpcError) {
      console.error("Error checking profile with RPC:", rpcError)
      
      // Try with direct query as backup
      const { data: existingProfile, error: queryError } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('id', user_id)
        .maybeSingle()

      if (queryError) {
        console.error("Error checking existing profile:", queryError)
        
        if (queryError.message.includes('infinite recursion')) {
          // If there's a recursion error, try using the create_profile_if_not_exists function
          const { data: profileData, error: funcError } = await supabaseClient
            .rpc('create_profile_if_not_exists', {
              user_id: user_id,
              user_email: user_email.toLowerCase(),
              user_full_name: user_full_name || null,
              is_email_verified: is_email_verified || false
            })
            
          if (funcError) {
            console.error("Error with create_profile_if_not_exists:", funcError)
            return new Response(
              JSON.stringify({ success: false, error: funcError.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
          }
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              action: 'created_with_function', 
              message: 'Profile created with RPC function' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ success: false, error: queryError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Handle the profile result
      if (existingProfile) {
        // Update existing profile
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
      }
    } else {
      // We got a result from the RPC function
      let existingProfile = null
      
      // Check if we got an array (some RPC functions return arrays)
      if (Array.isArray(profileResult) && profileResult.length > 0) {
        existingProfile = profileResult[0]
      } else if (profileResult) {
        existingProfile = profileResult
      }
      
      if (existingProfile) {
        // Update existing profile
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
      }
    }
      
    // If we get here, we need to create a new profile
    console.log(`Creating new profile for user ${user_id}`)
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

      // Last resort - try the RPC function
      const { data: profileData, error: funcError } = await supabaseClient
        .rpc('create_profile_if_not_exists', {
          user_id: user_id,
          user_email: user_email.toLowerCase(),
          user_full_name: user_full_name || null,
          is_email_verified: is_email_verified || false
        })
        
      if (funcError) {
        return new Response(
          JSON.stringify({ success: false, error: insertError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'created_with_function', 
          message: 'Profile created with RPC function' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, action: 'created', profile: newProfile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Unhandled error:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
