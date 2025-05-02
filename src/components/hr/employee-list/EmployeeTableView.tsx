
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { EmployeeActions } from "../EmployeeActions";
import { Employee, ColumnKey } from './types';
import { EmployeeColumnState } from '../EmployeeColumnManager';

interface EmployeeTableViewProps {
  data: Employee[];
  visibleColumns: EmployeeColumnState;
  columnOrder: ColumnKey[];
}

export const EmployeeTableView: React.FC<EmployeeTableViewProps> = ({ 
  data, 
  visibleColumns, 
  columnOrder 
}) => {
  // Helper function to render the cell content based on column key
  const renderCell = (employee: Employee, columnKey: ColumnKey) => {
    if (columnKey === 'name') {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
              {employee.name.charAt(0)}
            </div>
          </Avatar>
          <div>{employee.name}</div>
        </div>
      );
    }
    
    return employee[columnKey] || '-';
  };

  // Get column labels for headers
  const getColumnLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      name: "Employee name",
      email: "Email",
      branch: "Branch",
      parentBranch: "Parent branch",
      organization: "Organization",
      sbu: "SBU",
      jobPosition: "Job position",
      jobLevel: "Job level",
      employmentStatus: "Employment status",
      joinDate: "Join date",
      endDate: "End date",
      signDate: "Sign date",
      resignDate: "Resign date",
      barcode: "Barcode",
      birthDate: "Birth date",
      birthPlace: "Birth place",
      address: "Address",
      mobilePhone: "Mobile phone",
      religion: "Religion",
      gender: "Gender",
      maritalStatus: "Marital status"
    };
    
    return labelMap[key] || key;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="w-full overflow-auto" style={{ maxHeight: "500px" }}>
        <div className="min-w-max">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-background">
              <TableRow>
                <TableHead className="w-[40px] sticky left-0 z-30 bg-background">
                  <Checkbox />
                </TableHead>
                {/* Render the name column first if visible, as it should always be sticky */}
                {visibleColumns.name && (
                  <TableHead className="sticky left-[40px] z-30 bg-background">
                    {getColumnLabel('name')}
                  </TableHead>
                )}
                {/* Then render the rest of the columns in the user-defined order */}
                {columnOrder
                  .filter(key => key !== 'name' && visibleColumns[key]) // Skip name as it's handled above
                  .map(key => (
                    <TableHead key={key}>{getColumnLabel(key)}</TableHead>
                  ))}
                <TableHead className="text-right sticky right-0 z-30 bg-background">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="sticky left-0 z-20 bg-background">
                    <Checkbox />
                  </TableCell>
                  {/* Always render name column first if visible */}
                  {visibleColumns.name && (
                    <TableCell className="sticky left-[40px] z-20 bg-background">
                      {renderCell(employee, 'name')}
                    </TableCell>
                  )}
                  {/* Then render the rest of the columns in the user-defined order */}
                  {columnOrder
                    .filter(key => key !== 'name' && visibleColumns[key])
                    .map(key => (
                      <TableCell key={key}>{renderCell(employee, key)}</TableCell>
                    ))}
                  <TableCell className="text-right sticky right-0 z-20 bg-background">
                    <EmployeeActions employeeId={employee.id} employeeName={employee.name} />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length + 2} className="text-center py-8">
                    No employee data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
