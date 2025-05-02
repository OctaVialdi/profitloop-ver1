
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ITDeveloper() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>IT Developer</CardTitle>
          <CardDescription>
            Developer tools and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to the IT Developer section.</p>
        </CardContent>
      </Card>
    </div>
  );
}
