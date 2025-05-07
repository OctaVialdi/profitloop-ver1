
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { candidateService, CandidateApplication } from "@/services/candidateService";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CandidateList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to fetch candidates
  const fetchCandidates = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      console.log("Fetching candidates list...");
      const data = await candidateService.fetchCandidates();
      console.log(`Fetched ${data.length} candidates`);
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch candidates on initial load and when returning to this component
  useEffect(() => {
    fetchCandidates();
    
    // Set up a listener for when the user navigates back to this page
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        console.log("Page is visible, refreshing candidate list");
        fetchCandidates();
      }
    };
    
    document.addEventListener('visibilitychange', handleFocus);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [location.key]); // Add location.key to dependencies to refresh on navigation

  // Filter the candidates based on search term and status filter
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      (candidate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (candidate.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-gray-100 text-gray-800";
      case "screening":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "assessment":
        return "bg-amber-100 text-amber-800";
      case "offered":
        return "bg-green-100 text-green-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle row click
  const handleRowClick = (id: string) => {
    navigate(`/hr/recruitment/candidate/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search by name, email, or position..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={fetchCandidates}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <SlidersHorizontal size={16} />
            )}
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Full Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Applied On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading candidates...</TableCell>
              </TableRow>
            ) : filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">No candidates found</TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow 
                  key={candidate.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(candidate.id)}
                >
                  <TableCell className="font-medium">{candidate.full_name}</TableCell>
                  <TableCell>{candidate.job_title || "General Application"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(candidate.status)}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {candidate.score !== null && candidate.score !== undefined ? 
                      parseFloat(candidate.score.toString()).toFixed(1) : 
                      "-"
                    }
                  </TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{format(new Date(candidate.created_at), 'dd/MM/yyyy')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
