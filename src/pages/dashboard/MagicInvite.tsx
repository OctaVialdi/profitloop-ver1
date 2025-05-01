
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Check, X, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useOrganization } from "@/hooks/useOrganization";

interface MagicInvitation {
  id: string;
  email: string;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  expires_at?: string;
  role?: string;
}

const MagicInvite = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState<{[key: string]: boolean}>({});
  const [invitations, setInvitations] = useState<MagicInvitation[]>([]);
  const { organization, isAdmin, isSuperAdmin } = useOrganization();

  // Fetch existing invitations
  useEffect(() => {
    if (organization?.id) {
      fetchInvitations();
    }
  }, [organization]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('magic_link_invitations')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Type cast the data to match MagicInvitation interface
      setInvitations(data?.map(item => ({
        ...item,
        status: item.status as 'pending' | 'sent' | 'accepted' | 'rejected'
      })) || []);
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization?.id) {
      toast.error("Organization not found");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if email already exists in the organization
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .eq('organization_id', organization.id)
        .maybeSingle();
        
      if (existingUser) {
        toast.error("This email is already a member of your organization");
        setIsLoading(false);
        return;
      }
      
      // Generate magic link invitation
      const { data, error } = await supabase.rpc('generate_magic_link_invitation', {
        email_address: email,
        org_id: organization.id,
        user_role: role
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(`Invitation has been created for ${email}`);
      setEmail("");
      
      // Refresh invitations list
      await fetchInvitations();
      
      // Automatically send the invitation email if token was generated
      if (data && typeof data === 'object' && 'invitation_id' in data) {
        await sendInvitationEmail(data.invitation_id as string);
      }
    } catch (error: any) {
      console.error("Invitation error:", error);
      toast.error(error.message || "Failed to create invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const sendInvitationEmail = async (invitationId: string) => {
    setIsSending(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      const baseUrl = window.location.origin;
      
      const response = await supabase.functions.invoke('send-magic-invitation', {
        body: { invitationId, baseUrl }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to send invitation email");
      }
      
      // Update local state
      setInvitations(invitations.map(inv => 
        inv.id === invitationId ? { ...inv, status: 'sent' as const } : inv
      ));
      
      toast.success("Magic link invitation has been sent!");
    } catch (error: any) {
      console.error("Error sending invitation email:", error);
      toast.error(error.message || "Failed to send invitation email");
    } finally {
      setIsSending(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  const getStatusDisplay = (status: MagicInvitation['status']) => {
    switch(status) {
      case 'pending':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Created
          </div>
        );
      case 'sent':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Mail className="h-3 w-3 mr-1" />
            Sent
          </div>
        );
      case 'accepted':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Accepted
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Magic Link Invitations</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <CardTitle>Invite via Magic Link</CardTitle>
            </div>
            <CardDescription>
              Invite members to join your organization with a passwordless magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {isSuperAdmin && (
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    )}
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading || !organization?.id}>
                {isLoading ? "Creating..." : "Send Magic Link Invitation"}
              </Button>
            </form>
            
            <Separator className="my-6" />
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">How it works:</h3>
              <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
                <li>The invited user will receive an email with a magic link</li>
                <li>When they click the link, they'll join your organization instantly</li>
                <li>No password is required for the initial login</li>
                <li>Invitations expire after 7 days</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sent Invitations</h2>
            <Button variant="outline" size="sm" onClick={fetchInvitations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="bg-white rounded-lg border">
            {invitations.length > 0 ? (
              <div className="divide-y">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{invitation.email}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
                          {invitation.role || 'employee'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Created on {formatDate(invitation.created_at)}
                        {invitation.expires_at && (
                          <span className="ml-2">
                            • Expires on {formatDate(invitation.expires_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusDisplay(invitation.status)}
                      
                      {(invitation.status === 'pending') && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => sendInvitationEmail(invitation.id)}
                          disabled={isSending[invitation.id]}
                        >
                          {isSending[invitation.id] ? (
                            <>Sending...</>
                          ) : (
                            <>
                              <Mail className="h-3 w-3 mr-1" />
                              Send Email
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p>No invitations sent yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicInvite;
