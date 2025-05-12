
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const mockData = [
  {
    id: 1,
    title: "Summer Collection Promotion",
    platform: "Instagram",
    type: "Post",
    createdDate: "2025-05-05",
    status: "Published",
  },
  {
    id: 2,
    title: "Customer Testimonial Video",
    platform: "Facebook",
    type: "Video",
    createdDate: "2025-05-07",
    status: "Draft",
  },
  {
    id: 3,
    title: "Product Launch Announcement",
    platform: "LinkedIn",
    type: "Carousel",
    createdDate: "2025-05-08",
    status: "Scheduled",
  },
  {
    id: 4,
    title: "Behind the Scenes",
    platform: "TikTok",
    type: "Reel",
    createdDate: "2025-05-10",
    status: "Published",
  },
  {
    id: 5,
    title: "Weekly Tips & Tricks",
    platform: "Twitter",
    type: "Post",
    createdDate: "2025-05-11",
    status: "Draft",
  },
];

const ContentBank = () => {
  return (
    <Card className="w-full">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Content Bank</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search content..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <span className="hidden sm:inline-block mr-1">Add Content</span>
            <span className="text-xl">+</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Fixed size ScrollArea with both vertical and horizontal scrolling */}
        <div className="h-[400px] w-full border rounded-md">
          <ScrollArea className="h-full w-full" type="always">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead className="w-[120px] text-center">Platform</TableHead>
                    <TableHead className="w-[120px] text-center">Type</TableHead>
                    <TableHead className="w-[120px] text-center">Created Date</TableHead>
                    <TableHead className="w-[120px] text-center">Status</TableHead>
                    <TableHead className="w-[150px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="w-[50px]">
                        <input type="checkbox" className="h-4 w-4" />
                      </TableCell>
                      <TableCell className="font-medium w-[200px]">{item.title}</TableCell>
                      <TableCell className="w-[120px] text-center">{item.platform}</TableCell>
                      <TableCell className="w-[120px] text-center">{item.type}</TableCell>
                      <TableCell className="w-[120px] text-center">{item.createdDate}</TableCell>
                      <TableCell className="w-[120px] text-center">
                        <Badge
                          variant="outline"
                          className={`
                            ${item.status === "Published" ? "border-green-500 text-green-600 bg-green-50" : ""}
                            ${item.status === "Draft" ? "border-gray-500 text-gray-600 bg-gray-50" : ""}
                            ${item.status === "Scheduled" ? "border-blue-500 text-blue-600 bg-blue-50" : ""}
                          `}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[150px] text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentBank;
