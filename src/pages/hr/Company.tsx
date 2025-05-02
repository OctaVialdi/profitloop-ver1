
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRCompany() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
          <CardDescription>
            Company structure and organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Company organization section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
