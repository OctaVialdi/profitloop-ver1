
import React from 'react';
import { FileWarning, Search, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReprimandTab: React.FC = () => {
  const reprimandData = [
    {
      id: 'REP-001',
      employee: { name: 'James Johnson', department: 'Finance' },
      issue: 'Late return of device',
      relatedAsset: { type: 'Phone', id: 'PH-2023-001' },
      severity: 'Medium',
      status: 'Open',
      date: '11/15/2023',
      resolution: 'Warning issued',
    },
    {
      id: 'REP-002',
      employee: { name: 'Jane Smith', department: 'Marketing' },
      issue: 'Device damage - cracked screen',
      relatedAsset: { type: 'Monitor', id: 'MN-2023-001' },
      severity: 'High',
      status: 'Resolved',
      date: '10/5/2023',
      resolution: 'Employee paid for repair',
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reprimand System</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Reprimand
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search reprimands..."
            className="pl-10 h-10 w-[300px] md:w-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="relative">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue="All Statuses"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Related Asset</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Resolution</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reprimandData.map((reprimand) => (
              <TableRow key={reprimand.id}>
                <TableCell className="font-medium">{reprimand.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{reprimand.employee.name}</div>
                    <div className="text-sm text-muted-foreground">{reprimand.employee.department}</div>
                  </div>
                </TableCell>
                <TableCell>{reprimand.issue}</TableCell>
                <TableCell>
                  <div>
                    <div>{reprimand.relatedAsset.type}</div>
                    <div className="text-sm text-muted-foreground">{reprimand.relatedAsset.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={reprimand.severity === 'High' ? 'destructive' : 'secondary'} className="capitalize">
                    {reprimand.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={reprimand.status === 'Open' ? 'outline' : 'secondary'} className="capitalize bg-green-100 text-green-800 border-green-200">
                    {reprimand.status}
                  </Badge>
                </TableCell>
                <TableCell>{reprimand.date}</TableCell>
                <TableCell>{reprimand.resolution}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReprimandTab;
