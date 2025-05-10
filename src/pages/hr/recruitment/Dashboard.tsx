
import React from "react";
import RecruitmentDashboard from "@/components/hr/recruitment/RecruitmentDashboard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TrialProtection from "@/components/TrialProtection";

export default function RecruitmentDashboardPage() {
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
          <RecruitmentDashboard />
        </CardContent>
      </Card>
    </TrialProtection>
  );
}
