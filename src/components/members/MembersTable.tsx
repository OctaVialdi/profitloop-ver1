
import { FixedSizeList as List } from "react-window";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberTableRow } from "./MemberTableRow";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";

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
  const [windowHeight, setWindowHeight] = useState(0);
  const ROW_HEIGHT = 80; // Approximate height of each row in pixels

  // Update window dimensions on resize
  useEffect(() => {
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    
    return () => {
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  if (isLoading) {
    return <Spinner centered size="lg" />;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>Belum ada anggota yang terdaftar</p>
      </div>
    );
  }

  const TableHeader = () => (
    <div className="grid grid-cols-12 gap-4 py-3 px-4 font-medium text-sm text-muted-foreground border-b">
      <div className="col-span-5">Nama / Email</div>
      <div className="col-span-3">Peran</div>
      <div className="col-span-2">Bergabung</div>
      {isAdmin && <div className="col-span-2 text-right">Aksi</div>}
    </div>
  );

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const member = members[index];
    return (
      <div style={style} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
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
      </div>
    );
  };

  const listHeight = Math.min(
    windowHeight * 0.6, // 60% of window height
    members.length * ROW_HEIGHT + 50 // Total height of all rows + some buffer
  );

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <TableHeader />
        <List
          height={listHeight}
          itemCount={members.length}
          itemSize={ROW_HEIGHT}
          width="100%"
          className="custom-scrollbar"
        >
          {Row}
        </List>
      </div>
      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <a href="/settings/invite">Undang Anggota Baru</a>
        </Button>
      </div>
    </>
  );
};
