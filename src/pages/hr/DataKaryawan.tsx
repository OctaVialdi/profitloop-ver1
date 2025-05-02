
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HRDataKaryawan() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Karyawan</CardTitle>
          <CardDescription>
            Employee database and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Employee data management section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
