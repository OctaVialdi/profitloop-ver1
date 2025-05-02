
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Plus, MoreHorizontal } from "lucide-react";

export const ActivitiesTab = () => {
  return (
    <div className="border-t pt-6">
      <Card>
        <div className="pt-6 px-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Sales Activities</h3>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Plus className="mr-1 h-4 w-4" /> New Activity
            </Button>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by client or status..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="min-w-[140px] justify-between">
                All Types
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </Button>
              <Button variant="outline" className="min-w-[180px] justify-between">
                <Calendar className="h-4 w-4 mr-2" /> 
                Select date range
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Apr 28, 2025</TableCell>
                  <TableCell>Acme Corp</TableCell>
                  <TableCell>
                    Demo <Badge variant="secondary" className="ml-1 bg-gray-100">2</Badge>
                  </TableCell>
                  <TableCell>$52,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Negotiation
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 27, 2025</TableCell>
                  <TableCell>Tech Solutions</TableCell>
                  <TableCell>
                    Closing <Badge variant="secondary" className="ml-1 bg-gray-100">2</Badge>
                  </TableCell>
                  <TableCell>$15,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Closed Won
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 26, 2025</TableCell>
                  <TableCell>Global Innovations</TableCell>
                  <TableCell>
                    Meeting <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      Ongoing
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 invisible">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 25, 2025</TableCell>
                  <TableCell>Stellar Systems</TableCell>
                  <TableCell>
                    Proposal <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                  </TableCell>
                  <TableCell>$28,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Negotiation
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 24, 2025</TableCell>
                  <TableCell>Future Enterprises</TableCell>
                  <TableCell>
                    Cold Call <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      Ongoing
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 invisible">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 22, 2025</TableCell>
                  <TableCell>Quantum Industries</TableCell>
                  <TableCell>
                    Demo <Badge variant="secondary" className="ml-1 bg-gray-100">1</Badge>
                  </TableCell>
                  <TableCell>$65,000</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Negotiation
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 21, 2025</TableCell>
                  <TableCell>Nexus Group</TableCell>
                  <TableCell>
                    Meeting
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      Ongoing
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 invisible">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Missing Calendar import
import { Calendar } from "lucide-react";
