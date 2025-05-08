
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
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { candidateService, CandidateApplication } from "@/services/candidateService";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CandidateList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  
  // Extract jobId from URL parameters if present
  const searchParams = new URLSearchParams(location.search);
  const jobIdFilter = searchParams.get('jobId');
  
  // Function to fetch candidates
  const fetchCandidates = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      console.log("Fetching candidates list...");
      const data = await candidateService.fetchCandidates();
      console.log(`Fetched ${data.length} candidates`);
      
      // Updated jobIdFilter check to work with updated type
      if (jobIdFilter) {
        const filtered = data.filter(candidate => 
          candidate.job_position_id === jobIdFilter
        );
        setCandidates(filtered);
      } else {
        setCandidates(data);
      }
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
  }, [location.key, jobIdFilter]); // Add location.key and jobIdFilter to dependencies

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

  // Handle view details
  const handleViewDetails = (id: string) => {
    navigate(`/hr/recruitment/candidate/${id}`);
  };

  // Handle edit candidate
  const handleEditCandidate = (id: string) => {
    navigate(`/hr/recruitment/candidate/${id}?edit=true`);
  };

  // Handle delete candidate
  const handleDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    
    try {
      await candidateService.deleteCandidate(candidateToDelete);
      
      // Remove candidate from the list
      setCandidates(candidates.filter(c => c.id !== candidateToDelete));
      
      toast.success("Candidate deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate");
    } finally {
      setDeleteConfirmOpen(false);
      setCandidateToDelete(null);
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCandidateToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Build title with job position context if filtered
  const getTitle = () => {
    if (jobIdFilter) {
      const jobTitle = candidates.length > 0 ? candidates[0].job_title : 'Position';
      return `Candidates for ${jobTitle || 'Selected Position'}`;
    }
    return "All Candidates";
  };

  return (
    <div className="space-y-4">
      {jobIdFilter && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{getTitle()}</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/hr/recruitment/candidates')}
          >
            View All Candidates
          </Button>
        </div>
      )}
      
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">Loading candidates...</TableCell>
              </TableRow>
            ) : filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">No candidates found</TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-muted/50">
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
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewDetails(candidate.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(candidate.id)}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCandidate(candidate.id)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Candidate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => confirmDelete(candidate.id, e)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Candidate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCandidate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
