
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RoiAnalysis: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">ROI analysis visualization will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiAnalysis;
