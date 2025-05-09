import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LegacyEmployee } from '@/hooks/useEmployees';
import { EmployeeColumnState, ColumnOrder } from '../EmployeeColumnManager';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface EmployeeTableViewProps {
  data: LegacyEmployee[];
  visibleColumns: EmployeeColumnState;
  columnOrder: ColumnOrder;
}

export const EmployeeTableView: React.FC<EmployeeTableViewProps> = ({
  data,
  visibleColumns,
  columnOrder,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const visibleColumnsArray = columnOrder.filter(c => visibleColumns[c]);

  return (
    <Card className="border border-muted/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              {visibleColumnsArray.includes('name') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Name</th>
              )}
              {visibleColumnsArray.includes('employeeId') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Employee ID</th>
              )}
              {visibleColumnsArray.includes('email') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Email</th>
              )}
              {visibleColumnsArray.includes('jobPosition') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Position</th>
              )}
              {visibleColumnsArray.includes('employmentStatus') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Status</th>
              )}
              {visibleColumnsArray.includes('branch') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Branch</th>
              )}
              {visibleColumnsArray.includes('organization') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Department</th>
              )}
              {visibleColumnsArray.includes('joinDate') && (
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Join Date</th>
              )}
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => (
              <tr 
                key={employee.id || index} 
                className="border-b last:border-0 transition-colors hover:bg-muted/20"
              >
                {visibleColumnsArray.includes('name') && (
                  <td className="p-3 text-sm">
                    <div className="font-medium">{employee.name}</div>
                  </td>
                )}
                {visibleColumnsArray.includes('employeeId') && (
                  <td className="p-3 text-sm text-muted-foreground">
                    {employee.employeeId || employee.employee_id || '-'}
                  </td>
                )}
                {visibleColumnsArray.includes('email') && (
                  <td className="p-3 text-sm text-muted-foreground">
                    {employee.email || '-'}
                  </td>
                )}
                {visibleColumnsArray.includes('jobPosition') && (
                  <td className="p-3 text-sm text-muted-foreground">
                    {employee.jobPosition || '-'}
                  </td>
                )}
                {visibleColumnsArray.includes('employmentStatus') && (
                  <td className="p-3">
                    <Badge variant="outline" className={employee.employmentStatus === 'Full Time' ? 
                      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400' : 
                      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400'
                    }>
                      {employee.employmentStatus || 'Unknown'}
                    </Badge>
                  </td>
                )}
                {visibleColumnsArray.includes('branch') && (
                  <td className="p-3 text-sm text-muted-foreground">
                    {employee.branch || '-'}
                  </td>
                )}
                {visibleColumnsArray.includes('organization') && (
                  <td className="p-3 text-sm text-muted-foreground">
                    {employee.organization || '-'}
                  </td>
                )}
                {visibleColumnsArray.includes('joinDate') && (
                  <td className="p-3 text-sm text-muted-foreground">
                    {formatDate(employee.joinDate)}
                  </td>
                )}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <a 
                      href={`/hr/data/employee/${employee.id}`} 
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-muted bg-transparent text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Users className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <h3 className="text-base font-medium">No employees found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </Card>
  );
};
