
import React, { useState } from 'react';
import { Employee } from './employee-list/types';
import { EmployeeColumnState, ColumnOrder } from './EmployeeColumnManager';
import { EmployeeHeader } from './employee-list/EmployeeHeader';
import { EmployeeFilters } from './employee-list/EmployeeFilters';
import { EmployeeSearchBar } from './employee-list/EmployeeSearchBar';
import { EmployeeStats } from './employee-list/EmployeeStats';
import { EmployeeTableView } from './employee-list/EmployeeTableView';
import { EmployeePagination } from './employee-list/EmployeePagination';

interface EmployeeListProps {
  data: Employee[];
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  
  // Update with default 8 visible columns
  const [visibleColumns, setVisibleColumns] = useState<EmployeeColumnState>({
    name: true,
    employeeId: true,
    email: true,
    branch: true,
    organization: true,
    jobPosition: true,
    jobLevel: true,
    employmentStatus: true,
    joinDate: false,
    endDate: false,
    signDate: false,
    resignDate: false,
    barcode: false,
    birthDate: false,
    birthPlace: false,
    address: false,
    mobilePhone: false,
    religion: false,
    gender: false,
    maritalStatus: false,
  });

  // Define the default column order
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>([
    'name',
    'employeeId',
    'email',
    'branch',
    'organization',
    'jobPosition',
    'jobLevel',
    'employmentStatus',
    'joinDate',
    'endDate',
    'signDate',
    'resignDate',
    'barcode',
    'birthDate',
    'birthPlace',
    'address',
    'mobilePhone',
    'religion',
    'gender',
    'maritalStatus'
  ]);

  // Statistics for this period (May 2025)
  const periodStats = {
    period: "May 2025",
    totalEmployees: data.length,
    newHires: 0,
    leaving: 0
  };

  // We need to generate employee IDs for the data
  const processedData = data.map(employee => ({
    ...employee,
    employeeId: employee.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
  }));

  return (
    <div className="space-y-4">
      {/* Header section with actions */}
      <EmployeeHeader />

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <EmployeeFilters 
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          showColumns={showColumns}
          setShowColumns={setShowColumns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />
        
        <EmployeeSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Statistics card */}
      <EmployeeStats periodStats={periodStats} />

      {/* Employee table with horizontal scroll */}
      <EmployeeTableView 
        data={processedData} 
        visibleColumns={visibleColumns} 
        columnOrder={columnOrder}
      />

      {/* Pagination */}
      <EmployeePagination totalCount={data.length} />
    </div>
  );
};
