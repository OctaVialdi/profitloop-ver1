import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClipboardIcon, LinkIcon, PlusIcon, Share2Icon, CopyIcon, CheckCircleIcon, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

// Application base URL - change this to your domain in production
const APPLICATION_BASE_URL = "https://app.profitloop.id";

interface InvitationLink {
  id: string;
  position: string;
  link: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
  submissions: number;
  status: 'active' | 'expired' | 'disabled';
}

export default function InvitationLinks() {
  // Get search params to check if we're being directed here with a job ID
  const [searchParams] = useSearchParams();
  const jobIdFromParams = searchParams.get("jobId");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>(jobIdFromParams || "");
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});
  const [expirationPeriod, setExpirationPeriod] = useState<string>("30");
  const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([]);
  const [jobPositions, setJobPositions] = useState<{id: string, title: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Open the dialog automatically if a jobId is provided in the URL
  useEffect(() => {
    if (jobIdFromParams) {
      setIsDialogOpen(true);
    }
  }, [jobIdFromParams]);
  
  // Fetch invitation links and job positions when the component loads
  useEffect(() => {
    fetchInvitationLinks();
    fetchJobPositions();
  }, []);
  
  const fetchInvitationLinks = async () => {
    setIsRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      const { data: links, error } = await supabase
        .from('recruitment_links')
        .select(`
          id, 
          job_position_id,
          token,
          created_at,
          expires_at,
          clicks,
          submissions,
          status,
          job_positions(title)
        `)
        .eq('organization_id', profileData.organization_id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (links) {
        const formattedLinks: InvitationLink[] = links.map(link => ({
          id: link.id,
          position: link.job_positions?.title || 'General Application',
          link: `${APPLICATION_BASE_URL}/apply/${link.token}`,
          createdAt: new Date(link.created_at).toLocaleDateString(),
          expiresAt: link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'N/A',
          clicks: link.clicks || 0,
          submissions: link.submissions || 0,
          status: link.status as 'active' | 'expired' | 'disabled'
        }));
        
        setInvitationLinks(formattedLinks);
      }
    } catch (error: any) {
      console.error("Error fetching invitation links:", error);
      toast.error("Failed to fetch invitation links");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const fetchJobPositions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      const { data, error } = await supabase
        .from('job_positions')
        .select('id, title')
        .eq('status', 'active')
        .eq('organization_id', profileData.organization_id);
        
      if (error) throw error;
      
      if (data) {
        setJobPositions(data);
      }
    } catch (error: any) {
      console.error("Error fetching job positions:", error);
      toast.error("Failed to fetch job positions");
    }
  };

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLinks(prev => ({ ...prev, [id]: true }));
      toast.success("Link copied to clipboard");
      
      // Reset the copied status after 3 seconds
      setTimeout(() => {
        setCopiedLinks(prev => ({ ...prev, [id]: false }));
      }, 3000);
    });
  };

  const handleGenerateLink = async () => {
    if (!selectedPosition) {
      toast.error("Please select a position");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the user's organization ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      // Call the Supabase function to generate a link
      const { data, error } = await supabase.rpc(
        'generate_recruitment_link',
        { 
          p_organization_id: profileData.organization_id,
          p_job_position_id: selectedPosition,
          p_expires_in_days: parseInt(expirationPeriod)
        }
      );
      
      if (error) throw error;
      
      toast.success("New invitation link generated");
      fetchInvitationLinks(); // Refresh the list
      setIsDialogOpen(false);
      setSelectedPosition("");
      
      // Clear the jobId from URL if it exists
      if (jobIdFromParams) {
        // Remove the jobId parameter from the URL without reloading the page
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("jobId");
        window.history.replaceState(
          {},
          "",
          window.location.pathname + (newSearchParams.toString() ? `?${newSearchParams.toString()}` : "")
        );
      }
    } catch (error: any) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate link");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'expired':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'disabled':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Invitation Links
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchInvitationLinks}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                <span>Generate Link</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Invitation Link</DialogTitle>
                <DialogDescription>
                  Create a new invitation link for candidates to apply
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Job Position</Label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobPositions.length > 0 ? (
                        jobPositions.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-positions" disabled>
                          No active positions found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {jobPositions.length === 0 && (
                    <p className="text-sm text-amber-600 mt-1">
                      You need to create job positions first.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry">Link Expiration</Label>
                  <Select value={expirationPeriod} onValueChange={setExpirationPeriod}>
                    <SelectTrigger id="expiry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateLink} 
                  disabled={isLoading || jobPositions.length === 0}
                >
                  {isLoading ? "Generating..." : "Generate Link"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>What are invitation links?</CardTitle>
          <CardDescription>
            Generate unique links for each job position to share with candidates.
            These links allow candidates to apply directly without registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardIcon className="h-4 w-4" />
              <span>Each link includes your organization ID and job position ID</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2Icon className="h-4 w-4" />
              <span>Share links via email, WhatsApp, or other messaging platforms</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isRefreshing && invitationLinks.length === 0 ? (
        <div className="flex items-center justify-center p-8 border rounded-md">
          <div className="animate-pulse text-muted-foreground">Loading invitation links...</div>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Clicks</TableHead>
                <TableHead className="text-center">Submissions</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitationLinks.length > 0 ? (
                invitationLinks.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <div className="font-medium">{invitation.position}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        Created: {invitation.createdAt}
                      </div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        Expires: {invitation.expiresAt}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{invitation.createdAt}</TableCell>
                    <TableCell className="hidden md:table-cell">{invitation.expiresAt}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(invitation.status)}>
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{invitation.clicks}</TableCell>
                    <TableCell className="text-center">{invitation.submissions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={invitation.link}
                          readOnly
                          className="h-8 text-xs w-[140px] md:w-auto"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(invitation.id, invitation.link)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedLinks[invitation.id] ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No invitation links created yet.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                      Generate your first invitation link
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
