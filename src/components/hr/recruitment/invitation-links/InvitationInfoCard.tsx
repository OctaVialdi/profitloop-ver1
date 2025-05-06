
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { ClipboardIcon, Share2Icon } from "lucide-react";

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
  );
}
