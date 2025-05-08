
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
import { BriefcaseIcon, PlusIcon, MoreVertical, Users, Eye, Edit, Trash, Link } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewPositionDialog } from "./NewPositionDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Updated interface to make department optional since it's not in the database
interface JobPosition {
  id: string;
  title: string;
  department?: string;
  location: string;
  employment_type: string;
  status: 'active' | 'draft' | 'closed';
  created_at: string;
  applicantCount: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  salary_range?: string;
}

interface JobPositionDetailDialogProps {
  position: JobPosition | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EditPositionDialogProps {
  position: JobPosition | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const JobPositionDetailDialog: React.FC<JobPositionDetailDialogProps> = ({ position, isOpen, onClose }) => {
  if (!position) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5" />
            {position.title}
          </DialogTitle>
          <DialogDescription>
            {position.employment_type} • {position.location}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge
              className={
                position.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                position.status === 'draft' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                'bg-red-100 text-red-800 hover:bg-red-200'
              }
            >
              {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
            </Badge>
            
            <div className="text-sm text-gray-500">
              {position.applicantCount} applicant{position.applicantCount !== 1 ? 's' : ''}
            </div>
          </div>
          
          {position.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{position.description}</p>
            </div>
          )}
          
          {position.responsibilities && (
            <div>
              <h3 className="text-sm font-medium mb-1">Responsibilities</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{position.responsibilities}</p>
            </div>
          )}
          
          {position.requirements && (
            <div>
              <h3 className="text-sm font-medium mb-1">Requirements</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{position.requirements}</p>
            </div>
          )}
          
          {position.salary_range && (
            <div>
              <h3 className="text-sm font-medium mb-1">Salary Range</h3>
              <p className="text-sm text-gray-600">{position.salary_range}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditPositionDialog: React.FC<EditPositionDialogProps> = ({ position, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [status, setStatus] = useState<'active' | 'draft' | 'closed'>('active');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (position) {
      setTitle(position.title || "");
      setDescription(position.description || "");
      setRequirements(position.requirements || "");
      setResponsibilities(position.responsibilities || "");
      setLocation(position.location || "");
      setEmploymentType(position.employment_type || "");
      setSalaryRange(position.salary_range || "");
      setStatus(position.status || 'active');
    }
  }, [position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('job_positions')
        .update({
          title,
          description,
          requirements,
          responsibilities,
          location,
          employment_type: employmentType,
          salary_range: salaryRange,
          status
        })
        .eq('id', position.id);
        
      if (error) throw error;
      
      toast.success("Position updated successfully");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error updating job position:", error);
      toast.error("Failed to update position");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Job Position</DialogTitle>
          <DialogDescription>
            Update the details of this job position.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Position Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Select 
                value={employmentType} 
                onValueChange={setEmploymentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={4} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea 
              id="responsibilities" 
              value={responsibilities} 
              onChange={(e) => setResponsibilities(e.target.value)} 
              rows={4} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea 
              id="requirements" 
              value={requirements} 
              onChange={(e) => setRequirements(e.target.value)} 
              rows={4} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input 
                id="salary_range" 
                value={salaryRange} 
                onChange={(e) => setSalaryRange(e.target.value)} 
                placeholder="e.g. $50,000 - $70,000" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={(value: 'active' | 'draft' | 'closed') => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function JobPositionsList() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

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
          
        // Create a JobPosition object with all required properties
        return {
          ...position,
          department: '-', // Add default department value since it doesn't exist in the database
          applicantCount: count || 0
        } as JobPosition; // Explicitly cast to JobPosition
      }));
      
      setJobPositions(positionsWithApplicants);
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
    // Update to use the new route structure
    navigate(`/hr/recruitment/invitations?jobId=${jobId}`);
  };
  
  const handleDeletePosition = async () => {
    if (!positionToDelete) return;
    
    try {
      const { error } = await supabase
        .from('job_positions')
        .delete()
        .eq('id', positionToDelete);
        
      if (error) throw error;
      
      setJobPositions(prev => prev.filter(job => job.id !== positionToDelete));
      toast.success("Position deleted successfully");
      setDeleteConfirmOpen(false);
      setPositionToDelete(null);
    } catch (error: any) {
      console.error("Error deleting job position:", error);
      toast.error("Failed to delete position");
    }
  };

  const confirmDelete = (id: string) => {
    setPositionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleViewDetails = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsDetailsDialogOpen(true);
  };

  const handleEditPosition = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsEditDialogOpen(true);
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/hr/recruitment/candidates?jobId=${jobId}`);
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
                <TableHead className="w-[120px]">Actions</TableHead>
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
                    <div className="flex items-center justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8" 
                        onClick={() => handleViewDetails(job)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8" 
                        onClick={() => handleViewApplicants(job.id)}
                        title="View Applicants"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPosition(job)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Position
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewApplicants(job.id)}>
                            <Users className="h-4 w-4 mr-2" /> View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateLink(job.id)}>
                            <Link className="h-4 w-4 mr-2" /> Generate Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
                            className="text-destructive focus:text-destructive"
                            onClick={() => confirmDelete(job.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

      <JobPositionDetailDialog 
        position={selectedPosition}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />

      <EditPositionDialog 
        position={selectedPosition}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={fetchJobPositions}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Position</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this position? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePosition} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
