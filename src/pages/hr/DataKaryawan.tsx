
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmployeeList } from "@/components/hr/EmployeeList";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { convertToLegacyFormat, LegacyEmployee, useEmployees } from "@/hooks/useEmployees";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { employeeService } from "@/services/employeeService";

export default function HRDataKaryawan() {
  const { employees, isLoading, addDummyEmployees } = useEmployees();
  const [isDummyLoading, setIsDummyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert to the format expected by EmployeeList component
  const convertToExpectedFormat = (data: any[]): LegacyEmployee[] => {
    const convertedData = data.map(emp => convertToLegacyFormat(emp));
    
    // Ensure each employee has a valid employee_id saved to the database
    convertedData.forEach(async (emp) => {
      if (!emp.employee_id && !emp.employeeId) {
        // Generate a new employee ID with EMP- prefix
        const newId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Update the local object
        emp.employee_id = newId;
        emp.employeeId = newId;
        
        // Save to database
        await employeeService.updateEmployee(emp.id, {
          employee_id: newId
        });
      }
      
      // Make sure organization is set (even if it's empty)
      if (emp.organization === undefined) {
        emp.organization = '';
      }
    });
    
    return convertedData;
  };

  const handleAddDummyEmployees = async () => {
    setError(null);
    setIsDummyLoading(true);
    try {
      await addDummyEmployees();
      toast.success("Dummy employees added successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add dummy employees";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDummyLoading(false);
    }
  };

  // Add dummy employees automatically if none exist
  useEffect(() => {
    if (!isLoading && employees.length === 0) {
      handleAddDummyEmployees();
    }
  }, [isLoading, employees.length]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          {error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Button 
          onClick={handleAddDummyEmployees} 
          variant="outline" 
          disabled={isDummyLoading}
        >
          {isDummyLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Dummy Employees...
            </>
          ) : "Add Dummy Employees"}
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
