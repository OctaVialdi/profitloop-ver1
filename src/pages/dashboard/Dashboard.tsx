
import React from "react";
import {
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";

const Dashboard = () => {
  const { organization } = useOrganization();

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Home</h1>
        <p className="text-muted-foreground">
          Welcome to {organization?.name || "your organization"}'s dashboard
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>
            This dashboard has been cleared as requested.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Dashboard content was removed as requested.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
