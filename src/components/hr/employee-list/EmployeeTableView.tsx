
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmployeeActions } from "../EmployeeActions";
import { Employee } from './types';
import { EmployeeColumnState, ColumnOrder } from '../EmployeeColumnManager';

interface EmployeeTableViewProps {
  data: Employee[];
  visibleColumns: EmployeeColumnState;
  columnOrder: ColumnOrder;
}

export const EmployeeTableView: React.FC<EmployeeTableViewProps> = ({ 
  data, 
  visibleColumns, 
  columnOrder 
}) => {
  const navigate = useNavigate();

  // Column label mapping
  const columnLabels: Record<keyof EmployeeColumnState, string> = {
    name: "Employee name",
    employeeId: "Employee ID", 
    email: "Email",
    branch: "Branch",
    organization: "Organization",
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
  
  // Filter the column order to only include visible columns
  const visibleColumnsOrder = columnOrder.filter(col => visibleColumns[col]);

  // Handle click on employee name to navigate to employee detail with new route pattern
  const handleEmployeeClick = (employee: Employee) => {
    navigate(`/my-info/index?id=${employee.id}`);
  };
  
  // Render cell content based on column key
  const renderCellContent = (employee: Employee, columnKey: keyof EmployeeColumnState) => {
    if (columnKey === 'name') {
      return (
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => handleEmployeeClick(employee)}
        >
          <Avatar className="h-8 w-8">
            <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
              {employee.name.charAt(0)}
            </div>
          </Avatar>
          <div className="text-blue-600 hover:underline">{employee.name}</div>
        </div>
      );
    }
    
    // For all other columns, render the value or a dash if not available
    return employee[columnKey as keyof Employee] || '-';
  };

  return (
    <div className="border rounded-md">
      {/* Use a ScrollArea only for the table body, with fixed height */}
      <Table>
        <TableHeader className="sticky top-0 z-20 bg-background">
          <TableRow>
            <TableHead className="w-[40px] sticky left-0 z-30 bg-background">
              <Checkbox />
            </TableHead>
            
            {/* Render table headers in the order specified by columnOrder */}
            {visibleColumnsOrder.map((colKey) => {
              // Special styling for the name column to make it sticky
              const isNameColumn = colKey === 'name';
              return (
                <TableHead 
                  key={colKey}
                  className={isNameColumn ? "sticky left-[40px] z-30 bg-background" : ""}
                >
                  {columnLabels[colKey]}
                </TableHead>
              );
            })}
            
            <TableHead className="text-right sticky right-0 z-30 bg-background">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <ScrollArea className="h-[400px]">
          <ScrollArea orientation="horizontal">
            <TableBody>
              {data.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="sticky left-0 z-20 bg-background">
                    <Checkbox />
                  </TableCell>
                  
                  {/* Render table cells in the order specified by columnOrder */}
                  {visibleColumnsOrder.map((colKey) => {
                    // Special styling for the name column to make it sticky
                    const isNameColumn = colKey === 'name';
                    return (
                      <TableCell 
                        key={colKey}
                        className={isNameColumn ? "sticky left-[40px] z-20 bg-background" : ""}
                      >
                        {renderCellContent(employee, colKey)}
                      </TableCell>
                    );
                  })}
                  
                  <TableCell className="text-right sticky right-0 z-20 bg-background">
                    <EmployeeActions employeeId={employee.id} employeeName={employee.name} />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={visibleColumnsOrder.length + 2} className="text-center py-8">
                    No employee data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </ScrollArea>
      </Table>
    </div>
  );
};
