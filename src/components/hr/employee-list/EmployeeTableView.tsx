
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { EmployeeActions } from "../EmployeeActions";
import { Employee } from '../employee-list/types';
import { EmployeeColumnState, EmployeeColumnOrder } from '../EmployeeColumnManager';

interface EmployeeTableViewProps {
  data: Employee[];
  visibleColumns: EmployeeColumnState;
  columnOrder: EmployeeColumnOrder;
}

export const EmployeeTableView: React.FC<EmployeeTableViewProps> = ({ data, visibleColumns, columnOrder }) => {
  
  // Helper function to render the appropriate cell based on column key
  const renderTableCell = (employee: Employee, columnKey: keyof EmployeeColumnState) => {
    switch (columnKey) {
      case 'name':
        return (
          <TableCell className="sticky left-[40px] z-20 bg-background">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
                  {employee.name.charAt(0)}
                </div>
              </Avatar>
              <div>{employee.name}</div>
            </div>
          </TableCell>
        );
      case 'branch':
        return <TableCell>{employee.branch || '-'}</TableCell>;
      case 'organization':
        return <TableCell>{employee.organization || '-'}</TableCell>;
      case 'jobPosition':
        return <TableCell>{employee.jobPosition || '-'}</TableCell>;
      case 'jobLevel':
        return <TableCell>{employee.jobLevel || '-'}</TableCell>;
      case 'employmentStatus':
        return <TableCell>{employee.employmentStatus || '-'}</TableCell>;
      case 'joinDate':
        return <TableCell>{employee.joinDate || '-'}</TableCell>;
      case 'endDate':
        return <TableCell>{employee.endDate || '-'}</TableCell>;
      case 'signDate':
        return <TableCell>{employee.signDate || '-'}</TableCell>;
      case 'resignDate':
        return <TableCell>{employee.resignDate || '-'}</TableCell>;
      case 'barcode':
        return <TableCell>{employee.barcode || '-'}</TableCell>;
      case 'email':
        return <TableCell>{employee.email || '-'}</TableCell>;
      case 'birthDate':
        return <TableCell>{employee.birthDate || '-'}</TableCell>;
      case 'birthPlace':
        return <TableCell>{employee.birthPlace || '-'}</TableCell>;
      case 'address':
        return <TableCell>{employee.address || '-'}</TableCell>;
      case 'mobilePhone':
        return <TableCell>{employee.mobilePhone || '-'}</TableCell>;
      case 'religion':
        return <TableCell>{employee.religion || '-'}</TableCell>;
      case 'gender':
        return <TableCell>{employee.gender || '-'}</TableCell>;
      case 'maritalStatus':
        return <TableCell>{employee.maritalStatus || '-'}</TableCell>;
      default:
        return <TableCell>-</TableCell>;
    }
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
                
                {/* Render table headers based on column order */}
                {columnOrder
                  .filter(colKey => visibleColumns[colKey])
                  .map((colKey) => {
                    if (colKey === 'name') {
                      return (
                        <TableHead 
                          key={colKey} 
                          className="sticky left-[40px] z-30 bg-background"
                        >
                          Employee name
                        </TableHead>
                      );
                    }
                    return (
                      <TableHead key={colKey}>
                        {colKey === 'jobPosition' ? 'Job position' :
                         colKey === 'jobLevel' ? 'Job level' :
                         colKey === 'employmentStatus' ? 'Employment status' :
                         colKey === 'joinDate' ? 'Join date' :
                         colKey === 'endDate' ? 'End date' :
                         colKey === 'signDate' ? 'Sign date' :
                         colKey === 'resignDate' ? 'Resign date' :
                         colKey === 'birthDate' ? 'Birth date' :
                         colKey === 'birthPlace' ? 'Birth place' :
                         colKey === 'mobilePhone' ? 'Mobile phone' :
                         colKey === 'maritalStatus' ? 'Marital status' :
                         colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                      </TableHead>
                    );
                  })}
                
                <TableHead className="text-right sticky right-0 z-30 bg-background">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="sticky left-0 z-20 bg-background">
                    <Checkbox />
                  </TableCell>
                  
                  {/* Render table cells based on column order */}
                  {columnOrder
                    .filter(colKey => visibleColumns[colKey])
                    .map((colKey) => (
                      <React.Fragment key={colKey}>
                        {renderTableCell(employee, colKey)}
                      </React.Fragment>
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
