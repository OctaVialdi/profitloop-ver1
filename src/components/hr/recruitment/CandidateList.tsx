
import React, { useState, useEffect } from "react";
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
  Download,
  Loader2,
  Star,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { candidateService, CandidateApplication } from "@/services/candidateService";
import { Slider } from "@/components/ui/slider";

export default function CandidateList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const data = await candidateService.fetchCandidates();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, []);
  
  const handleViewProfile = (id: string) => {
    navigate(`/hr/recruitment/candidate/${id}`);
  };
  
  const getStatusBadgeProps = (status: string): BadgeProps => {
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  // Apply filters and sorting
  const filteredCandidates = candidates
    .filter(candidate => 
      // Text search filter
      (candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (candidate.job_title && candidate.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Score filter
      (minScore === 0 || (candidate.score !== undefined && candidate.score >= minScore))
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;

      if (sortColumn === 'score') {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return sortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      } else if (sortColumn === 'name') {
        return sortDirection === 'asc' 
          ? a.full_name.localeCompare(b.full_name)
          : b.full_name.localeCompare(a.full_name);
      } else if (sortColumn === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      
      return 0;
    });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  // Render stars based on score
  const renderStars = (score: number | undefined | null) => {
    if (score === undefined || score === null) return null;
    
    return (
      <div className="flex items-center">
        <span className="font-medium mr-1">{score.toFixed(1)}</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(score)
                  ? "text-yellow-400 fill-yellow-400"
                  : i < score
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-gray-300"
              }`} 
            />
          ))}
        </div>
      </div>
    );
  };

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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
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

      {showFilters && (
        <div className="rounded-md border p-4">
          <h3 className="font-medium mb-3">Filter Candidates</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">
                Minimum Score: {minScore.toFixed(1)}
              </label>
              <div className="flex gap-4 items-center">
                <Slider
                  defaultValue={[0]}
                  value={[minScore]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => setMinScore(value[0])}
                  className="w-64"
                />
                {minScore > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMinScore(0)}
                  >
                    Reset
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead>Position</TableHead>
              <TableHead 
                className="hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Applied
                  {renderSortIcon('date')}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('score')}
              >
                <div className="flex items-center">
                  Score
                  {renderSortIcon('score')}
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading candidates...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div className="font-medium">{candidate.full_name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{candidate.job_title}</div>
                    <div className="text-xs text-muted-foreground truncate">{candidate.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.job_title}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(candidate.created_at)}</TableCell>
                  <TableCell>
                    <Badge {...getStatusBadgeProps(candidate.status)}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {candidate.score !== undefined && candidate.score !== null ? (
                      renderStars(candidate.score)
                    ) : (
                      <span className="text-gray-400 text-sm">Not rated</span>
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
                        <DropdownMenuItem onClick={() => handleViewProfile(candidate.id)}>
                          View Profile
                        </DropdownMenuItem>
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
