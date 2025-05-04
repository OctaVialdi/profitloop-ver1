
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmployeeList } from "@/components/hr/EmployeeList";
import { employeeService, EmployeeWithDetails } from "@/services/employeeService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const convertToExpectedFormat = (data: EmployeeWithDetails[]) => {
    return data.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      employeeId: emp.employee_id,
      organization: emp.employment?.organization,
      jobPosition: emp.employment?.job_position,
      jobLevel: emp.employment?.job_level,
      employmentStatus: emp.employment?.employment_status,
      branch: emp.employment?.branch,
      joinDate: emp.employment?.join_date,
      signDate: emp.employment?.sign_date,
      barcode: emp.employment?.barcode,
      birthDate: emp.personalDetails?.birth_date,
      birthPlace: emp.personalDetails?.birth_place,
      address: emp.identityAddress?.residential_address,
      mobilePhone: emp.personalDetails?.mobile_phone,
      religion: emp.personalDetails?.religion,
      gender: emp.personalDetails?.gender,
      maritalStatus: emp.personalDetails?.marital_status,
      status: emp.status,
      role: emp.role
    }));
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
