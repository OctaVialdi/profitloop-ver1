
import React, { useState } from 'react';
import { LegacyEmployee } from '@/hooks/useEmployees';
import { EmployeeColumnState, ColumnOrder } from './EmployeeColumnManager';
import { EmployeeHeader } from './employee-list/EmployeeHeader';
import { EmployeeFilters } from './employee-list/EmployeeFilters';
import { EmployeeSearchBar } from './employee-list/EmployeeSearchBar';
import { EmployeeStats } from './employee-list/EmployeeStats';
import { EmployeeTableView } from './employee-list/EmployeeTableView';
import { EmployeePagination } from './employee-list/EmployeePagination';

interface EmployeeListProps {
  data: LegacyEmployee[];
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  
  // Update with the proper type
  const [visibleColumns, setVisibleColumns] = useState<EmployeeColumnState>({
    name: true,
    employeeId: true,
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
    employeeId: employee.employee_id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
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
