
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Alert,
  AlertDescription 
} from "@/components/ui/card";
import { ClipboardIcon, Share2Icon, AlertTriangleIcon, EyeIcon } from "lucide-react";

export default function InvitationInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What are invitation links?</CardTitle>
        <CardDescription>
          Generate unique links for each job position to share with candidates.
          These links allow candidates to apply directly without registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="warning" className="mb-4">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              Due to a temporary hosting issue, we recommend using the Preview Link option when sharing invitations with candidates.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <EyeIcon className="h-4 w-4" />
              <span><strong>Preview Links:</strong> Recommended option that works around current hosting limitations</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardIcon className="h-4 w-4" />
              <span>Each link includes your organization ID and job position ID</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2Icon className="h-4 w-4" />
              <span>Share links via email, WhatsApp, or other messaging platforms</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
