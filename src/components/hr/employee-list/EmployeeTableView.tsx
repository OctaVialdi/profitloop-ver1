
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
  
  // Define default columns to be displayed if none are selected
  const defaultColumns: (keyof EmployeeColumnState)[] = [
    'name',
    'employeeId', 
    'organization',
    'jobPosition',
    'jobLevel',
    'employmentStatus'
  ];
  
  // Filter the column order to only include visible columns
  // If no columns are visible from the order, use the default columns
  const visibleColumnsOrder = columnOrder
    .filter(col => visibleColumns[col])
    .length > 0 
      ? columnOrder.filter(col => visibleColumns[col]) 
      : defaultColumns.filter(col => true);
  
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
    
    // Special handling for employeeId field - use stored employee_id
    if (columnKey === 'employeeId') {
      return employee.employee_id || employee.employeeId || '-';
    }
    
    // Special handling for date fields
    if (columnKey === 'birthDate' || columnKey === 'joinDate' || columnKey === 'signDate') {
      return formatDate(employee[columnKey]);
    }
    
    // For all other columns, render the value or a dash if not available
    return employee[columnKey as keyof LegacyEmployee] || '-';
  };

  // Calculate width for columns to ensure appropriate spacing
  const getColumnWidth = (colKey: keyof EmployeeColumnState) => {
    switch(colKey) {
      case 'name': return 'w-[200px]';
      case 'employeeId': return 'w-[120px]';
      case 'organization': return 'w-[150px]';
      case 'jobPosition': return 'w-[150px]';
      case 'jobLevel': return 'w-[120px]';
      case 'employmentStatus': return 'w-[150px]';
      case 'email': return 'w-[200px]';
      default: return 'w-[150px]';
    }
  };

  return (
    <div className="border rounded-md">
      <div className="relative">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-white">
            <TableRow>
              <TableHead className="w-10 sticky left-0 z-30 bg-white">
                <Checkbox />
              </TableHead>
              
              {visibleColumnsOrder.map((colKey) => {
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
                
                {visibleColumnsOrder.map((colKey) => {
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
                <TableCell colSpan={visibleColumnsOrder.length + 2} className="text-center py-8">
                  No employee data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
