
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Check, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected'; // Updated to include 'rejected'
  created_at: string;
  expires_at?: string;
  token?: string;
  organization_id?: string;
}

const InviteMembers = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // Fetch user's organization id and existing invitations
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user's organization
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
        
        if (profileData && profileData.organization_id) {
          setOrganizationId(profileData.organization_id);
          
          // Fetch existing invitations
          const { data: invitationsData, error } = await supabase
            .from('invitations')
            .select('id, email, status, created_at')
            .eq('organization_id', profileData.organization_id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error("Error fetching invitations:", error);
            toast.error("Gagal memuat undangan yang ada.");
          } else {
            // Cast the status to the correct type
            const typedInvitations: Invitation[] = invitationsData?.map(inv => ({
              ...inv,
              status: (inv.status as 'pending' | 'accepted' | 'rejected') || 'pending'
            })) || [];
            
            setInvitations(typedInvitations);
          }
        }
      }
    };
    
    fetchUserData();
  }, []);

  const generateToken = () => {
    // Generate a random token for the invitation
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationId) {
      toast.error("Tidak dapat menemukan organisasi Anda.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if user is already invited
      const { data: existingInvite } = await supabase
        .from('invitations')
        .select('id')
        .eq('email', email)
        .eq('organization_id', organizationId)
        .eq('status', 'pending')
        .single();
      
      if (existingInvite) {
        toast.error("Email ini sudah memiliki undangan yang tertunda.");
        setIsLoading(false);
        return;
      }
      
      // Check if user already exists in same organization
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .eq('organization_id', organizationId)
        .single();
        
      if (existingUser) {
        toast.error("Pengguna dengan email ini sudah ada di organisasi Anda.");
        setIsLoading(false);
        return;
      }
      
      // Create invitation
      const token = generateToken();
      
      const { data: invitation, error } = await supabase
        .from('invitations')
        .insert({
          organization_id: organizationId,
          email: email,
          token: token,
          // On a real application, we would set expire_at, but using default now
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // In a real app, we would send an email to the user with a link containing the token
      // For now, we'll just log it and show a success message
      console.log("Invitation token:", token);
      
      toast.success(`Undangan telah dikirim ke ${email}`);
      setEmail("");
      
      // Add the new invitation to the list with proper type casting
      if (invitation) {
        const typedInvitation: Invitation = {
          ...invitation,
          status: (invitation.status as 'pending' | 'accepted' | 'rejected') || 'pending'
        };
        
        setInvitations([typedInvitation, ...invitations]);
      }
    } catch (error: any) {
      console.error("Invitation error:", error);
      toast.error(error.message || "Gagal mengirim undangan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold mb-6">Undang Anggota</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <CardTitle>Undang Anggota Baru</CardTitle>
            </div>
            <CardDescription>
              Kirim undangan kepada anggota baru untuk bergabung dengan organisasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Karyawan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading || !organizationId}>
                {isLoading ? "Mengirim..." : "Kirim Undangan"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Undangan Terkirim</h2>
          <div className="bg-white rounded-lg border">
            {invitations.length > 0 ? (
              <div className="divide-y">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{invitation.email}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Dikirim pada {formatDate(invitation.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {invitation.status === 'pending' ? (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Menunggu
                        </div>
                      ) : invitation.status === 'accepted' ? (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Diterima
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="h-3 w-3 mr-1" />
                          Ditolak
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p>Belum ada undangan yang dikirim</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
