
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRDashboard() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>HR Dashboard</CardTitle>
          <CardDescription>
            Human Resources management overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to the Human Resources Dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
