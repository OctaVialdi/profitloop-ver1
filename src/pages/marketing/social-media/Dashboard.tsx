
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SocialMediaDashboard = () => {
  return (
    <Card className="w-full">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Dashboard Content</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">
          This section displays dashboard content for social media management.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-medium text-sm mb-2">Content Performance</h3>
            <p className="text-xs text-gray-600">Overview of all content performance metrics</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-medium text-sm mb-2">Engagement Metrics</h3>
            <p className="text-xs text-gray-600">Tracking audience engagement across platforms</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-medium text-sm mb-2">Content Calendar</h3>
            <p className="text-xs text-gray-600">Upcoming content schedule and deadlines</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaDashboard;
