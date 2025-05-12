
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentPlan = () => {
  return (
    <Card className="w-full">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Content Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px] flex items-center justify-center text-gray-400">
          <p>Content Plan page</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPlan;
