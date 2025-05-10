import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/components/ui/use-toast';
import { useOrganization } from '@/hooks/useOrganization';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Mail, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MagicLinkInvitation } from '@/types/magic-link';

const InviteMembers = () => {
  const { organization, isAdmin } = useOrganization();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [invitations, setInvitations] = useState<MagicLinkInvitation[]>([]);
  const [expiredInvitations, setExpiredInvitations] = useState<MagicLinkInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [resendingId, setResendingId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (organization?.id) {
      fetchPendingInvitations();
      fetchExpiredInvitations();
    }
  }, [organization?.id]);

  const fetchPendingInvitations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('magic_link_invitations')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      setInvitations(data || []);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending invitations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpiredInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('magic_link_invitations')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());
      
      if (error) throw error;
      
      setExpiredInvitations(data || []);
    } catch (error: any) {
      console.error('Error fetching expired invitations:', error);
    }
  };

  const handleCreateInvitation = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email is required',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await supabase.functions.invoke('send-magic-link', {
        body: { 
          email, 
          organizationId: organization?.id,
          role 
        }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: 'Success',
        description: `Invitation sent to ${email}`,
      });
      
      setEmail('');
      fetchPendingInvitations();
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invitation',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      setDeletingId(invitationId);
      const { error } = await supabase
        .from('magic_link_invitations')
        .delete()
        .eq('id', invitationId);
      
      if (error) throw error;
      
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast({
        title: 'Success',
        description: 'Invitation deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete invitation',
        variant: 'destructive'
      });
    } finally {
      setDeletingId('');
    }
  };

  const handleResendInvitation = async (invitation: any) => {
    try {
      setResendingId(invitation.id);
      
      const response = await supabase.functions.invoke('send-magic-link', {
        body: { 
          email: invitation.email, 
          organizationId: organization?.id,
          role: invitation.role 
        }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: 'Success',
        description: `Invitation resent to ${invitation.email}`,
      });
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend invitation',
        variant: 'destructive'
      });
    } finally {
      setResendingId('');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized</CardTitle>
          <CardDescription>You do not have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Invite Members</CardTitle>
          <CardDescription>Add new members to your organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreateInvitation} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Invitation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Manage pending invitations to your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading invitations...
            </div>
          ) : invitations.length > 0 ? (
            <Table>
              <TableCaption>A list of pending invitations to your organization.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Avatar</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                          {getInitials(invitation.email)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell className="capitalize">{invitation.role}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleResendInvitation(invitation)}
                          disabled={resendingId === invitation.id}
                        >
                          {resendingId === invitation.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          disabled={deletingId === invitation.id}
                        >
                          {deletingId === invitation.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total pending invitations: {invitations.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
            <p>No pending invitations.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expired Invitations</CardTitle>
          <CardDescription>Manage expired invitations to your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {expiredInvitations.length > 0 ? (
            <Table>
              <TableCaption>A list of expired invitations to your organization.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Avatar</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiredInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                          {getInitials(invitation.email)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell className="capitalize">{invitation.role}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleResendInvitation(invitation)}
                          disabled={resendingId === invitation.id}
                        >
                          {resendingId === invitation.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          disabled={deletingId === invitation.id}
                        >
                          {deletingId === invitation.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total expired invitations: {expiredInvitations.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ) : (
            <p>No expired invitations.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteMembers;
