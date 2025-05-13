
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, RefreshCw } from "lucide-react";

export const ContentPlan = () => {
  // Sample data structure based on the reference image
  const contentItems = [
    { 
      id: 1, 
      title: 'Product Feature Video', 
      layanan: '-', 
      subLayanan: '-', 
      contentPillar: '-', 
      brief: 'Click to add brief', 
      status: 'Scheduled',
      revision: 0,
      approved: false,
      tanggalSelesai: '2025-05-15'
    },
    { 
      id: 2, 
      title: 'Customer Testimonial', 
      layanan: '-', 
      subLayanan: '-', 
      contentPillar: '-', 
      brief: 'Click to add brief', 
      status: 'Draft',
      revision: 0,
      approved: false,
      tanggalSelesai: '2025-05-17'
    },
    { 
      id: 3, 
      title: 'Industry News Update', 
      layanan: '-', 
      subLayanan: '-', 
      contentPillar: '-', 
      brief: 'Click to add brief', 
      status: 'In Review',
      revision: 0,
      approved: false,
      tanggalSelesai: '2025-05-18'
    },
    { 
      id: 4, 
      title: 'How-To Tutorial', 
      layanan: '-', 
      subLayanan: '-', 
      contentPillar: '-', 
      brief: 'Click to add brief', 
      status: 'Approved',
      revision: 0,
      approved: false,
      tanggalSelesai: '2025-05-20'
    },
    { 
      id: 5, 
      title: 'Product Launch Announcement', 
      layanan: '-', 
      subLayanan: '-', 
      contentPillar: '-', 
      brief: 'Click to add brief', 
      status: 'Draft',
      revision: 0,
      approved: false,
      tanggalSelesai: '2025-05-22'
    },
    { 
      id: 6, 
      title: 'Behind the Scenes', 
      layanan: '-', 
      subLayanan: '-', 
      contentPillar: '-', 
      brief: 'Click to add brief', 
      status: 'Draft',
      revision: 0,
      approved: false,
      tanggalSelesai: '2025-05-25'
    },
  ];

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-lg">Dashboard Content</h2>
          <Button size="sm" className="gap-1">
            <PlusIcon className="h-4 w-4" /> Add Row
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Action</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Sub Layanan</TableHead>
                <TableHead>Judul Content</TableHead>
                <TableHead>Content Pillar</TableHead>
                <TableHead>Brief</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revision</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-between gap-1 border rounded-md px-2 py-1">
                      <span>{item.layanan}</span>
                      <span className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-between gap-1 border rounded-md px-2 py-1">
                      <span>{item.subLayanan}</span>
                      <span className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <input
                      type="text"
                      placeholder="Enter title"
                      className="w-full border rounded-md px-2 py-1"
                      defaultValue={item.title}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-between gap-1 border rounded-md px-2 py-1">
                      <span>{item.contentPillar}</span>
                      <span className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-blue-500">
                    {item.brief}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-between gap-1 border rounded-md px-2 py-1">
                      <span>{item.status === 'Scheduled' ? '-' : item.status}</span>
                      <span className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center">
                      <span className="mr-1">{item.revision}</span>
                      <RefreshCw className="h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Checkbox className="mx-auto block" />
                  </TableCell>
                  <TableCell className="py-2">
                    {item.tanggalSelesai}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};
