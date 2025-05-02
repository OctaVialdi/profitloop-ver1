
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRPayroll() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payroll</CardTitle>
          <CardDescription>
            Salary and compensation management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Payroll management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
