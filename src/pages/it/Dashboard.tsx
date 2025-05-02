
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ITDashboard() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>IT Dashboard</CardTitle>
          <CardDescription>
            Overview of IT systems and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to the IT Dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
