
import React from "react";
import { BSCDashboard } from "@/components/dashboard/BSCDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";

const Dashboard = () => {
  const { organization } = useOrganization();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to {organization?.name || "your organization"}'s performance dashboard
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-[#f0f9ff] to-[#e6f2ff] dark:from-[#1a2e3f] dark:to-[#152939] border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            <CardDescription>Manage your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="text-sm font-medium">Reports</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="text-sm font-medium">Analytics</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="text-sm font-medium">Settings</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <span className="text-sm font-medium">Help</span>
              </button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#f1f5fd] to-[#e8effc] dark:from-[#1c2c4c] dark:to-[#162544] border-none shadow-md col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">System Status</CardTitle>
            <CardDescription>Current system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-2xl font-semibold">99.9%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="text-2xl font-semibold">124ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-2xl font-semibold">237</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-1">
          <BSCDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
