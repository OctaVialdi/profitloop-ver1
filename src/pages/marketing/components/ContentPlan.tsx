
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const ContentPlan = () => {
  // Sample data for the content plan
  const contentItems = [
    { id: 1, title: 'Product Feature Video', platform: 'Instagram', date: '2025-05-15', status: 'Scheduled' },
    { id: 2, title: 'Customer Testimonial', platform: 'Facebook', date: '2025-05-17', status: 'Draft' },
    { id: 3, title: 'Industry News Update', platform: 'Twitter', date: '2025-05-18', status: 'In Review' },
    { id: 4, title: 'How-To Tutorial', platform: 'YouTube', date: '2025-05-20', status: 'Scheduled' },
    { id: 5, title: 'Product Launch Announcement', platform: 'LinkedIn', date: '2025-05-22', status: 'Approved' },
    { id: 6, title: 'Behind the Scenes', platform: 'Instagram', date: '2025-05-25', status: 'Draft' },
  ];

  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.platform}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(item.status)} variant="outline">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
