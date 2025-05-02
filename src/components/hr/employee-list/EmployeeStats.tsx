
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface PeriodStats {
  period: string;
  totalEmployees: number;
  newHires: number;
  leaving: number;
}

interface EmployeeStatsProps {
  periodStats: PeriodStats;
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({ periodStats }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-4 divide-x text-sm">
          <div className="p-4">
            <div className="text-gray-500">Overview of period</div>
            <div className="font-medium mt-1">{periodStats.period}</div>
          </div>
          <div className="p-4">
            <div className="text-gray-500">Total employees</div>
            <div className="font-medium mt-1">{periodStats.totalEmployees}</div>
          </div>
          <div className="p-4">
            <div className="text-gray-500">New hire</div>
            <div className="font-medium mt-1">{periodStats.newHires}</div>
          </div>
          <div className="p-4">
            <div className="text-gray-500">Leaving</div>
            <div className="font-medium mt-1">{periodStats.leaving}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
