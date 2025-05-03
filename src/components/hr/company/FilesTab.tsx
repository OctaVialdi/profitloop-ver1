
import React from 'react';
import { Search, Plus, FileText, Download, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const FilesTab: React.FC = () => {
  const fileCategories = [
    { name: 'Asset Agreement', count: 2, icon: <FileText className="h-5 w-5 text-purple-400" /> },
    { name: 'Reprimand Notice', count: 1, icon: <FileText className="h-5 w-5 text-purple-400" /> },
    { name: 'Return Receipt', count: 0, icon: <FileText className="h-5 w-5 text-purple-400" /> },
    { name: 'Condition Report', count: 0, icon: <FileText className="h-5 w-5 text-purple-400" /> },
  ];

  const files = [
    {
      name: 'asset_agreement_EMP001.pdf',
      type: 'Asset Agreement',
      employee: 'John Doe',
      uploaded: '6/14/2023',
      signed: true,
      version: 'v1.0',
    },
    {
      name: 'asset_agreement_EMP002.pdf',
      type: 'Asset Agreement',
      employee: 'Jane Smith',
      uploaded: '7/19/2023',
      signed: true,
      version: 'v1.0',
    },
    {
      name: 'reprimand_EMP003.pdf',
      type: 'Reprimand Notice',
      employee: 'James Johnson',
      uploaded: '11/15/2023',
      signed: false,
      version: 'v1.0',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Management</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {fileCategories.map((category) => (
          <div key={category.name} className="border rounded-md p-4 flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-md">
              {category.icon}
            </div>
            <div>
              <h3 className="text-gray-600">{category.name}</h3>
              <p className="font-medium">{category.count} files</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search documents..."
            className="pl-10 h-10 w-[300px] md:w-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="relative">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue="All Document Types"
          >
            <option value="All Document Types">All Document Types</option>
            <option value="Asset Agreement">Asset Agreement</option>
            <option value="Reprimand Notice">Reprimand Notice</option>
            <option value="Return Receipt">Return Receipt</option>
            <option value="Condition Report">Condition Report</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Signed</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {file.name}
                </TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{file.employee}</TableCell>
                <TableCell>{file.uploaded}</TableCell>
                <TableCell>
                  {file.signed ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 gap-1 flex items-center">
                      <Check className="h-3 w-3" />
                      Signed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 gap-1 flex items-center">
                      <X className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{file.version}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
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

export default FilesTab;
