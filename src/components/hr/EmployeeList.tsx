
import React, { useState, useMemo } from 'react';
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
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

  // Filter employees based on search term
  const filteredData = useMemo(() => {
    // Process data to ensure valid employee_id
    const processedData = data.map(employee => {
      // If there's no employee_id, generate one with the EMP- prefix
      if (!employee.employee_id && !employee.employeeId) {
        const randomId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        return {
          ...employee,
          employee_id: randomId,
          employeeId: randomId
        };
      }
      
      // If there's only employee_id but no employeeId, copy it
      if (employee.employee_id && !employee.employeeId) {
        return {
          ...employee,
          employeeId: employee.employee_id
        };
      }
      
      // If there's only employeeId but no employee_id, copy it
      if (!employee.employee_id && employee.employeeId) {
        return {
          ...employee,
          employee_id: employee.employeeId
        };
      }
      
      // Both exist, return as is
      return employee;
    });
    
    if (!searchTerm.trim()) {
      return processedData;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    return processedData.filter(employee => 
      employee.name.toLowerCase().includes(searchLower) || 
      (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
      (employee.employee_id && employee.employee_id.toLowerCase().includes(searchLower)) ||
      (employee.employeeId && employee.employeeId.toLowerCase().includes(searchLower))
    );
  }, [data, searchTerm]);

  // Further filter data based on active filters
  const filteredAndSearchedData = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) {
      return filteredData;
    }
    
    return filteredData.filter(employee => {
      for (const [filterKey, filterValues] of Object.entries(activeFilters)) {
        if (filterValues.length === 0) continue;
        
        // Skip if we're looking for "All"
        if (filterValues.includes('All')) continue;
        
        // Handle each filter type specifically
        switch (filterKey) {
          case 'status':
            if (!filterValues.includes(employee.status || 'Active')) return false;
            break;
          case 'employmentStatus':
            if (!filterValues.includes(employee.employmentStatus || '')) return false;
            break;
          case 'branch':
            if (!filterValues.includes(employee.branch || '')) return false;
            break;
          case 'organization':
            if (!filterValues.includes(employee.organization || '')) return false;
            break;
          case 'jobPosition':
            if (!filterValues.includes(employee.jobPosition || '')) return false;
            break;
          case 'jobLevel':
            if (!filterValues.includes(employee.jobLevel || '')) return false;
            break;
        }
      }
      
      return true;
    });
  }, [filteredData, activeFilters]);

  // Statistics for this period (May 2025)
  // Count active, new hires (joined this month), and leaving (resigned this month)
  const periodStats = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let newHires = 0;
    let leaving = 0;
    
    // Count employees who joined or resigned this month
    data.forEach(employee => {
      // Check if joined this month
      if (employee.joinDate) {
        const joinDate = new Date(employee.joinDate);
        if (joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear) {
          newHires++;
        }
      }
      
      // Check if leaving (resigned) this month
      if (employee.status === 'Resigned' && employee.resignDate) {
        const resignDate = new Date(employee.resignDate);
        if (resignDate.getMonth() === currentMonth && resignDate.getFullYear() === currentYear) {
          leaving++;
        }
      }
    });
    
    return {
      period: `May 2025`,
      totalEmployees: filteredAndSearchedData.length,
      newHires,
      leaving
    };
  }, [filteredAndSearchedData, data]);

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
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
        
        <EmployeeSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Statistics card */}
      <EmployeeStats periodStats={periodStats} />

      {/* Employee table with horizontal scroll */}
      <EmployeeTableView 
        data={filteredAndSearchedData} 
        visibleColumns={visibleColumns} 
        columnOrder={columnOrder}
      />

      {/* Pagination */}
      <EmployeePagination totalCount={filteredAndSearchedData.length} />
    </div>
  );
};
