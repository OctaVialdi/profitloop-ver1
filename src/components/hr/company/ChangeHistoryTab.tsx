
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ChangeHistoryTab: React.FC = () => {
  const historyData = [
    {
      date: '2023-05-15',
      changedBy: 'Emily Davis',
      field: 'Address',
      previousValue: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
      newValue: 'Jl. Sudirman No. 123, Jakarta Pusat',
      status: 'Approved',
      approvedBy: 'Michael Wilson'
    },
    {
      date: '2023-06-20',
      changedBy: 'James Johnson',
      field: 'Company Name',
      previousValue: 'Tech Innovators Indonesia',
      newValue: 'PT. Tech Innovators Indonesia',
      status: 'Approved',
      approvedBy: 'Michael Wilson'
    },
    {
      date: '2023-07-10',
      changedBy: 'Jane Smith',
      field: 'Vision',
      previousValue: 'To be the best technology company in Indonesia',
      newValue: 'To become the leading technology solutions provider in Southeast Asia',
      status: 'Pending',
      approvedBy: '-'
    },
    {
      date: '2023-08-05',
      changedBy: 'Emily Davis',
      field: 'Employees',
      previousValue: '125',
      newValue: '150',
      status: 'Approved',
      approvedBy: 'Michael Wilson'
    },
    {
      date: '2023-09-18',
      changedBy: 'John Doe',
      field: 'Logo',
      previousValue: 'old-logo.png',
      newValue: 'new-logo.png',
      status: 'Rejected',
      approvedBy: 'Michael Wilson'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-500 text-white border-0">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-500 text-white border-0">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-500 text-white border-0">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Company Change History</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Previous Value</TableHead>
              <TableHead>New Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approved By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.changedBy}</TableCell>
                <TableCell>{item.field}</TableCell>
                <TableCell className="max-w-[200px] truncate">{item.previousValue}</TableCell>
                <TableCell className="max-w-[200px] truncate">{item.newValue}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.approvedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChangeHistoryTab;
