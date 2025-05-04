
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmployeeList } from "@/components/hr/EmployeeList";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { convertToLegacyFormat, LegacyEmployee, useEmployees } from "@/hooks/useEmployees";

export default function HRDataKaryawan() {
  const { employees, isLoading, addDummyEmployees } = useEmployees();

  // Convert to the format expected by EmployeeList component
  const convertToExpectedFormat = (data: any[]): LegacyEmployee[] => {
    return data.map(emp => convertToLegacyFormat(emp));
  };

  const handleAddDummyEmployees = async () => {
    await addDummyEmployees();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddDummyEmployees} variant="outline">
          Add Dummy Employees
        </Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <EmployeeList data={convertToExpectedFormat(employees)} />
        )}
      </Card>
    </div>
  );
}
