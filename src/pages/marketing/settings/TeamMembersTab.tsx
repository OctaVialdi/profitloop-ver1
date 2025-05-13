
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useFilteredEmployees } from "@/hooks/useFilteredEmployees";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TeamMembersTab() {
  const { toast } = useToast();
  const { employees: digitalMarketingEmployees, isLoading: isLoadingEmployees } = useFilteredEmployees("Digital Marketing");

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-6">Digital Marketing Employees</h3>
          
          {isLoadingEmployees ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2">Loading employees...</span>
            </div>
          ) : digitalMarketingEmployees.length === 0 ? (
            <p className="text-sm text-muted-foreground">No Digital Marketing employees found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Job Position</TableHead>
                  <TableHead>Job Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {digitalMarketingEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.organization_name}</TableCell>
                    <TableCell>{employee.job_position}</TableCell>
                    <TableCell>{employee.job_level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
