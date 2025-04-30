import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building, Check, X, Clock, UserPlus, Mail, Share } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface Organization {
  id: string;
  name: string;
  business_field?: string;
  employee_count?: number;
}

interface Collaboration {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  invited_org_id: string;
  inviting_org_id: string;
  invited_org?: {
    name: string;
    business_field?: string;
    employee_count?: number;
  };
  inviting_org?: {
    name: string;
    business_field?: string;
    employee_count?: number;
  };
  message?: string;
}

const OrganizationCollaboration = () => {
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCollaborations, setIsLoadingCollaborations] = useState(true);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentOrgName, setCurrentOrgName] = useState<string>("");
  const [sentInvitations, setSentInvitations] = useState<Collaboration[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Collaboration[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<Collaboration[]>([]);
  const [selectedCollab, setSelectedCollab] = useState<Collaboration | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  // Fetch user's organization id and name
  useEffect(() => {
    const fetchOrganizationData = async () => {
      setIsLoadingCollaborations(true);
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
          await fetchCollaborations(profile.organization_id);
        }
      }
      setIsLoadingCollaborations(false);
    };
    
    fetchOrganizationData();
  }, []);
  
  const fetchCollaborations = async (orgId: string) => {
    // Fetch sent invitations - specifying the exact columns for invited_org
    const { data: sentData, error: sentError } = await supabase
      .from('collaborations')
      .select(`
        id, status, created_at, invited_org_id, inviting_org_id, message,
        invited_org:organizations!invited_org_id(name, business_field, employee_count)
      `)
      .eq('inviting_org_id', orgId);
    
    // Fetch received invitations - specifying the exact columns for inviting_org
    const { data: receivedData, error: receivedError } = await supabase
      .from('collaborations')
      .select(`
        id, status, created_at, invited_org_id, inviting_org_id, message,
        inviting_org:organizations!inviting_org_id(name, business_field, employee_count)
      `)
      .eq('invited_org_id', orgId);
    
    if (sentData && !sentError) {
      setSentInvitations(sentData as unknown as Collaboration[]);
    } else if (sentError) {
      console.error("Error fetching sent collaborations:", sentError);
    }
    
    if (receivedData && !receivedError) {
      // Separate active collaborations from pending/rejected invitations
      const active = receivedData.filter(collab => collab.status === 'accepted') as unknown as Collaboration[];
      const pending = receivedData.filter(collab => collab.status !== 'accepted') as unknown as Collaboration[];
      
      setActiveCollaborations([
        ...active, 
        ...(sentData && !sentError ? sentData.filter(collab => collab.status === 'accepted') || [] : []) as unknown as Collaboration[]
      ]);
      setReceivedInvitations(pending);
    } else if (receivedError) {
      console.error("Error fetching received collaborations:", receivedError);
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
          status: 'pending',
          message: message || null
        })
        .select(`
          id, status, created_at, invited_org_id, inviting_org_id, message,
          invited_org:organizations!invited_org_id(name, business_field, employee_count)
        `)
        .single();
      
      if (error) throw error;
      
      if (collaboration) {
        setSentInvitations([collaboration as Collaboration, ...sentInvitations]);
        
        // Create notification for the invited organization admins
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('organization_id', invitedOrgId)
          .in('role', ['super_admin', 'admin']);
          
        if (admins && admins.length > 0) {
          for (const admin of admins) {
            await supabase
              .from('notifications')
              .insert({
                user_id: admin.id,
                organization_id: invitedOrgId,
                title: 'Undangan Kolaborasi Baru',
                message: `${currentOrgName} mengundang organisasi Anda untuk berkolaborasi.`,
                type: 'info',
                action_url: '/collaborations'
              });
          }
        }
        
        toast.success("Undangan kolaborasi berhasil dikirim.");
        setOrganizationEmail("");
        setMessage("");
        
        // Switch to sent tab
        setActiveTab("sent");
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
          status: accept ? 'accepted' : 'rejected'
        })
        .eq('id', collabId);
      
      if (error) throw error;
      
      // Get the collaboration details to send notification
      const { data: collab } = await supabase
        .from('collaborations')
        .select(`
          inviting_org_id,
          inviting_org:organizations!inviting_org_id(name),
          invited_org:organizations!invited_org_id(name)
        `)
        .eq('id', collabId)
        .single();
        
      if (collab) {
        // Create notification for the inviting organization admins
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('organization_id', collab.inviting_org_id)
          .in('role', ['super_admin', 'admin']);
          
        if (admins && admins.length > 0) {
          for (const admin of admins) {
            await supabase
              .from('notifications')
              .insert({
                user_id: admin.id,
                organization_id: collab.inviting_org_id,
                title: accept ? 'Undangan Kolaborasi Diterima' : 'Undangan Kolaborasi Ditolak',
                message: accept 
                  ? `${collab.invited_org.name} telah menerima undangan kolaborasi Anda.`
                  : `${collab.invited_org.name} telah menolak undangan kolaborasi Anda.`,
                type: accept ? 'success' : 'info',
                action_url: '/collaborations'
              });
          }
        }
      }
      
      toast.success(`Undangan kolaborasi berhasil ${accept ? 'diterima' : 'ditolak'}.`);
      
      // Update local state
      if (currentOrgId) {
        fetchCollaborations(currentOrgId);
        
        // Switch to active tab if accepted
        if (accept) {
          setActiveTab("active");
        }
      }
    } catch (error: any) {
      console.error("Error responding to collaboration:", error);
      toast.error(error.message || "Gagal memproses undangan.");
    }
  };
  
  const handleEndCollaboration = async (collabId: string) => {
    try {
      // Get the collaboration details to send notification
      const { data: collab } = await supabase
        .from('collaborations')
        .select(`
          invited_org_id, inviting_org_id,
          inviting_org:organizations!inviting_org_id(name),
          invited_org:organizations!invited_org_id(name)
        `)
        .eq('id', collabId)
        .single();
      
      // Delete the collaboration
      const { error } = await supabase
        .from('collaborations')
        .delete()
        .eq('id', collabId);
      
      if (error) throw error;
      
      // Find out which organization is the other one
      let otherOrgId = '';
      let otherOrgName = '';
      let currentOrgName = '';
      
      if (collab) {
        if (collab.inviting_org_id === currentOrgId) {
          otherOrgId = collab.invited_org_id;
          otherOrgName = collab.invited_org.name;
          currentOrgName = collab.inviting_org.name;
        } else {
          otherOrgId = collab.inviting_org_id;
          otherOrgName = collab.inviting_org.name;
          currentOrgName = collab.invited_org.name;
        }
        
        // Create notification for the other organization admins
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('organization_id', otherOrgId)
          .in('role', ['super_admin', 'admin']);
          
        if (admins && admins.length > 0) {
          for (const admin of admins) {
            await supabase
              .from('notifications')
              .insert({
                user_id: admin.id,
                organization_id: otherOrgId,
                title: 'Kolaborasi Diakhiri',
                message: `${currentOrgName} telah mengakhiri kolaborasi dengan organisasi Anda.`,
                type: 'warning',
                action_url: '/collaborations'
              });
          }
        }
      }
      
      toast.success("Kolaborasi berhasil diakhiri.");
      
      // Update local state
      if (currentOrgId) {
        fetchCollaborations(currentOrgId);
      }
    } catch (error: any) {
      console.error("Error ending collaboration:", error);
      toast.error(error.message || "Gagal mengakhiri kolaborasi.");
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  const getOrganizationDetails = (collab: Collaboration) => {
    const isInvited = collab.invited_org_id === currentOrgId;
    const org = isInvited ? collab.inviting_org : collab.invited_org;
    
    return (
      <div>
        <div className="font-medium">{org?.name || "Organisasi"}</div>
        {org?.business_field && (
          <div className="text-sm text-gray-500">{org.business_field}</div>
        )}
        {org?.employee_count && (
          <div className="text-xs text-gray-500">{org.employee_count} anggota</div>
        )}
      </div>
    );
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aktif</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoadingCollaborations) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />
          <Tabs defaultValue="active">
            <TabsList className="mb-8">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24 ml-1" />
              <Skeleton className="h-10 w-24 ml-1" />
            </TabsList>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-72 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 mb-4" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Kolaborasi Organisasi</h1>
          <p className="text-gray-600">
            Kelola kolaborasi dengan organisasi lain dan tingkatkan jaringan bisnis Anda
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="active">
              <Building className="h-4 w-4 mr-2" />
              Aktif ({activeCollaborations.length})
            </TabsTrigger>
            <TabsTrigger value="received">
              <Mail className="h-4 w-4 mr-2" />
              Diterima ({receivedInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              <Share className="h-4 w-4 mr-2" />
              Terkirim ({sentInvitations.filter(collab => collab.status !== 'accepted').length})
            </TabsTrigger>
            <TabsTrigger value="invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Undang
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Kolaborasi Aktif</CardTitle>
                <CardDescription>
                  Daftar organisasi yang sedang berkolaborasi dengan Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeCollaborations.length > 0 ? (
                  <div className="divide-y border rounded-lg">
                    {activeCollaborations.map((collab) => (
                      <div key={collab.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            {getOrganizationDetails(collab)}
                            <div className="text-sm text-gray-500 mt-1">
                              <span>Kolaborasi aktif sejak {formatDate(collab.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">Akhiri Kolaborasi</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Pengakhiran Kolaborasi</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin mengakhiri kolaborasi dengan organisasi ini? 
                                Tindakan ini tidak dapat dibatalkan, tapi Anda bisa mengundang mereka lagi nanti.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleEndCollaboration(collab.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Ya, Akhiri Kolaborasi
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>Belum ada kolaborasi aktif</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setActiveTab("invite")}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Undang Organisasi
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="received">
            <Card>
              <CardHeader>
                <CardTitle>Undangan Kolaborasi Masuk</CardTitle>
                <CardDescription>
                  Organisasi yang mengundang Anda untuk berkolaborasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {receivedInvitations.length > 0 ? (
                  <div className="divide-y border rounded-lg">
                    {receivedInvitations.map((collab) => (
                      <div key={collab.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Building className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              {getOrganizationDetails(collab)}
                              <div className="text-sm text-gray-500 mt-1">
                                <span>Diterima pada {formatDate(collab.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-2">
                            {getStatusBadge(collab.status)}
                          </div>
                        </div>
                        
                        {collab.message && (
                          <div className="mt-3 pl-14">
                            <div className="text-sm italic bg-gray-50 p-3 rounded-lg border">
                              "{collab.message}"
                            </div>
                          </div>
                        )}
                        
                        {collab.status === 'pending' && (
                          <div className="mt-4 pl-14 flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleRespondToInvitation(collab.id, true)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Terima
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRespondToInvitation(collab.id, false)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Tolak
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>Tidak ada undangan kolaborasi masuk</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sent">
            <Card>
              <CardHeader>
                <CardTitle>Undangan Kolaborasi Terkirim</CardTitle>
                <CardDescription>
                  Organisasi yang telah Anda undang untuk berkolaborasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sentInvitations.filter(collab => collab.status !== 'accepted').length > 0 ? (
                  <div className="divide-y border rounded-lg">
                    {sentInvitations
                      .filter(collab => collab.status !== 'accepted')
                      .map((collab) => (
                      <div key={collab.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Building className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              {getOrganizationDetails(collab)}
                              <div className="text-sm text-gray-500 mt-1">
                                <span>Dikirim pada {formatDate(collab.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {collab.status === 'pending' ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Menunggu
                              </Badge>
                            ) : collab.status === 'rejected' ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <X className="h-3 w-3 mr-1" />
                                Ditolak
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {collab.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {collab.message && (
                          <div className="mt-3 pl-14">
                            <div className="text-sm italic bg-gray-50 p-3 rounded-lg border">
                              "{collab.message}"
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 pl-14">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">Batalkan Undangan</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Pembatalan Undangan</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin membatalkan undangan kolaborasi ini? 
                                  Tindakan ini tidak dapat dibatalkan, tapi Anda bisa mengundang mereka lagi nanti.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleEndCollaboration(collab.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Ya, Batalkan Undangan
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-lg">
                    <Share className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>Tidak ada undangan kolaborasi terkirim</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invite">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan (Opsional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan singkat tentang tujuan kolaborasi ini..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading || !currentOrgId} className="w-full">
                    {isLoading ? "Mengirim..." : "Kirim Undangan Kolaborasi"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 pb-0">
                <p className="text-sm text-gray-500">
                  Organisasi akan menerima notifikasi undangan
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationCollaboration;
