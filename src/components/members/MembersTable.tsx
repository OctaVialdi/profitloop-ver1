
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberTableRow } from "./MemberTableRow";

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  role: 'super_admin' | 'admin' | 'employee';
  created_at: string;
}

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userProfile: any;
  isUpdating: Record<string, boolean>;
  isRemoving: Record<string, boolean>;
  onRoleChange: (memberId: string, newRole: 'super_admin' | 'admin' | 'employee') => void;
  onRemove: (memberId: string) => void;
}

export const MembersTable = ({
  members,
  isLoading,
  isAdmin,
  isSuperAdmin,
  userProfile,
  isUpdating,
  isRemoving,
  onRoleChange,
  onRemove
}: MembersTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Memuat data anggota...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>Belum ada anggota yang terdaftar</p>
      </div>
    );
  }

  return (
    <>
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
              <MemberTableRow 
                key={member.id}
                member={member}
                currentUserId={userProfile?.id}
                isAdmin={isAdmin}
                isSuperAdmin={isSuperAdmin}
                isUpdating={isUpdating}
                isRemoving={isRemoving}
                onRoleChange={onRoleChange}
                onRemove={onRemove}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <a href="/invite">Undang Anggota Baru</a>
        </Button>
      </div>
    </>
  );
};
