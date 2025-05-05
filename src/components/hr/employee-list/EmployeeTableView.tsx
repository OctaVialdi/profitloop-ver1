
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmployeeActions } from "../EmployeeActions";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { EmployeeColumnState, ColumnOrder } from '../EmployeeColumnManager';

interface EmployeeTableViewProps {
  data: LegacyEmployee[];
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
  
  // Important: We need exactly 5 data columns (plus checkbox and actions columns) for a total of 7
  const limitedVisibleColumnsOrder: Array<keyof EmployeeColumnState> = (() => {
    const maxDataColumns = 5; // Maximum number of data columns to display
    
    // If name is in the visible columns, we need to ensure it's included
    const nameIndex = visibleColumnsOrder.indexOf('name');
    
    if (nameIndex === -1) {
      // If name is not in the visible columns, just take the first 5
      return visibleColumnsOrder.slice(0, maxDataColumns) as Array<keyof EmployeeColumnState>;
    } else {
      // Remove "name" from the array for now
      const withoutName = [...visibleColumnsOrder];
      withoutName.splice(nameIndex, 1);
      
      // Take the name column plus up to (maxDataColumns-1) more columns
      return ['name' as keyof EmployeeColumnState, 
        ...withoutName.slice(0, maxDataColumns - 1) as Array<keyof EmployeeColumnState>];
    }
  })();
  
  // Check if we need horizontal scrolling (more columns exist than are shown)
  const needsHorizontalScroll = visibleColumnsOrder.length > limitedVisibleColumnsOrder.length;

  // Handle click on employee name to navigate to employee detail with new route pattern
  const handleEmployeeClick = (employee: LegacyEmployee) => {
    navigate(`/my-info/personal?id=${employee.id}`);
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };
  
  // Render cell content based on column key
  const renderCellContent = (employee: LegacyEmployee, columnKey: keyof EmployeeColumnState) => {
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
    
    // Special handling for date fields
    if (columnKey === 'birthDate' || columnKey === 'joinDate' || columnKey === 'signDate') {
      return formatDate(employee[columnKey]);
    }
    
    // For all other columns, render the value or a dash if not available
    return employee[columnKey as keyof LegacyEmployee] || '-';
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
              <TableHeader className="sticky top-0 z-20 bg-white">
                <TableRow>
                  <TableHead className="w-[40px] sticky left-0 z-30 bg-white">
                    <Checkbox />
                  </TableHead>
                  
                  {limitedVisibleColumnsOrder.map((colKey) => {
                    const isNameColumn = colKey === 'name';
                    const columnWidth = getColumnWidth(colKey);
                    return (
                      <TableHead 
                        key={colKey}
                        className={`${isNameColumn ? "sticky left-[40px] z-30 bg-white" : ""} ${columnWidth}`}
                      >
                        {columnLabels[colKey]}
                      </TableHead>
                    );
                  })}
                  
                  <TableHead className="text-right sticky right-0 z-30 bg-white w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="relative">
                {data.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="sticky left-0 z-20 bg-white">
                      <Checkbox />
                    </TableCell>
                    
                    {limitedVisibleColumnsOrder.map((colKey) => {
                      const isNameColumn = colKey === 'name';
                      const columnWidth = getColumnWidth(colKey);
                      return (
                        <TableCell 
                          key={colKey}
                          className={`${isNameColumn ? "sticky left-[40px] z-20 bg-white" : ""} ${columnWidth}`}
                        >
                          {renderCellContent(employee, colKey)}
                        </TableCell>
                      );
                    })}
                    
                    <TableCell className="text-right sticky right-0 z-20 bg-white w-[100px]">
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
