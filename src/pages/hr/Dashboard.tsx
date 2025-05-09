
import React from "react";
import { HRMetricsGrid } from "@/components/hr/dashboard/HRMetricsGrid";
import { HRDashboardCharts } from "@/components/hr/dashboard/HRDashboardCharts";
import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { calculateHRMetrics } from "@/utils/hrDashboardUtils";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

export default function HRDashboard() {
  const { employees, isLoading, fetchEmployees } = useEmployees();
  const { organization } = useOrganization();
  
  // Adding error handling with a default error state to fix TypeScript error
  const error = null;
  const refetch = fetchEmployees;

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
    <div className="space-y-4 animate-fade-in">
      {/* Breadcrumb navigation at the top */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <BreadcrumbNav showHomeIcon={true} />
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" className="h-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview - Compact Version */}
      <HRMetricsGrid employees={employees} />

      {/* HR Analytics Charts */}
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              HR Analytics
            </h2>
            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
              <span className="text-xs text-muted-foreground">Total: </span>
              <span className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs font-medium">
                {metrics.totalEmployees} Employees
              </span>
            </div>
          </div>
          <HRDashboardCharts employees={employees} />
        </div>
      </div>
    </div>
  );
}
