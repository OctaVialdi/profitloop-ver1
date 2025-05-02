
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HROKR() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Objectives & Key Results</CardTitle>
          <CardDescription>
            Manage company and employee OKRs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>OKR management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
