
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
  const visibleColumnsOrder: Array<keyof EmployeeColumnState> = columnOrder.filter(col => visibleColumns[col]);
  
  // Always ensure 'name' is included if it's visible
  if (visibleColumns['name'] && !visibleColumnsOrder.includes('name')) {
    visibleColumnsOrder.unshift('name');
  }
  
  // Check if we need horizontal scrolling (we always want to enable it when there are many columns)
  const needsHorizontalScroll = true; // Always enable horizontal scrolling

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
    if (colKey === 'name') return 'min-w-[220px]';
    if (colKey === 'employeeId') return 'min-w-[140px]';
    if (colKey === 'email') return 'min-w-[200px]';
    return 'min-w-[180px]';
  };

  return (
    <div className="border rounded-md">
      <div className="relative">
        <ScrollArea className="w-full" type="always">
          <div className="min-w-max">
            <Table>
              <TableHeader className="sticky top-0 z-20 bg-background">
                <TableRow>
                  <TableHead className="w-[40px] sticky left-0 z-30 bg-background">
                    <Checkbox />
                  </TableHead>
                  
                  {/* Name column always sticky if included */}
                  {visibleColumns['name'] && (
                    <TableHead 
                      className="sticky left-[40px] z-30 bg-background min-w-[220px]"
                    >
                      {columnLabels['name']}
                    </TableHead>
                  )}
                  
                  {/* All other visible columns */}
                  {visibleColumnsOrder
                    .filter(colKey => colKey !== 'name') // Skip name as we handled it separately
                    .map((colKey) => (
                      <TableHead 
                        key={colKey}
                        className={`${getColumnWidth(colKey)}`}
                      >
                        {columnLabels[colKey]}
                      </TableHead>
                    ))
                  }
                  
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
                    
                    {/* Name column always sticky if included */}
                    {visibleColumns['name'] && (
                      <TableCell 
                        className="sticky left-[40px] z-20 bg-background min-w-[220px]"
                      >
                        {renderCellContent(employee, 'name')}
                      </TableCell>
                    )}
                    
                    {/* All other visible columns */}
                    {visibleColumnsOrder
                      .filter(colKey => colKey !== 'name') // Skip name as we handled it separately
                      .map((colKey) => (
                        <TableCell 
                          key={colKey}
                          className={`${getColumnWidth(colKey)}`}
                        >
                          {renderCellContent(employee, colKey)}
                        </TableCell>
                      ))
                    }
                    
                    <TableCell className="text-right sticky right-0 z-20 bg-background w-[100px]">
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
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};
