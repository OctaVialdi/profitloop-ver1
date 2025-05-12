
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useContentManagement } from "@/hooks/useContentManagement";
import { useEmployees } from "@/hooks/useEmployees";

const TeamMembersTab = () => {
  const { employees } = useEmployees();
  
  // Filter for Digital Marketing employees, especially Content Planners
  const marketingEmployees = employees.filter(
    emp => emp.organization === "Digital Marketing"
  );
  
  const contentPlanners = marketingEmployees.filter(
    emp => emp.jobPosition === "Content Planner"
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Marketing Team Members</h2>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketingEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No marketing team members found.
                </TableCell>
              </TableRow>
            ) : (
              marketingEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.fullName || `${employee.firstName} ${employee.lastName}`.trim()}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.jobPosition || "Not specified"}</TableCell>
                  <TableCell>
                    {employee.jobPosition === "Content Planner" && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">
                        Content Planner
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-8 space-y-4">
        <h3 className="text-md font-medium">Content Planners</h3>
        <p className="text-muted-foreground text-sm">
          These employees will appear as options in the "PIC" dropdown in the Content Bank.
        </p>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentPlanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                    No Content Planners found. Assign "Content Planner" as a job position to employees in the Digital Marketing organization.
                  </TableCell>
                </TableRow>
              ) : (
                contentPlanners.map((planner) => (
                  <TableRow key={planner.id}>
                    <TableCell className="font-medium">
                      {planner.fullName || `${planner.firstName} ${planner.lastName}`.trim()}
                    </TableCell>
                    <TableCell>{planner.email}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersTab;
