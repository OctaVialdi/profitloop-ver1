
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AvailableOrganization {
  id: string;
  name: string;
  role: string;
  logo_path: string | null;
  is_current: boolean;
}

export function useAvailableOrganizations() {
  const [organizations, setOrganizations] = useState<AvailableOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchAvailableOrganizations() {
    setIsLoading(true);
    setError(null);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setOrganizations([]);
        return;
      }

      // Fetch all organizations the user belongs to
      const { data: userOrgs, error: orgsError } = await supabase
        .rpc('get_user_organizations');

      if (orgsError) {
        throw orgsError;
      }

      // Get the current organization ID from auth metadata
      const currentOrgId = session.user.user_metadata?.organization_id || null;

      // Mark the current organization
      const availableOrgs = userOrgs.map((org: any) => ({
        id: org.id,
        name: org.name,
        role: org.role,
        logo_path: org.logo_path,
        is_current: org.id === currentOrgId
      }));

      setOrganizations(availableOrgs);
    } catch (err) {
      console.error("Error fetching available organizations:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error("Gagal memuat daftar organisasi");
    } finally {
      setIsLoading(false);
    }
  }

  async function switchOrganization(organizationId: string) {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Sesi tidak ditemukan, silakan login ulang");
        return false;
      }

      // Get the role for the selected organization
      const org = organizations.find(o => o.id === organizationId);
      if (!org) {
        toast.error("Organisasi tidak ditemukan");
        return false;
      }

      // Update user metadata with the new organization
      const { error } = await supabase.auth.updateUser({
        data: { 
          organization_id: organizationId,
          role: org.role
        }
      });

      if (error) throw error;

      // Update the list to mark the new current org
      setOrganizations(prev => 
        prev.map(o => ({
          ...o,
          is_current: o.id === organizationId
        }))
      );

      toast.success(`Berhasil beralih ke ${org.name}`);
      return true;
    } catch (err) {
      console.error("Error switching organization:", err);
      toast.error("Gagal beralih organisasi");
      return false;
    }
  }

  useEffect(() => {
    fetchAvailableOrganizations();
  }, []);

  return {
    organizations,
    isLoading,
    error,
    refreshOrganizations: fetchAvailableOrganizations,
    switchOrganization,
  };
}
