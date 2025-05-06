
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CopyIcon, 
  CheckCircleIcon, 
  RotateCw, 
  EyeIcon,
  AlertTriangleIcon,
  ClipboardIcon 
} from "lucide-react";
import { toast } from "sonner";
import { InvitationLink } from "./types";
import { Card, CardContent } from "@/components/ui/card";

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
  const [activeLinkType, setActiveLinkType] = useState<'preview' | 'direct'>('preview');
  
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
    <div className="space-y-4">
      {invitationLinks.length > 0 && (
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 text-amber-700">
              <AlertTriangleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Temporary Notice:</strong> Due to hosting issues, direct application links may result in 404 errors. 
                We recommend using the Preview Links for now, which will allow candidates to view the position details before applying.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {invitationLinks.length > 0 && (
        <Tabs defaultValue="preview" value={activeLinkType} onValueChange={(v) => setActiveLinkType(v as 'preview' | 'direct')}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" /> 
              <span>Preview Links <Badge className="ml-1 bg-green-100 text-green-800">Recommended</Badge></span>
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <ClipboardIcon className="h-4 w-4" /> 
              <span>Direct Links <Badge className="ml-1 bg-amber-100 text-amber-800">May not work</Badge></span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="rounded-md border overflow-hidden mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="hidden md:table-cell">Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Clicks</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead>Preview Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody(invitationLinks, 'preview')}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="direct" className="rounded-md border overflow-hidden mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="hidden md:table-cell">Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Clicks</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead>Direct Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody(invitationLinks, 'direct')}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      )}

      {invitationLinks.length === 0 && (
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
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No invitation links created yet.</p>
                  <Button variant="outline" className="mt-4" onClick={onGenerateLink}>
                    Generate your first invitation link
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  function renderTableBody(invitationLinks: InvitationLink[], type: 'preview' | 'direct') {
    return invitationLinks.map((invitation) => (
      <TableRow key={`${invitation.id}-${type}`}>
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
              value={type === 'preview' ? invitation.previewLink : invitation.link}
              readOnly
              className="h-8 text-xs w-[140px] md:w-auto"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyLink(
                `${invitation.id}-${type}`, 
                type === 'preview' ? invitation.previewLink || '' : invitation.link
              )}
              className="h-8 w-8 p-0"
            >
              {copiedLinks[`${invitation.id}-${type}`] ? (
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  }
}
