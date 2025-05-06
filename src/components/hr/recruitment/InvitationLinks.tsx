
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { PlusIcon, Search, Copy, MoreHorizontal, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function InvitationLinks() {
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newLink, setNewLink] = useState({
    job_position_id: "",
    status: "active",
    expires_at: null,
    notes: "",
    is_general_application: false
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  async function fetchData() {
    try {
      setIsLoading(true);
      // Fetch active job positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('job_positions')
        .select('id, title')
        .eq('status', 'active');
        
      if (positionsError) throw positionsError;
      
      // Fetch recruitment links with position details
      const { data: linksData, error: linksError } = await supabase
        .from('recruitment_links')
        .select(`
          id, 
          token,
          created_at,
          expires_at,
          status,
          notes,
          job_positions (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });
        
      if (linksError) throw linksError;
      
      setPositions(positionsData || []);
      setLinks(linksData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleCreateLink() {
    try {
      // Validate that we have a job position or general application flag
      if (!newLink.job_position_id && !newLink.is_general_application) {
        toast.error("Please select a position or enable general application");
        return;
      }
      
      // Generate a random token for the link
      const token = generateToken();
      
      // Need to get the organization_id
      const { data: profileData } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', profileData.user?.id)
        .single();
        
      if (!userData?.organization_id) {
        toast.error("Could not determine your organization");
        return;
      }
      
      // Insert new recruitment link
      const { error } = await supabase
        .from('recruitment_links')
        .insert({
          token,
          job_position_id: newLink.is_general_application ? null : newLink.job_position_id || null,
          status: newLink.status,
          expires_at: newLink.expires_at,
          organization_id: userData.organization_id
        });
        
      if (error) throw error;
      
      toast.success("Recruitment link created successfully");
      setShowCreateDialog(false);
      setNewLink({
        job_position_id: "",
        status: "active",
        expires_at: null,
        notes: "",
        is_general_application: false
      });
      fetchData();
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error("Failed to create recruitment link");
    }
  }
  
  function generateToken() {
    // Generate a random token for the recruitment link
    return 'rl_' + Math.random().toString(36).substr(2, 9);
  }
  
  function getApplicationUrl(token: string) {
    // Generate the application URL based on the token
    return `${window.location.origin}/apply/${token}`;
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      function() {
        toast.success("Link copied to clipboard");
      },
      function() {
        toast.error("Failed to copy link");
      }
    );
  };
  
  const toggleLinkStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('recruitment_links')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Link ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch (error) {
      console.error("Error toggling link status:", error);
      toast.error("Failed to update link status");
    }
  };
  
  const filteredLinks = links.filter(link => {
    if (!searchQuery) return true;
    
    const positionTitle = link.job_positions?.title || 'General Application';
    return positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (link.notes && link.notes.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusIcon className="h-4 w-4 mr-2" /> Create Link
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : filteredLinks.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="pt-6 text-center">
            <p>No recruitment links found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLinks.map((link) => {
            const applicationUrl = getApplicationUrl(link.token);
            return (
              <Card key={link.id} className={link.status === 'active' ? "" : "opacity-75"}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {link.job_positions?.title || "General Application"}
                      </CardTitle>
                      <CardDescription>
                        Created: {new Date(link.created_at).toLocaleDateString()}
                        {link.expires_at && ` • Expires: ${new Date(link.expires_at).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        link.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {link.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <Input
                        value={applicationUrl}
                        readOnly
                        className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(applicationUrl)}
                        className="shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(applicationUrl, '_blank')}
                        className="shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {link.notes && (
                      <div className="text-sm text-muted-foreground">
                        {link.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLinkStatus(link.id, link.status === 'active')}
                    >
                      {link.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyToClipboard(applicationUrl)}>
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(applicationUrl, '_blank')}>
                          Open Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleLinkStatus(link.id, link.status === 'active')}>
                          {link.status === 'active' ? 'Deactivate' : 'Activate'} Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Recruitment Link</DialogTitle>
            <DialogDescription>
              Generate a new link for candidates to apply for a job position.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="generalApp" 
                checked={newLink.is_general_application}
                onCheckedChange={(checked) => {
                  setNewLink({
                    ...newLink,
                    is_general_application: checked,
                    job_position_id: checked ? "" : newLink.job_position_id
                  });
                }}
              />
              <Label htmlFor="generalApp">General Application (No Specific Position)</Label>
            </div>
            
            {!newLink.is_general_application && (
              <div className="space-y-2">
                <Label htmlFor="position">Job Position</Label>
                <Select
                  value={newLink.job_position_id}
                  onValueChange={(value) => setNewLink({...newLink, job_position_id: value})}
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.length > 0 ? (
                      positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-positions-available" disabled>
                        No positions available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                value={newLink.notes} 
                onChange={(e) => setNewLink({...newLink, notes: e.target.value})}
                placeholder="Additional information or notes"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={newLink.status === 'active'}
                onCheckedChange={(checked) => setNewLink({...newLink, status: checked ? 'active' : 'inactive'})}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateLink}>Create Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
