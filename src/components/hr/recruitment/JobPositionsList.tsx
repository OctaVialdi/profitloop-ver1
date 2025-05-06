
import React, { useState, useEffect } from "react";
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
import { NewPositionDialog } from "./NewPositionDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Updated interface to make department optional since it's not in the database
interface JobPosition {
  id: string;
  title: string;
  department?: string; // Make department optional
  location: string;
  employment_type: string;
  status: 'active' | 'draft' | 'closed';
  created_at: string;
  applicantCount: number;
}

export default function JobPositionsList() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobPositions();
  }, []);

  const fetchJobPositions = async () => {
    setIsLoading(true);
    try {
      // Get user's organization ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.organization_id) {
        throw new Error("Organization not found");
      }
      
      // Fetch job positions for this organization
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .eq('organization_id', profileData.organization_id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // For each job position, get applicant count
      const positionsWithApplicants = await Promise.all((data || []).map(async (position) => {
        const { count, error: countError } = await supabase
          .from('candidate_applications')
          .select('id', { count: 'exact', head: true })
          .eq('job_position_id', position.id);
          
        // Add the department field with a default value if it doesn't exist in the database
        return {
          ...position,
          department: position.department || '-', // Add default department value
          applicantCount: count || 0
        };
      }));
      
      // Cast the result to JobPosition[] to satisfy TypeScript
      setJobPositions(positionsWithApplicants as JobPosition[]);
    } catch (error: any) {
      console.error("Error fetching job positions:", error);
      toast.error("Failed to load job positions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'active' | 'draft' | 'closed') => {
    try {
      const { error } = await supabase
        .from('job_positions')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setJobPositions(prev => 
        prev.map(job => job.id === id ? { ...job, status: newStatus } : job)
      );
      
      toast.success(`Position status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleGenerateLink = (jobId: string) => {
    // Just set this to be handled in the InvitationLinks component
    // Update the URL with query parameters
    window.location.href = "/hr/recruitment?tab=invitations&jobId=" + jobId;
  };
  
  const handleDeletePosition = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    
    try {
      const { error } = await supabase
        .from('job_positions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setJobPositions(prev => prev.filter(job => job.id !== id));
      toast.success("Position deleted successfully");
    } catch (error: any) {
      console.error("Error deleting job position:", error);
      toast.error("Failed to delete position");
    }
  };

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
        <Button 
          className="flex items-center gap-1"
          onClick={() => setIsDialogOpen(true)}
        >
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
              {isLoading ? "..." : jobPositions.filter(job => job.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : jobPositions.reduce((acc, job) => acc + job.applicantCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Applicants per Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : jobPositions.length > 0 ? 
                Math.round(jobPositions.reduce((acc, job) => acc + job.applicantCount, 0) / 
                jobPositions.filter(job => job.applicantCount > 0).length || 1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse text-muted-foreground">Loading job positions...</div>
        </div>
      ) : jobPositions.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/10">
          <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No job positions found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first job position to start receiving applications
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Job Position
          </Button>
        </div>
      ) : (
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
                  <TableCell>{job.employment_type}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleGenerateLink(job.id)}>
                          Generate Link
                        </DropdownMenuItem>
                        {job.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'closed')}>
                            Close Position
                          </DropdownMenuItem>
                        )}
                        {job.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'active')}>
                            Publish Position
                          </DropdownMenuItem>
                        )}
                        {job.status === 'closed' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'active')}>
                            Reopen Position
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeletePosition(job.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <NewPositionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onPositionCreated={fetchJobPositions}
      />
    </div>
  );
}
