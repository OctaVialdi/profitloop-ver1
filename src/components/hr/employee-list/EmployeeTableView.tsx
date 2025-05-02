
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { EmployeeActions } from "../EmployeeActions";
import { Employee } from '../employee-list/types';
import { EmployeeColumnState } from '../EmployeeColumnManager';

interface EmployeeTableViewProps {
  data: Employee[];
  visibleColumns: EmployeeColumnState;
}

export const EmployeeTableView: React.FC<EmployeeTableViewProps> = ({ data, visibleColumns }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <ScrollArea className="w-full max-w-full">
        <div className="min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] sticky left-0 z-10 bg-background">
                  <Checkbox />
                </TableHead>
                {visibleColumns.name && <TableHead className="sticky left-[40px] z-10 bg-background">Employee name</TableHead>}
                {visibleColumns.branch && <TableHead>Branch</TableHead>}
                {visibleColumns.organization && <TableHead>Organization</TableHead>}
                {visibleColumns.jobPosition && <TableHead>Job position</TableHead>}
                {visibleColumns.jobLevel && <TableHead>Job level</TableHead>}
                {visibleColumns.employmentStatus && <TableHead>Employment status</TableHead>}
                {visibleColumns.joinDate && <TableHead>Join date</TableHead>}
                {visibleColumns.endDate && <TableHead>End date</TableHead>}
                {visibleColumns.signDate && <TableHead>Sign date</TableHead>}
                {visibleColumns.resignDate && <TableHead>Resign date</TableHead>}
                {visibleColumns.barcode && <TableHead>Barcode</TableHead>}
                {visibleColumns.email && <TableHead>Email</TableHead>}
                {visibleColumns.birthDate && <TableHead>Birth date</TableHead>}
                {visibleColumns.birthPlace && <TableHead>Birth place</TableHead>}
                {visibleColumns.address && <TableHead>Address</TableHead>}
                {visibleColumns.mobilePhone && <TableHead>Mobile phone</TableHead>}
                {visibleColumns.religion && <TableHead>Religion</TableHead>}
                {visibleColumns.gender && <TableHead>Gender</TableHead>}
                {visibleColumns.maritalStatus && <TableHead>Marital status</TableHead>}
                <TableHead className="text-right sticky right-0 z-10 bg-background">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="sticky left-0 z-10 bg-background">
                    <Checkbox />
                  </TableCell>
                  {visibleColumns.name && (
                    <TableCell className="sticky left-[40px] z-10 bg-background">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <div className="bg-gray-100 h-full w-full rounded-full flex items-center justify-center">
                            {employee.name.charAt(0)}
                          </div>
                        </Avatar>
                        <div>{employee.name}</div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.branch && <TableCell>{employee.branch || '-'}</TableCell>}
                  {visibleColumns.organization && <TableCell>{employee.organization || '-'}</TableCell>}
                  {visibleColumns.jobPosition && <TableCell>{employee.jobPosition || '-'}</TableCell>}
                  {visibleColumns.jobLevel && <TableCell>{employee.jobLevel || '-'}</TableCell>}
                  {visibleColumns.employmentStatus && <TableCell>{employee.employmentStatus || '-'}</TableCell>}
                  {visibleColumns.joinDate && <TableCell>{employee.joinDate || '-'}</TableCell>}
                  {visibleColumns.endDate && <TableCell>{employee.endDate || '-'}</TableCell>}
                  {visibleColumns.signDate && <TableCell>{employee.signDate || '-'}</TableCell>}
                  {visibleColumns.resignDate && <TableCell>{employee.resignDate || '-'}</TableCell>}
                  {visibleColumns.barcode && <TableCell>{employee.barcode || '-'}</TableCell>}
                  {visibleColumns.email && <TableCell>{employee.email || '-'}</TableCell>}
                  {visibleColumns.birthDate && <TableCell>{employee.birthDate || '-'}</TableCell>}
                  {visibleColumns.birthPlace && <TableCell>{employee.birthPlace || '-'}</TableCell>}
                  {visibleColumns.address && <TableCell>{employee.address || '-'}</TableCell>}
                  {visibleColumns.mobilePhone && <TableCell>{employee.mobilePhone || '-'}</TableCell>}
                  {visibleColumns.religion && <TableCell>{employee.religion || '-'}</TableCell>}
                  {visibleColumns.gender && <TableCell>{employee.gender || '-'}</TableCell>}
                  {visibleColumns.maritalStatus && <TableCell>{employee.maritalStatus || '-'}</TableCell>}
                  <TableCell className="text-right sticky right-0 z-10 bg-background">
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
      </ScrollArea>
    </div>
  );
};
