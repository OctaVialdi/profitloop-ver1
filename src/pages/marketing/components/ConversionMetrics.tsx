
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConversionMetrics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Conversion metrics visualization will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionMetrics;
