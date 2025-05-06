
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, PlusIcon, MoreVertical } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: 'active' | 'draft' | 'closed';
  postedDate: string;
  applicantCount: number;
}

export default function JobPositionsList() {
  // Mock data - would be replaced with actual API calls
  const jobPositions: JobPosition[] = [
    {
      id: "1",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      status: "active",
      postedDate: "2023-04-15",
      applicantCount: 18
    },
    {
      id: "2",
      title: "UX Designer",
      department: "Design",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      status: "active",
      postedDate: "2023-04-18",
      applicantCount: 12
    },
    {
      id: "3",
      title: "Backend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Contract",
      status: "active",
      postedDate: "2023-04-20",
      applicantCount: 9
    },
    {
      id: "4",
      title: "Product Manager",
      department: "Product",
      location: "Bandung, Indonesia",
      type: "Full-time",
      status: "draft",
      postedDate: "2023-04-22",
      applicantCount: 0
    },
    {
      id: "5",
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Jakarta, Indonesia",
      type: "Part-time",
      status: "closed",
      postedDate: "2023-03-10",
      applicantCount: 24
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'closed':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BriefcaseIcon className="h-5 w-5" />
          Job Positions
        </h2>
        <Button className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          <span>New Position</span>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobPositions.filter(job => job.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobPositions.reduce((acc, job) => acc + job.applicantCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Applicants per Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(jobPositions.reduce((acc, job) => acc + job.applicantCount, 0) / 
              jobPositions.filter(job => job.applicantCount > 0).length)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Applicants</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPositions.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{job.department}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{job.location}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{job.department}</TableCell>
                <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(job.status)}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{job.applicantCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Position</DropdownMenuItem>
                      <DropdownMenuItem>View Applicants</DropdownMenuItem>
                      <DropdownMenuItem>Generate Link</DropdownMenuItem>
                      {job.status === 'active' && (
                        <DropdownMenuItem>Close Position</DropdownMenuItem>
                      )}
                      {job.status === 'draft' && (
                        <DropdownMenuItem>Publish Position</DropdownMenuItem>
                      )}
                      {job.status === 'closed' && (
                        <DropdownMenuItem>Reopen Position</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
