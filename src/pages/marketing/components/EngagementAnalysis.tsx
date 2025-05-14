
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EngagementAnalysis: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Engagement data visualization will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementAnalysis;
