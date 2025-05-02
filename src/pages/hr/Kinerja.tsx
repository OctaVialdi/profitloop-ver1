
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRKinerja() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Kinerja</CardTitle>
          <CardDescription>
            Performance evaluation and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Performance management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
