
// Follow imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the user_id from the request
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with Admin/Service Role Key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 1. Get user info first to check if they own an organization
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('organization_id, role')
      .eq('id', user_id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" which is fine
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    // If the user is a super_admin, check if they're the last admin of the organization
    let shouldDeleteOrg = false;
    if (profile && profile.organization_id && profile.role === 'super_admin') {
      const { data: adminCount, error: countError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('organization_id', profile.organization_id)
        .eq('role', 'super_admin')
        .neq('id', user_id);

      if (countError) {
        throw new Error(`Failed to count admins: ${countError.message}`);
      }

      // If this is the only super_admin, we'll delete the organization
      if (!adminCount || adminCount.length === 0) {
        shouldDeleteOrg = true;
      }
    }

    // 2. Delete the organization if needed
    if (shouldDeleteOrg && profile?.organization_id) {
      // Delete organization records
      await supabaseAdmin
        .from('organizations')
        .delete()
        .eq('id', profile.organization_id);
      
      // Note: Any associated records will be deleted via cascade delete rules in database
    }

    // 3. Finally, delete the user from auth.users 
    // This will cascade delete their profile due to the trigger we have set up
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User account deleted successfully',
        deleted_organization: shouldDeleteOrg
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`Error deleting user account: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to delete user account'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
