import React, { useState, useEffect } from 'react';
import { FileWarning, Plus, Eye, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrganization } from '@/hooks/useOrganization';
import { format } from 'date-fns';

import { 
  fetchReprimands, 
  Reprimand, 
  ReprimandFilter, 
  updateReprimand 
} from '@/services/reprimandService';
import AddReprimandDialog from './reprimand/AddReprimandDialog';
import ReprimandDetailDialog from './reprimand/ReprimandDetailDialog';
import ReprimandFilters from './reprimand/ReprimandFilters';
import ReprimandStats from './reprimand/ReprimandStats';

interface ReprimandTabProps {}

const ReprimandTab: React.FC = () => {
  const { organization } = useOrganization();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReprimand, setSelectedReprimand] = useState<Reprimand | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [reprimands, setReprimands] = useState<Reprimand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ReprimandFilter>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'date',
    direction: 'desc'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadReprimands();
  }, [organization, filters]);

  const loadReprimands = async () => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchReprimands(organization.id, filters);
      setReprimands(data);
      setRefreshTrigger(prev => prev + 1); // This will cause stats to refresh
    } catch (error) {
      console.error('Error loading reprimands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedReprimands = React.useMemo(() => {
    const filtered = reprimands.filter(reprimand => {
      // Apply search term
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        return (
          reprimand.employee_name?.toLowerCase().includes(searchLower) ||
          reprimand.department?.toLowerCase().includes(searchLower) ||
          reprimand.reprimand_type.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // Apply sorting
    if (sortConfig !== null) {
      return [...filtered].sort((a, b) => {
        if (a[sortConfig.key as keyof Reprimand] < b[sortConfig.key as keyof Reprimand]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof Reprimand] > b[sortConfig.key as keyof Reprimand]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [reprimands, searchTerm, sortConfig]);

  const handleViewDetails = (reprimand: Reprimand) => {
    setSelectedReprimand(reprimand);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: 'Active' | 'Resolved') => {
    await updateReprimand(id, { status });
    loadReprimands();
  };

  const exportToCSV = () => {
    if (reprimands.length === 0) return;
    
    const headers = [
      'Employee Name',
      'Department',
      'Reprimand Type', 
      'Date',
      'Status',
      'Escalation Level',
      'Details'
    ];
    
    const csvData = sortedReprimands.map(r => [
      r.employee_name || 'Unknown',
      r.department || 'Unknown',
      r.reprimand_type,
      format(new Date(r.date), 'yyyy-MM-dd'),
      r.status,
      r.escalation_level.toString(),
      r.details || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reprimands-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reprimand System</h2>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Reprimand
        </Button>
      </div>

      <ReprimandFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        exportToCSV={exportToCSV}
      />

      <ReprimandStats refreshTrigger={refreshTrigger} />

      <h3 className="text-lg font-semibold mt-8 mb-2">Reprimand Records</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('employee_name')}>
                Employee
                {sortConfig?.key === 'employee_name' && (
                  sortConfig.direction === 'asc' ? 
                  <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                  <ArrowDown className="ml-1 h-3 w-3 inline" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                Department
                {sortConfig?.key === 'department' && (
                  sortConfig.direction === 'asc' ? 
                  <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                  <ArrowDown className="ml-1 h-3 w-3 inline" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('reprimand_type')}>
                Issue Type
                {sortConfig?.key === 'reprimand_type' && (
                  sortConfig.direction === 'asc' ? 
                  <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                  <ArrowDown className="ml-1 h-3 w-3 inline" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Date
                {sortConfig?.key === 'date' && (
                  sortConfig.direction === 'asc' ? 
                  <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                  <ArrowDown className="ml-1 h-3 w-3 inline" />
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                Status
                {sortConfig?.key === 'status' && (
                  sortConfig.direction === 'asc' ? 
                  <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                  <ArrowDown className="ml-1 h-3 w-3 inline" />
                )}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading reprimand data...
                </TableCell>
              </TableRow>
            ) : sortedReprimands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No reprimand records found.
                </TableCell>
              </TableRow>
            ) : (
              sortedReprimands.map((reprimand) => (
                <TableRow key={reprimand.id}>
                  <TableCell>
                    <div className="font-medium">{reprimand.employee_name}</div>
                  </TableCell>
                  <TableCell>
                    {reprimand.department}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        reprimand.reprimand_type === 'Verbal' ? 'outline' :
                        reprimand.reprimand_type === 'Written' ? 'secondary' :
                        reprimand.reprimand_type === 'PIP' ? 'default' : 'destructive'
                      }
                    >
                      {reprimand.reprimand_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(reprimand.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        reprimand.status === 'Active' ? 'outline' : 
                        reprimand.status === 'Resolved' ? 'secondary' : 'default'
                      }
                      className={
                        reprimand.status === 'Active' ? 'bg-red-100 text-red-800 border-red-200' : 
                        reprimand.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' : 
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }
                    >
                      {reprimand.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(reprimand)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {reprimand.status === 'Active' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateStatus(reprimand.id, 'Resolved')}
                          title="Mark as resolved"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      
                      {reprimand.status === 'Resolved' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateStatus(reprimand.id, 'Active')}
                          title="Mark as active"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddReprimandDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        onSuccess={loadReprimands}
      />
      
      <ReprimandDetailDialog 
        reprimand={selectedReprimand} 
        isOpen={isDetailDialogOpen} 
        onClose={() => {
          setIsDetailDialogOpen(false);
          setSelectedReprimand(null);
        }} 
      />
    </div>
  );
};

export default ReprimandTab;
