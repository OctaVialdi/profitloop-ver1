
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Building, Check, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Organization {
  id: string;
  name: string;
}

interface Collaboration {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  invited_org_id: string;
  inviting_org_id: string;
  invited_org?: {
    name: string;
  };
  inviting_org?: {
    name: string;
  };
}

const OrganizationCollaboration = () => {
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentOrgName, setCurrentOrgName] = useState<string>("");
  const [sentInvitations, setSentInvitations] = useState<Collaboration[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Collaboration[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<Collaboration[]>([]);

  // Fetch user's organization id and name
  useEffect(() => {
    const fetchOrganizationData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
        
        if (profile && profile.organization_id) {
          setCurrentOrgId(profile.organization_id);
          
          // Get organization name
          const { data: organization } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', profile.organization_id)
            .single();
            
          if (organization) {
            setCurrentOrgName(organization.name);
          }
          
          // Fetch collaborations
          fetchCollaborations(profile.organization_id);
        }
      }
    };
    
    fetchOrganizationData();
  }, []);
  
  const fetchCollaborations = async (orgId: string) => {
    // Fetch sent invitations - specifying the exact columns for invited_org
    const { data: sentData } = await supabase
      .from('collaborations')
      .select(`
        id, status, created_at, invited_org_id, inviting_org_id,
        invited_org:organizations!invited_org_id(name)
      `)
      .eq('inviting_org_id', orgId);
    
    // Fetch received invitations - specifying the exact columns for inviting_org
    const { data: receivedData } = await supabase
      .from('collaborations')
      .select(`
        id, status, created_at, invited_org_id, inviting_org_id,
        inviting_org:organizations!inviting_org_id(name)
      `)
      .eq('invited_org_id', orgId);
    
    if (sentData) {
      setSentInvitations(sentData as Collaboration[]);
    }
    
    if (receivedData) {
      // Separate active collaborations from pending/rejected invitations
      const active = receivedData.filter(collab => collab.status === 'accepted') as Collaboration[];
      const pending = receivedData.filter(collab => collab.status !== 'accepted') as Collaboration[];
      
      setActiveCollaborations([
        ...active, 
        ...(sentData?.filter(collab => collab.status === 'accepted') || []) as Collaboration[]
      ]);
      setReceivedInvitations(pending);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrgId) {
      toast.error("Tidak dapat menemukan organisasi Anda.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Find organization by admin email
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('email', organizationEmail)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (!adminProfile || !adminProfile.organization_id) {
        toast.error("Tidak dapat menemukan organisasi dengan email admin tersebut.");
        setIsLoading(false);
        return;
      }
      
      const invitedOrgId = adminProfile.organization_id;
      
      // Make sure we're not inviting our own organization
      if (invitedOrgId === currentOrgId) {
        toast.error("Anda tidak dapat mengundang organisasi Anda sendiri.");
        setIsLoading(false);
        return;
      }
      
      // Check if there's already an invitation
      const { data: existingCollab } = await supabase
        .from('collaborations')
        .select('id')
        .eq('inviting_org_id', currentOrgId)
        .eq('invited_org_id', invitedOrgId)
        .maybeSingle();
      
      if (existingCollab) {
        toast.error("Sudah ada undangan atau kolaborasi dengan organisasi ini.");
        setIsLoading(false);
        return;
      }
      
      // Create collaboration invitation - specifying the exact column for invited_org
      const { data: collaboration, error } = await supabase
        .from('collaborations')
        .insert({
          inviting_org_id: currentOrgId,
          invited_org_id: invitedOrgId,
          status: 'pending' as const
        })
        .select(`
          id, status, created_at, invited_org_id, inviting_org_id,
          invited_org:organizations!invited_org_id(name)
        `)
        .single();
      
      if (error) throw error;
      
      if (collaboration) {
        setSentInvitations([collaboration as Collaboration, ...sentInvitations]);
        toast.success("Undangan kolaborasi berhasil dikirim.");
        setOrganizationEmail("");
      }
    } catch (error: any) {
      console.error("Error sending collaboration invitation:", error);
      toast.error(error.message || "Gagal mengirim undangan kolaborasi.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRespondToInvitation = async (collabId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('collaborations')
        .update({ 
          status: accept ? 'accepted' as const : 'rejected' as const
        })
        .eq('id', collabId);
      
      if (error) throw error;
      
      toast.success(`Undangan kolaborasi berhasil ${accept ? 'diterima' : 'ditolak'}.`);
      
      // Update local state
      if (currentOrgId) {
        fetchCollaborations(currentOrgId);
      }
    } catch (error: any) {
      console.error("Error responding to collaboration:", error);
      toast.error(error.message || "Gagal memproses undangan.");
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Kolaborasi Organisasi</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-blue-600" />
                <CardTitle>Undang Organisasi untuk Kolaborasi</CardTitle>
              </div>
              <CardDescription>
                Undang organisasi lain untuk berkolaborasi dengan {currentOrgName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationEmail">Email Admin Organisasi</Label>
                  <Input
                    id="organizationEmail"
                    type="email"
                    placeholder="admin@organization.com"
                    value={organizationEmail}
                    onChange={(e) => setOrganizationEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Masukkan email admin dari organisasi yang ingin Anda ajak berkolaborasi
                  </p>
                </div>
                <Button type="submit" disabled={isLoading || !currentOrgId}>
                  {isLoading ? "Mengirim..." : "Kirim Undangan Kolaborasi"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Active Collaborations */}
          <Card>
            <CardHeader>
              <CardTitle>Kolaborasi Aktif</CardTitle>
              <CardDescription>
                Organisasi yang sedang berkolaborasi dengan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeCollaborations.length > 0 ? (
                <div className="divide-y border rounded-lg">
                  {activeCollaborations.map((collab) => (
                    <div key={collab.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {collab.invited_org_id === currentOrgId ? 
                              collab.inviting_org?.name : 
                              collab.invited_org?.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Kolaborasi dimulai pada {formatDate(collab.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Aktif
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>Belum ada kolaborasi aktif</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Received Invitations */}
          {receivedInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Undangan Kolaborasi Masuk</CardTitle>
                <CardDescription>
                  Organisasi yang mengundang Anda untuk berkolaborasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y border rounded-lg">
                  {receivedInvitations.map((collab) => (
                    <div key={collab.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{collab.inviting_org?.name}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Diterima pada {formatDate(collab.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {collab.status === 'pending' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleRespondToInvitation(collab.id, true)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Terima
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRespondToInvitation(collab.id, false)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Tolak
                            </Button>
                          </>
                        ) : collab.status === 'rejected' ? (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <X className="h-3 w-3 mr-1" />
                            Ditolak
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            {collab.status}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sent Invitations */}
          {sentInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Undangan Kolaborasi Terkirim</CardTitle>
                <CardDescription>
                  Organisasi yang telah Anda undang untuk berkolaborasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y border rounded-lg">
                  {sentInvitations
                    .filter(collab => collab.status !== 'accepted')
                    .map((collab) => (
                    <div key={collab.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{collab.invited_org?.name}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Dikirim pada {formatDate(collab.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {collab.status === 'pending' ? (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Menunggu
                          </div>
                        ) : collab.status === 'rejected' ? (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <X className="h-3 w-3 mr-1" />
                            Ditolak
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {collab.status}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationCollaboration;
