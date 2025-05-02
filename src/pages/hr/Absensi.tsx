
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRAbsensi() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Absensi</CardTitle>
          <CardDescription>
            Daily attendance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Attendance management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
