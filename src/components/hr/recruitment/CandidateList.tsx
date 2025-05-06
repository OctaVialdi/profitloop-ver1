
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Badge, 
  BadgeProps
} from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  Filter, 
  UserPlus, 
  Download
} from "lucide-react";

type CandidateStatus = 'new' | 'screening' | 'interview' | 'assessment' | 'offered' | 'hired' | 'rejected';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  applyDate: string;
  status: CandidateStatus;
  score?: number;
}

const getStatusBadgeProps = (status: CandidateStatus): BadgeProps => {
  switch (status) {
    case 'new':
      return { variant: 'default' };
    case 'screening':
      return { variant: 'outline' };
    case 'interview':
      return { className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
    case 'assessment':
      return { className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
    case 'offered':
      return { className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' };
    case 'hired':
      return { className: 'bg-green-100 text-green-800 hover:bg-green-200' };
    case 'rejected':
      return { className: 'bg-red-100 text-red-800 hover:bg-red-200' };
    default:
      return { variant: 'secondary' };
  }
};

export default function CandidateList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - this would be replaced with actual API calls
  const mockCandidates: Candidate[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      position: "Frontend Developer",
      applyDate: "2023-05-02",
      status: "interview",
      score: 4.2
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      position: "UX Designer",
      applyDate: "2023-05-01",
      status: "assessment",
      score: 3.8
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      position: "Backend Developer",
      applyDate: "2023-04-28",
      status: "hired",
      score: 4.7
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      position: "Product Manager",
      applyDate: "2023-04-25",
      status: "rejected"
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.b@example.com",
      position: "Frontend Developer",
      applyDate: "2023-05-03",
      status: "new"
    }
  ];

  // Simple filter for demonstration
  const filteredCandidates = mockCandidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="ml-auto sm:ml-0 flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Add Candidate</span>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="hidden md:table-cell">Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Score</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{candidate.position}</div>
                    <div className="text-xs text-muted-foreground truncate">{candidate.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.applyDate}</TableCell>
                  <TableCell>
                    <Badge {...getStatusBadgeProps(candidate.status)}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {candidate.score ? (
                      <div className="font-medium">{candidate.score}/5</div>
                    ) : (
                      <div className="text-muted-foreground text-sm">Not rated</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem>Rate Candidate</DropdownMenuItem>
                        <DropdownMenuItem>Move to Hired</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No candidates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
