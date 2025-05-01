import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserMinus, Shield, User } from "lucide-react";
import { format } from "date-fns";

interface MemberTableRowProps {
  member: {
    id: string;
    email: string;
    full_name: string | null;
    role: 'super_admin' | 'admin' | 'employee';
    created_at: string;
  };
  currentUserId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isUpdating: Record<string, boolean>;
  isRemoving: Record<string, boolean>;
  onRoleChange: (memberId: string, newRole: 'super_admin' | 'admin' | 'employee') => void;
  onRemove: (memberId: string) => void;
}

export const MemberTableRow = ({
  member,
  currentUserId,
  isAdmin,
  isSuperAdmin,
  isUpdating,
  isRemoving,
  onRoleChange,
  onRemove
}: MemberTableRowProps) => {
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
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b last:border-0">
      <div className="col-span-5">
        <div className="font-medium">
          {member.full_name || 'Nama tidak tersedia'}
        </div>
        <div className="text-sm text-gray-500">
          {member.email}
        </div>
      </div>
      <div className="col-span-3">
        {getRoleBadge(member.role)}
      </div>
      <div className="col-span-2 text-sm text-gray-500">
        {formatDate(member.created_at)}
      </div>
      {isAdmin && (
        <div className="col-span-2 flex justify-end items-center gap-2">
          {member.id !== currentUserId ? (
            <>
              <Select 
                defaultValue={member.role}
                onValueChange={(value) => onRoleChange(
                  member.id, 
                  value as 'super_admin' | 'admin' | 'employee'
                )}
                disabled={
                  isUpdating[member.id] || 
                  (member.role === 'super_admin' && !isSuperAdmin) ||
                  (!isSuperAdmin && member.role === 'super_admin')
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
                      onClick={() => onRemove(member.id)}
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
      )}
    </div>
  );
};
