
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRKontrak() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Kontrak</CardTitle>
          <CardDescription>
            Employee contracts and agreements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contract management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
