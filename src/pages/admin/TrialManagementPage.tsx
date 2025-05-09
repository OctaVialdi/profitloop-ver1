import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface TrialExtensionRequest {
  id: string;
  organization_id: string;
  organization_name: string;
  user_id: string;
  user_email: string;
  reason: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const TrialManagementPage = () => {
  const { isSuperAdmin } = useOrganization();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<TrialExtensionRequest[]>([]);
  const [organizations, setOrganizations] = useState<{ id: string; name: string; trial_end_date: string; subscription_status: string }[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [daysToAdd, setDaysToAdd] = useState<number>(7);
  
  // Fetch trial extension requests and organizations
  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Unauthorized access");
      navigate("/dashboard");
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get trial extension requests from subscription_audit_logs
        const { data: auditLogs, error: logsError } = await supabase
          .from('subscription_audit_logs')
          .select(`
            id,
            organization_id,
            user_id,
            data,
            created_at,
            organizations (name)
          `)
          .eq('action', 'trial_extension_requested')
          .order('created_at', { ascending: false });
        
        if (logsError) throw logsError;
        
        // Get user emails for each request
        const userIds = auditLogs.map(log => log.user_id).filter(Boolean);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Format the requests
        const formattedRequests = auditLogs.map(log => {
          const profile = profiles.find(p => p.id === log.user_id);
          const logData = typeof log.data === 'string' ? JSON.parse(log.data) : log.data;
          
          return {
            id: log.id,
            organization_id: log.organization_id,
            organization_name: log.organizations?.name || 'Unknown',
            user_id: log.user_id,
            user_email: profile?.email || 'Unknown',
            reason: logData?.reason || '',
            requested_at: new Date(log.created_at).toLocaleString(),
            status: logData?.status || 'pending'
          };
        });
        
        setRequests(formattedRequests);
        
        // Get all organizations
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('id, name, trial_end_date, subscription_status')
          .order('name');
          
        if (orgsError) throw orgsError;
        setOrganizations(orgs);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isSuperAdmin, navigate]);
  
  const handleExtendTrial = async () => {
    if (!selectedOrg || daysToAdd <= 0) {
      toast.error("Please select an organization and enter valid days");
      return;
    }
    
    try {
      // Call the extend_organization_trial function using a direct query
      // We can't use rpc here since TypeScript doesn't know about our new function yet
      const { data, error } = await supabase
        .from('rpc')
        .select('*')
        .filter('name', 'eq', 'extend_organization_trial')
        .eq('args', { org_id: selectedOrg, days_to_add: daysToAdd });
      
      if (error) throw error;
      
      toast.success(`Trial extended successfully by ${daysToAdd} days`);
      
      // Refresh organizations list
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, trial_end_date, subscription_status')
        .order('name');
        
      if (orgsError) throw orgsError;
      setOrganizations(orgs);
      
    } catch (error) {
      console.error('Error extending trial:', error);
      toast.error('Failed to extend trial');
    }
  };
  
  if (!isSuperAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Trial Management</h1>
      
      {/* Manual Trial Extension */}
      <Card>
        <CardHeader>
          <CardTitle>Extend Trial Period</CardTitle>
          <CardDescription>
            Manually extend the trial period for an organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} ({org.subscription_status === 'trial' 
                        ? `Trial ends: ${new Date(org.trial_end_date).toLocaleDateString()}` 
                        : org.subscription_status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="days">Days to Add</Label>
              <Input
                id="days"
                type="number"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExtendTrial}>
            Extend Trial
          </Button>
        </CardFooter>
      </Card>
      
      {/* Trial Extension Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Trial Extension Requests</CardTitle>
          <CardDescription>
            Manage incoming requests for trial extensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trial extension requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.organization_name}</TableCell>
                    <TableCell>{request.user_email}</TableCell>
                    <TableCell>{request.requested_at}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {request.reason}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600"
                          onClick={() => {
                            setSelectedOrg(request.organization_id);
                            setDaysToAdd(7);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialManagementPage;
