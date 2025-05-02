
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRCutiIzin() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cuti & Izin</CardTitle>
          <CardDescription>
            Leave and permission management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Leave and permission requests section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
