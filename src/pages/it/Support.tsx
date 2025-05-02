
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ITSupport() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>IT Support</CardTitle>
          <CardDescription>
            Technical support and issue management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to IT Support.</p>
        </CardContent>
      </Card>
    </div>
  );
}
