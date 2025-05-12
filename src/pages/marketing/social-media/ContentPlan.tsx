
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentPlan = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Content Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          This page will display content planning information, schedules, and upcoming content releases.
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPlan;
