
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  
  // Limit to a maximum of 6 visible columns (plus name column) to ensure total of 7 
  // Explicitly type the result as an array of keys from EmployeeColumnState
  const limitedVisibleColumnsOrder: Array<keyof EmployeeColumnState> = (() => {
    const maxColumns = 7; // Maximum number of columns to display
    
    // If name is in the visible columns, we need to ensure it's included
    // and we can have up to 6 more columns
    const nameIndex = visibleColumnsOrder.indexOf('name');
    
    if (nameIndex === -1) {
      // If name is not in the visible columns, just take the first maxColumns
      return visibleColumnsOrder.slice(0, maxColumns) as Array<keyof EmployeeColumnState>;
    } else {
      // Remove "name" from the array for now
      const withoutName = [...visibleColumnsOrder];
      withoutName.splice(nameIndex, 1);
      
      // Take the name column plus up to (maxColumns-1) more columns
      return ['name' as keyof EmployeeColumnState, 
        ...withoutName.slice(0, maxColumns - 1) as Array<keyof EmployeeColumnState>];
    }
  })();
  
  // Check if we need horizontal scrolling (more columns exist than are shown)
  const needsHorizontalScroll = visibleColumnsOrder.length > limitedVisibleColumnsOrder.length;

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

  // Calculate width for columns to ensure alignment
  const getColumnWidth = (colKey: keyof EmployeeColumnState) => {
    if (colKey === 'name') return 'w-[220px]';
    if (colKey === 'employeeId') return 'w-[140px]';
    if (colKey === 'email') return 'w-[200px]';
    return 'w-[180px]';
  };

  return (
    <div className="border rounded-md">
      <div className="relative">
        {/* Using a single table structure for better alignment */}
        <ScrollArea className="w-full" type={needsHorizontalScroll ? "always" : "auto"}>
          <div className={needsHorizontalScroll ? "min-w-max" : "w-full"}>
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-background">
                <TableRow>
                  <TableHead className="w-[40px] sticky left-0 z-30 bg-background">
                    <Checkbox />
                  </TableHead>
                  
                  {limitedVisibleColumnsOrder.map((colKey) => {
                    const isNameColumn = colKey === 'name';
                    const columnWidth = getColumnWidth(colKey);
                    return (
                      <TableHead 
                        key={colKey}
                        className={`${isNameColumn ? "sticky left-[40px] z-30 bg-background" : ""} ${columnWidth}`}
                      >
                        {columnLabels[colKey]}
                      </TableHead>
                    );
                  })}
                  
                  <TableHead className="text-right sticky right-0 z-30 bg-background w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="relative">
                {data.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="sticky left-0 z-20 bg-background">
                      <Checkbox />
                    </TableCell>
                    
                    {limitedVisibleColumnsOrder.map((colKey) => {
                      const isNameColumn = colKey === 'name';
                      const columnWidth = getColumnWidth(colKey);
                      return (
                        <TableCell 
                          key={colKey}
                          className={`${isNameColumn ? "sticky left-[40px] z-20 bg-background" : ""} ${columnWidth}`}
                        >
                          {renderCellContent(employee, colKey)}
                        </TableCell>
                      );
                    })}
                    
                    <TableCell className="text-right sticky right-0 z-20 bg-background w-[100px]">
                      <EmployeeActions employeeId={employee.id} employeeName={employee.name} />
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={limitedVisibleColumnsOrder.length + 2} className="text-center py-8">
                      No employee data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {needsHorizontalScroll && <ScrollBar orientation="horizontal" />}
        </ScrollArea>
      </div>
    </div>
  );
};
