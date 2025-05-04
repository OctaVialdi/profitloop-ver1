
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmployeeList } from "@/components/hr/EmployeeList";
import { employeeService, EmployeeWithDetails } from "@/services/employeeService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { convertToLegacyFormat, LegacyEmployee } from "@/hooks/useEmployees";

export default function HRDataKaryawan() {
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const data = await employeeService.fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Convert to the format expected by EmployeeList component
  const convertToExpectedFormat = (data: EmployeeWithDetails[]): LegacyEmployee[] => {
    return data.map(emp => convertToLegacyFormat(emp));
  };

  return (
    <div className="space-y-4">
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
