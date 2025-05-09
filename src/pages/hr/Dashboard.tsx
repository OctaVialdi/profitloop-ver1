
import React from "react";
import { HRDashboardHeader } from "@/components/hr/dashboard/HRDashboardHeader";
import { HRMetricsGrid } from "@/components/hr/dashboard/HRMetricsGrid";
import { HRDashboardCharts } from "@/components/hr/dashboard/HRDashboardCharts";
import { useEmployees } from "@/hooks/useEmployees";

export default function HRDashboard() {
  const { employees, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HRDashboardHeader />
      <HRMetricsGrid employees={employees} />
      <HRDashboardCharts employees={employees} />
    </div>
  );
}
