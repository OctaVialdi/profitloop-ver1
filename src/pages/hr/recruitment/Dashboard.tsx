
import React from "react";
import RecruitmentDashboard from "@/components/hr/recruitment/RecruitmentDashboard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RecruitmentDashboardPage() {
  return (
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
  );
}
