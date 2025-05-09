
import React from "react";
import CandidateList from "@/components/hr/recruitment/CandidateList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TrialProtection from "@/components/TrialProtection";

export default function CandidatesPage() {
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
          <CandidateList />
        </CardContent>
      </Card>
    </TrialProtection>
  );
}
