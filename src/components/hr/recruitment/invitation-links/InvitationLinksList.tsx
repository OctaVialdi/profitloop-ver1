
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckCircleIcon, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { InvitationLink } from "./types";

interface InvitationLinksListProps {
  invitationLinks: InvitationLink[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onGenerateLink: () => void;
}

export default function InvitationLinksList({
  invitationLinks,
  isRefreshing,
  onRefresh,
  onGenerateLink
}: InvitationLinksListProps) {
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});
  
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

  if (isRefreshing && invitationLinks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <div className="animate-pulse text-muted-foreground">Loading invitation links...</div>
      </div>
    );
  }

  return (
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
                <Button variant="outline" className="mt-4" onClick={onGenerateLink}>
                  Generate your first invitation link
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
