
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { EmployeeFilterMenu } from "./EmployeeFilterMenu";
import { EmployeeActions } from "./EmployeeActions";
import { EmployeeColumnManager, EmployeeColumnState } from "./EmployeeColumnManager";
import { Avatar } from "@/components/ui/avatar";

export interface Employee {
  id: string;
  name: string;
  email: string;
  branch?: string;
  organization?: string;
  jobPosition?: string;
  jobLevel?: string;
  employmentStatus?: string;
  joinDate?: string;
  endDate?: string;
  signDate?: string;
  resignDate?: string;
  barcode?: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  mobilePhone?: string;
  religion?: string;
  gender?: string;
  maritalStatus?: string;
}

interface EmployeeListProps {
  data: Employee[];
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  
  // Update with the proper type
  const [visibleColumns, setVisibleColumns] = useState<EmployeeColumnState>({
    name: true,
    email: true,
    branch: true,
    organization: true,
    jobPosition: true,
    jobLevel: true,
    employmentStatus: true,
    joinDate: true,
    endDate: true,
    signDate: true,
    resignDate: true,
    barcode: true,
    birthDate: true,
    birthPlace: true,
    address: true,
    mobilePhone: true,
    religion: true,
    gender: true,
    maritalStatus: true,
  });

  // Statistics for this period (May 2025)
  const periodStats = {
    period: "May 2025",
    totalEmployees: data.length,
    newHires: 0,
    leaving: 0
  };

  return (
    <div className="space-y-4">
      {/* Header section with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employee list</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                More <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export data</DropdownMenuItem>
              <DropdownMenuItem>Print list</DropdownMenuItem>
              <DropdownMenuItem>Archive employees</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline">Employee transfer</Button>
          <Button variant="outline">Bulk update data</Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1">
                Add employee <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add employee</DropdownMenuItem>
              <DropdownMenuItem>Import employee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <Popover open={showFilter} onOpenChange={setShowFilter}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              Filter (1) <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <EmployeeFilterMenu onClose={() => setShowFilter(false)} />
          </PopoverContent>
        </Popover>

        <div className="flex-1 flex items-center justify-end gap-2">
          <Popover open={showColumns} onOpenChange={setShowColumns}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <EmployeeColumnManager 
                columns={visibleColumns} 
                onColumnChange={(newColumns) => setVisibleColumns(newColumns)} 
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-properties"><path d="M15 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 9H3"/><path d="M21 15H3"/></svg>
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-10 w-[300px]" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Statistics card */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 divide-x text-sm">
            <div className="p-4">
              <div className="text-gray-500">Overview of period</div>
              <div className="font-medium mt-1">{periodStats.period}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-500">Total employees</div>
              <div className="font-medium mt-1">{periodStats.totalEmployees}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-500">New hire</div>
              <div className="font-medium mt-1">{periodStats.newHires}</div>
            </div>
            <div className="p-4">
              <div className="text-gray-500">Leaving</div>
              <div className="font-medium mt-1">{periodStats.leaving}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox />
                </TableHead>
                {visibleColumns.name && <TableHead>Employee name</TableHead>}
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  {visibleColumns.name && (
                    <TableCell>
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
                  <TableCell className="text-right">
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> from <span className="font-medium">{data.length}</span> row
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
