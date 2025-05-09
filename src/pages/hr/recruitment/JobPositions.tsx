
import React from "react";
import JobPositionsList from "@/components/hr/recruitment/JobPositionsList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function JobPositionsPage() {
  return (
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
  );
}
