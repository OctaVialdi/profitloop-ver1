
// Create a new file for the edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
}

interface RequestBody {
  user_id: string;
  user_email: string;
  user_full_name?: string | null;
  is_email_verified?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const requestData: RequestBody = await req.json();
    
    // Validate required fields
    if (!requestData.user_id || !requestData.user_email) {
      return new Response(
        JSON.stringify({ 
          error: 'user_id and user_email are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    
    // First check if profile already exists
    const { data: existingProfile, error: checkError } = await supabaseClient
      .from('profiles')
      .select('id, email_verified')
      .eq('id', requestData.user_id)
      .maybeSingle();
      
    // If profile exists, check if we need to update email verification
    if (existingProfile) {
      // Update email_verified if needed
      if (requestData.is_email_verified && !existingProfile.email_verified) {
        const { data: updateData, error: updateError } = await supabaseClient
          .from('profiles')
          .update({ 
            email_verified: true,
            email: requestData.user_email.toLowerCase(),
            full_name: requestData.user_full_name || null
          })
          .eq('id', requestData.user_id);
          
        if (updateError) {
          throw new Error(`Failed to update profile: ${updateError.message}`);
        }
        
        // Also update auth metadata to ensure it's synced
        await updateAuthMetadata(supabaseClient, requestData);
        
        return new Response(
          JSON.stringify({ 
            message: 'Profile verification status updated successfully',
            profile_id: requestData.user_id,
            status: 'updated'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Profile exists but no update needed
      return new Response(
        JSON.stringify({ 
          message: 'Profile already exists, no update needed',
          profile_id: requestData.user_id,
          status: 'exists'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Profile doesn't exist, create it
    const { data: insertData, error: insertError } = await supabaseClient
      .from('profiles')
      .insert({
        id: requestData.user_id,
        email: requestData.user_email.toLowerCase(),
        full_name: requestData.user_full_name || null,
        email_verified: requestData.is_email_verified || false,
      });
      
    if (insertError) {
      throw new Error(`Failed to create profile: ${insertError.message}`);
    }
    
    // Also update auth metadata to ensure it's synced
    await updateAuthMetadata(supabaseClient, requestData);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        message: 'Profile created successfully',
        profile_id: requestData.user_id,
        status: 'created' 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to update auth metadata for consistency
async function updateAuthMetadata(supabase: any, userData: RequestBody) {
  try {
    // Get current auth user data to check email verification status
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userData.user_id);
    
    if (authError) {
      console.error("Error getting auth user data:", authError);
      return;
    }
    
    // Get actual email verification status from auth
    const isVerified = authData?.user?.email_confirmed_at !== null;
    
    // Update user metadata with consistent values
    await supabase.auth.admin.updateUserById(userData.user_id, {
      user_metadata: {
        full_name: userData.user_full_name,
        email_verified: isVerified
      }
    });
  } catch (metadataError) {
    console.error("Error updating auth metadata:", metadataError);
  }
}
