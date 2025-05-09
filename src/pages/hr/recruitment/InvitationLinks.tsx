
import React from "react";
import InvitationLinksComponent from "@/components/hr/recruitment/InvitationLinks";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function InvitationLinksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Management</CardTitle>
        <CardDescription>
          Manage job openings and candidate applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InvitationLinksComponent />
      </CardContent>
    </Card>
  );
}
