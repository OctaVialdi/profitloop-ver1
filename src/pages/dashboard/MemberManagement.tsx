
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, User, Shield, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

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

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const { userProfile, isSuperAdmin, isAdmin, refreshData } = useOrganization();

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

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === userProfile?.id) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri");
      return;
    }

    setIsRemoving(prev => ({ ...prev, [memberId]: true }));
    
    try {
      const { data, error } = await supabase
        .rpc('remove_organization_member', { member_id: memberId });
      
      if (error) throw error;
      
      // Fix: Cast data to unknown first, then to RemoveMemberResponse
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
    } catch (e) {
      return "-";
    }
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama / Email</TableHead>
                      <TableHead>Peran</TableHead>
                      <TableHead>Bergabung</TableHead>
                      {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">
                            {member.full_name || 'Nama tidak tersedia'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(member.role)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(member.created_at)}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              {member.id !== userProfile?.id ? (
                                <>
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
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        disabled={isRemoving[member.id]}
                                      >
                                        <UserMinus size={18} />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Apakah Anda yakin ingin menghapus {member.full_name || member.email} dari organisasi?
                                          <br /><br />
                                          Akun pengguna tidak akan dihapus, hanya keanggotaan dalam organisasi ini yang akan dihapus.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleRemoveMember(member.id)}
                                          className="bg-red-600 text-white hover:bg-red-700"
                                        >
                                          Hapus
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 italic">
                                  Anda
                                </span>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
