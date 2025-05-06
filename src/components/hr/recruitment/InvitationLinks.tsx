
import React, { useState } from "react";
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
import { ClipboardIcon, LinkIcon, PlusIcon, Share2Icon, CopyIcon, CheckCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});
  
  // Mock data - would be replaced with actual API calls
  const invitationLinks: InvitationLink[] = [
    {
      id: "1",
      position: "Frontend Developer",
      link: "https://appdomain.com/apply?org=123&job=456",
      createdAt: "2023-05-01",
      expiresAt: "2023-06-01",
      clicks: 24,
      submissions: 12,
      status: 'active'
    },
    {
      id: "2",
      position: "UX Designer",
      link: "https://appdomain.com/apply?org=123&job=457",
      createdAt: "2023-05-02",
      expiresAt: "2023-06-02",
      clicks: 18,
      submissions: 8,
      status: 'active'
    },
    {
      id: "3",
      position: "Backend Developer",
      link: "https://appdomain.com/apply?org=123&job=458",
      createdAt: "2023-04-15",
      expiresAt: "2023-05-15",
      clicks: 30,
      submissions: 15,
      status: 'expired'
    },
    {
      id: "4",
      position: "Product Manager",
      link: "https://appdomain.com/apply?org=123&job=459",
      createdAt: "2023-04-25",
      expiresAt: "2023-05-25",
      clicks: 10,
      submissions: 3,
      status: 'disabled'
    }
  ];

  // Mock job positions for the dropdown
  const jobPositions = [
    { id: "456", title: "Frontend Developer" },
    { id: "457", title: "UX Designer" },
    { id: "458", title: "Backend Developer" },
    { id: "459", title: "Product Manager" },
    { id: "460", title: "Marketing Specialist" }
  ];

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

  const handleGenerateLink = () => {
    if (!selectedPosition) {
      toast.error("Please select a position");
      return;
    }
    
    // Here you would call your API to generate a new link
    toast.success("New invitation link generated");
    setIsDialogOpen(false);
    setSelectedPosition("");
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
                    {jobPositions.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Link Expiration</Label>
                <Select defaultValue="30">
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
              <Button onClick={handleGenerateLink}>
                Generate Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            {invitationLinks.map((invitation) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
