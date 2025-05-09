
import React from "react";
import { HRDashboardHeader } from "@/components/hr/dashboard/HRDashboardHeader";
import { HRMetricsGrid } from "@/components/hr/dashboard/HRMetricsGrid";
import { HRDashboardCharts } from "@/components/hr/dashboard/HRDashboardCharts";
import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Users } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { calculateHRMetrics } from "@/utils/hrDashboardUtils";

export default function HRDashboard() {
  const { employees, isLoading, error, refetch } = useEmployees();
  const { organization } = useOrganization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6"></div>
          <p className="text-muted-foreground font-medium">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <RefreshCw className="h-8 w-8" />
            </div>
            <p className="text-destructive text-lg font-medium mb-2">Failed to load employee data</p>
            <p className="text-muted-foreground mb-6">{error instanceof Error ? error.message : "Unknown error occurred"}</p>
            <Button onClick={() => refetch()} variant="outline" size="lg" className="font-medium">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = calculateHRMetrics(employees);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              HR Dashboard
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              {organization?.name ? `${organization.name}'s` : "Your"} HR metrics and employee statistics. Monitor workforce performance and plan effectively.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-muted/50 transition-colors" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <HRMetricsGrid employees={employees} />

      {/* HR Analytics Charts */}
      <div className="rounded-xl border bg-card overflow-hidden shadow transition-shadow hover:shadow-md">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              HR Analytics
            </h2>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <span className="text-sm text-muted-foreground">Total Employees: </span>
              <span className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full text-xs font-medium">
                <Users className="h-3.5 w-3.5 mr-1" />
                {metrics.totalEmployees}
              </span>
            </div>
          </div>
          <HRDashboardCharts employees={employees} />
        </div>
      </div>
    </div>
  );
}
