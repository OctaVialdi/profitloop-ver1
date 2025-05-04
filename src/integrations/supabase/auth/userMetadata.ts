
import { supabase } from "../client";

// Helper function to update user metadata with organization info
export async function updateUserOrgMetadata(organizationId: string, role: string) {
  try {
    // Update user metadata with organization_id and role
    const { error } = await supabase.auth.updateUser({
      data: { 
        organization_id: organizationId,
        role: role
      }
    });
    
    if (error) {
      console.error("Error updating user metadata:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception updating user metadata:", err);
    return false;
  }
}
