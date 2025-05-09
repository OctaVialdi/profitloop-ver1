
import React from "react";
import EvaluationSettingsTab from "@/components/hr/recruitment/EvaluationSettingsTab";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function EvaluationSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Management</CardTitle>
        <CardDescription>
          Manage job openings and candidate applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EvaluationSettingsTab />
      </CardContent>
    </Card>
  );
}
