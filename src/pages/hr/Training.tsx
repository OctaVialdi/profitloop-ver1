
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRTraining() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Training</CardTitle>
          <CardDescription>
            Employee training and development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Training management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
