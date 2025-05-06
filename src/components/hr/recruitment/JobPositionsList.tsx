
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  salary_range: z.string().optional(),
  status: z.string().default("draft"),
});

export default function JobPositionsList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const { organization } = useOrganization();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      responsibilities: "",
      location: "",
      employment_type: "Full-time",
      salary_range: "",
      status: "draft",
    },
  });
  
  useEffect(() => {
    if (organization?.id) {
      fetchJobPositions();
    }
  }, [organization?.id]);
  
  const fetchJobPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .select(`
          id,
          title,
          location,
          employment_type,
          status,
          created_at,
          data_calon_kandidat(count)
        `)
        .eq('organization_id', organization?.id);
      
      if (error) throw error;
      
      const formattedPositions: JobPosition[] = data.map(pos => ({
        id: pos.id,
        title: pos.title,
        department: pos.employment_type === 'Full-time' ? 'Engineering' : 'Operations',
        location: pos.location || 'Remote',
        type: pos.employment_type as any || 'Full-time',
        status: pos.status as 'active' | 'draft' | 'closed',
        postedDate: new Date(pos.created_at).toLocaleDateString(),
        applicantCount: pos.data_calon_kandidat?.length || 0
      }));
      
      setJobPositions(formattedPositions);
    } catch (error) {
      console.error("Error fetching job positions:", error);
      toast.error("Failed to load job positions");
    }
  };
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('job_positions')
        .insert([
          {
            organization_id: organization.id,
            title: values.title,
            description: values.description || null,
            requirements: values.requirements || null,
            responsibilities: values.responsibilities || null,
            location: values.location || null,
            employment_type: values.employment_type || null,
            salary_range: values.salary_range || null,
            status: values.status,
          },
        ]);
      
      if (error) throw error;
      
      toast.success("Job position created successfully");
      fetchJobPositions();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating job position:", error);
      toast.error("Failed to create job position");
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateJobStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_positions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Job position ${status === 'active' ? 'published' : status === 'closed' ? 'closed' : 'moved to draft'}`);
      fetchJobPositions();
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
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
        <Button className="flex items-center gap-1" onClick={() => setIsDialogOpen(true)}>
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
              {jobPositions.filter(job => job.applicantCount > 0).length > 0
                ? Math.round(
                    jobPositions.reduce((acc, job) => acc + job.applicantCount, 0) / 
                    jobPositions.filter(job => job.applicantCount > 0).length
                  )
                : 0}
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
            {jobPositions.length > 0 ? (
              jobPositions.map((job) => (
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
                          <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'closed')}>
                            Close Position
                          </DropdownMenuItem>
                        )}
                        {job.status === 'draft' && (
                          <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'active')}>
                            Publish Position
                          </DropdownMenuItem>
                        )}
                        {job.status === 'closed' && (
                          <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'active')}>
                            Reopen Position
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No job positions found. Click "New Position" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Job Position</DialogTitle>
            <DialogDescription>
              Add a new job position to your organization
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Remote, Jakarta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the job position" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List job requirements" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List job responsibilities" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="salary_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Rp 10M - Rp 15M per year" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Position"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
