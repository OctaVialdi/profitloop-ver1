
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile/ProfileForm";
import { DeleteAccountCard, DeleteAccountDialog } from "@/components/settings/profile/DeleteAccountDialog";
import { AuthenticationTab } from "@/components/settings/profile/AuthenticationTab";

const ProfileSettings = () => {
  const { user, deleteAccount, isDeleting, signOutFromAllSessions } = useAuth();
  const { userProfile, refreshData } = useOrganization();
  const [activeTab, setActiveTab] = useState("profile");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expectedDeleteConfirmation, setExpectedDeleteConfirmation] = useState("");

  useEffect(() => {
    if (userProfile?.full_name) {
      setExpectedDeleteConfirmation(`hapus akun profile ${userProfile.full_name}`);
    }
  }, [userProfile]);

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteAccount();
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="authentication">Autentikasi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileForm 
            user={user}
            userProfile={userProfile}
            refreshData={refreshData}
          />
          
          <DeleteAccountCard 
            onOpenDeleteDialog={handleOpenDeleteDialog} 
            isDeleting={isDeleting} 
          />
        </TabsContent>
        
        <TabsContent value="authentication">
          <AuthenticationTab 
            email={userProfile?.email || ""}
            onSignOutFromAllSessions={signOutFromAllSessions}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Account Confirmation Dialog */}
      <DeleteAccountDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        fullName={userProfile?.full_name || ""}
        expectedConfirmation={expectedDeleteConfirmation}
      />
    </div>
  );
};

export default ProfileSettings;
