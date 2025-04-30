
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Users, User, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'employee';
  created_at: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const { userProfile, isSuperAdmin, isAdmin } = useOrganization();

  useEffect(() => {
    fetchMembers();
  }, [userProfile]);

  const fetchMembers = async () => {
    if (!userProfile?.organization_id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .eq('organization_id', userProfile.organization_id)
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
    // Don't allow changing super_admin role if the user is only an admin
    const member = members.find(m => m.id === memberId);
    if (member?.role === 'super_admin' && !isSuperAdmin) {
      toast.error("Anda tidak memiliki izin untuk mengubah peran Super Admin");
      return;
    }
    
    // Don't allow normal admins to create super admins
    if (newRole === 'super_admin' && !isSuperAdmin) {
      toast.error("Hanya Super Admin yang dapat menambahkan Super Admin lain");
      return;
    }
    
    setIsUpdating(prev => ({ ...prev, [memberId]: true }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('organization_id', userProfile?.organization_id);
      
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

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Shield className="h-3 w-3 mr-1" /> Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" /> Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <User className="h-3 w-3 mr-1" /> Karyawan
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manajemen Anggota</h1>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Anggota Organisasi</CardTitle>
            </div>
            <CardDescription>
              Kelola peran dan akses anggota organisasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Memuat data anggota...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p>Belum ada anggota yang terdaftar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 text-left">Nama / Email</th>
                      <th className="py-3 px-4 text-left">Peran</th>
                      <th className="py-3 px-4 text-left">Bergabung</th>
                      {isAdmin && <th className="py-3 px-4 text-right">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {member.full_name || 'Nama tidak tersedia'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(member.role)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(member.created_at)}
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4 text-right">
                            {member.id !== userProfile?.id ? (
                              <Select 
                                defaultValue={member.role}
                                onValueChange={(value) => handleRoleChange(
                                  member.id, 
                                  value as 'super_admin' | 'admin' | 'employee'
                                )}
                                disabled={
                                  isUpdating[member.id] || 
                                  (member.role === 'super_admin' && !isSuperAdmin) ||
                                  (!isSuperAdmin && userProfile?.role !== 'super_admin')
                                }
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Ubah Peran" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isSuperAdmin && (
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                  )}
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="employee">Karyawan</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Anda
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6">
              <Button asChild variant="outline" size="sm">
                <a href="/invite">Undang Anggota Baru</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberManagement;
