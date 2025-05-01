
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { useMemberManagement } from "@/hooks/useMemberManagement";
import { MembersTable } from "@/components/members/MembersTable";

const MemberManagement = () => {
  const { userProfile, isSuperAdmin, isAdmin } = useOrganization();
  
  const {
    members,
    isLoading,
    isRemoving,
    isUpdating,
    handleRoleChange,
    handleRemoveMember
  } = useMemberManagement(userProfile?.organization_id);

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
            <MembersTable 
              members={members}
              isLoading={isLoading}
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
              userProfile={userProfile}
              isUpdating={isUpdating}
              isRemoving={isRemoving}
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberManagement;
