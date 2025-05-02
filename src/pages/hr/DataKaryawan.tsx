
import React from "react";
import { Card } from "@/components/ui/card";
import { EmployeeList } from "@/components/hr/EmployeeList";
import { useEmployees } from "@/hooks/useEmployees";

export default function HRDataKaryawan() {
  const { employees, isLoading } = useEmployees();

  return (
    <div className="space-y-4">
      <Card className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <p>Loading employee data...</p>
          </div>
        ) : (
          <EmployeeList data={employees} />
        )}
      </Card>
    </div>
  );
}
