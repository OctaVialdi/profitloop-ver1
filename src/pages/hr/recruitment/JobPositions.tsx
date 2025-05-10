
import React from "react";
import JobPositionsList from "@/components/hr/recruitment/JobPositionsList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TrialProtection from "@/components/TrialProtection";

export default function JobPositionsPage() {
  return (
    <TrialProtection requiredSubscription={true}>
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Management</CardTitle>
          <CardDescription>
            Manage job openings and candidate applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobPositionsList />
        </CardContent>
      </Card>
    </TrialProtection>
  );
}
