
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'employee';
  created_at: string;
}

interface RemoveMemberResponse {
  success: boolean;
  message: string;
  email?: string;
}

export const useMemberManagement = (organizationId: string | undefined) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (organizationId) {
      fetchMembers();
    }
  }, [organizationId]);

  const fetchMembers = async () => {
    if (!organizationId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .eq('organization_id', organizationId)
        .order('role', { ascending: false });
      
      if (error) throw error;
      
      setMembers(data as Member[]);
    } catch (error: any) {
      toast.error("Gagal memuat daftar anggota");
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'super_admin' | 'admin' | 'employee') => {
    setIsUpdating(prev => ({ ...prev, [memberId]: true }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('organization_id', organizationId);
      
      if (error) throw error;
      
      setMembers(members.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));
      
      toast.success("Peran anggota berhasil diperbarui");
    } catch (error: any) {
      toast.error("Gagal memperbarui peran anggota");
      console.error("Error updating member role:", error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(prev => ({ ...prev, [memberId]: true }));
    
    try {
      const { data, error } = await supabase
        .rpc('remove_organization_member', { member_id: memberId });
      
      if (error) throw error;
      
      // Cast data to unknown first, then to RemoveMemberResponse
      const response = (data as unknown) as RemoveMemberResponse;
      
      if (response.success) {
        setMembers(members.filter(member => member.id !== memberId));
        toast.success(`Anggota berhasil dihapus dari organisasi`);
      } else {
        toast.error(response.message || "Tidak dapat menghapus anggota");
      }
    } catch (error: any) {
      toast.error("Gagal menghapus anggota dari organisasi");
      console.error("Error removing member:", error);
    } finally {
      setIsRemoving(prev => ({ ...prev, [memberId]: false }));
    }
  };

  return {
    members,
    isLoading,
    isRemoving,
    isUpdating,
    fetchMembers,
    handleRoleChange,
    handleRemoveMember
  };
};
