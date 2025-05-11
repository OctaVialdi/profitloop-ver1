
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

    console.log(`Attempting to delete user: ${user_id}`);

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

    if (profileError) {
      console.error(`Error fetching profile: ${profileError.message}`);
      if (profileError.code !== 'PGRST116') { // PGRST116 is "not found" which is fine
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }
    }
    
    console.log(`Profile found: ${JSON.stringify(profile)}`);

    // If the user is a super_admin, check if they're the last admin of the organization
    let shouldDeleteOrg = false;
    if (profile && profile.organization_id && profile.role === 'super_admin') {
      console.log(`User is super_admin of organization: ${profile.organization_id}`);
      const { data: adminCount, error: countError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('organization_id', profile.organization_id)
        .eq('role', 'super_admin')
        .neq('id', user_id);

      if (countError) {
        console.error(`Error counting admins: ${countError.message}`);
        throw new Error(`Failed to count admins: ${countError.message}`);
      }

      // If this is the only super_admin, we'll delete the organization
      if (!adminCount || adminCount.length === 0) {
        shouldDeleteOrg = true;
        console.log(`User is the last super_admin, will delete organization: ${profile.organization_id}`);
      }
    }

    // 2. Delete the organization if needed
    if (shouldDeleteOrg && profile?.organization_id) {
      try {
        console.log(`Deleting organization: ${profile.organization_id}`);
        // Delete organization records
        const { error: deleteOrgError } = await supabaseAdmin
          .from('organizations')
          .delete()
          .eq('id', profile.organization_id);
        
        if (deleteOrgError) {
          console.error(`Error deleting organization: ${deleteOrgError.message}`);
        } else {
          console.log(`Organization deleted successfully: ${profile.organization_id}`);
        }
        
        // Note: Any associated records will be deleted via cascade delete rules in database
      } catch (orgError) {
        console.error(`Error during organization deletion: ${orgError.message}`);
        // Continue with user deletion even if org deletion fails
      }
    }

    // 3. Finally, delete the user from auth.users 
    // This will cascade delete their profile due to the trigger we have set up
    console.log(`Deleting user from auth system: ${user_id}`);
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (deleteError) {
      console.error(`Error deleting user: ${deleteError.message}`);
      throw new Error(`Failed to delete user: ${deleteError.message}`);
    }

    console.log(`User deleted successfully: ${user_id}`);
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
