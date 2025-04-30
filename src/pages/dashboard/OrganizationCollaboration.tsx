
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Link, Building, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";

interface Organization {
  id: string;
  name: string;
  business_field: string | null;
}

interface Collaboration {
  id: string;
  inviting_org_id: string;
  invited_org_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  message: string | null;
  inviting_organization?: Organization;
  invited_organization?: Organization;
}

const OrganizationCollaboration = () => {
  const { organization, isAdmin } = useOrganization();
  const [orgName, setOrgName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [incomingCollaborations, setIncomingCollaborations] = useState<Collaboration[]>([]);
  const [outgoingCollaborations, setOutgoingCollaborations] = useState<Collaboration[]>([]);
  const [respondingTo, setRespondingTo] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (organization?.id) {
      fetchCollaborations();
    }
  }, [organization?.id]);
  
  const fetchCollaborations = async () => {
    setIsLoading(true);
    try {
      // Fetch incoming collaborations (where our organization was invited)
      const { data: incomingData, error: incomingError } = await supabase
        .from('collaborations')
        .select(`
          *,
          inviting_organization:organizations!inviting_org_id (id, name, business_field)
        `)
        .eq('invited_org_id', organization?.id);
      
      if (incomingError) throw incomingError;
      
      // Fetch outgoing collaborations (where we invited other organizations)
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('collaborations')
        .select(`
          *,
          invited_organization:organizations!invited_org_id (id, name, business_field)
        `)
        .eq('inviting_org_id', organization?.id);
      
      if (outgoingError) throw outgoingError;
      
      setIncomingCollaborations(incomingData as Collaboration[]);
      setOutgoingCollaborations(outgoingData as Collaboration[]);
    } catch (error: any) {
      console.error("Error fetching collaborations:", error);
      toast.error("Gagal memuat data kolaborasi");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk mengundang organisasi");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Find organization by name
      const { data: invitedOrg, error: findError } = await supabase
        .from('organizations')
        .select('id, name')
        .ilike('name', `%${orgName}%`)
        .neq('id', organization?.id)
        .limit(1)
        .single();
      
      if (findError) {
        toast.error("Organisasi tidak ditemukan");
        setIsLoading(false);
        return;
      }
      
      // Check if there's already a pending collaboration
      const { data: existingCollab, error: checkError } = await supabase
        .from('collaborations')
        .select('id')
        .eq('inviting_org_id', organization?.id)
        .eq('invited_org_id', invitedOrg.id)
        .eq('status', 'pending');
      
      if (existingCollab && existingCollab.length > 0) {
        toast.error("Undangan kolaborasi sudah ada dan masih dalam status tertunda");
        setIsLoading(false);
        return;
      }
      
      // Create collaboration invitation
      const { error: inviteError } = await supabase
        .from('collaborations')
        .insert({
          inviting_org_id: organization?.id,
          invited_org_id: invitedOrg.id,
          message: message,
          status: 'pending'
        });
      
      if (inviteError) throw inviteError;
      
      toast.success(`Undangan kolaborasi berhasil dikirim ke ${invitedOrg.name}`);
      setOrgName("");
      setMessage("");
      fetchCollaborations();
    } catch (error: any) {
      console.error("Error creating collaboration:", error);
      toast.error(error.message || "Gagal mengirim undangan kolaborasi");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCollaborationResponse = async (collabId: string, accept: boolean) => {
    setRespondingTo(prev => ({ ...prev, [collabId]: true }));
    
    try {
      const { error } = await supabase
        .from('collaborations')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', collabId)
        .eq('invited_org_id', organization?.id);
      
      if (error) throw error;
      
      toast.success(accept 
        ? "Kolaborasi berhasil diterima" 
        : "Undangan kolaborasi ditolak");
        
      fetchCollaborations();
    } catch (error: any) {
      console.error("Error responding to collaboration:", error);
      toast.error("Gagal memproses respons kolaborasi");
    } finally {
      setRespondingTo(prev => ({ ...prev, [collabId]: false }));
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Diterima
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Tertunda
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Kolaborasi Organisasi</h1>
        
        {isAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Link className="h-5 w-5 text-blue-600" />
                <CardTitle>Undang Organisasi</CardTitle>
              </div>
              <CardDescription>
                Undang organisasi lain untuk berkolaborasi dengan organisasi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nama Organisasi</Label>
                  <Input
                    id="orgName"
                    placeholder="Masukkan nama organisasi"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan (opsional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Masukkan pesan untuk organisasi yang diundang"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button type="submit" disabled={isLoading || !isAdmin}>
                  {isLoading ? "Mengirim..." : "Kirim Undangan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Incoming Collaborations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-blue-600" />
                <CardTitle>Undangan Masuk</CardTitle>
              </div>
              <CardDescription>
                Undangan kolaborasi dari organisasi lain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4 text-gray-500">Memuat data...</p>
              ) : incomingCollaborations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>Belum ada undangan kolaborasi masuk</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingCollaborations.map((collab) => (
                    <div key={collab.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{collab.inviting_organization?.name || 'Organisasi tidak diketahui'}</p>
                          <p className="text-sm text-gray-500">{formatDate(collab.created_at)}</p>
                        </div>
                        {getStatusBadge(collab.status)}
                      </div>
                      
                      {collab.message && (
                        <p className="text-sm bg-gray-50 p-3 rounded my-2 italic">"{collab.message}"</p>
                      )}
                      
                      {collab.status === 'pending' && isAdmin && (
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleCollaborationResponse(collab.id, true)}
                            disabled={respondingTo[collab.id]}
                          >
                            Terima
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCollaborationResponse(collab.id, false)}
                            disabled={respondingTo[collab.id]}
                          >
                            Tolak
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Outgoing Collaborations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle>Undangan Terkirim</CardTitle>
              </div>
              <CardDescription>
                Undangan yang Anda kirim ke organisasi lain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4 text-gray-500">Memuat data...</p>
              ) : outgoingCollaborations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>Belum ada undangan kolaborasi terkirim</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingCollaborations.map((collab) => (
                    <div key={collab.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{collab.invited_organization?.name || 'Organisasi tidak diketahui'}</p>
                          <p className="text-sm text-gray-500">{formatDate(collab.created_at)}</p>
                        </div>
                        {getStatusBadge(collab.status)}
                      </div>
                      
                      {collab.message && (
                        <p className="text-sm bg-gray-50 p-3 rounded my-2 italic">"{collab.message}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCollaboration;
