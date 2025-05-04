import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Plus, Trash } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { 
  LegacyEmployee, 
  useEmployees, 
  EmployeeEducation, 
  EmployeeWorkExperience 
} from "@/hooks/useEmployees";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface EducationSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

// Schema for formal and informal education
const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  education_type: z.string().default("formal"),
});

// Schema for work experience
const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const EducationSection: React.FC<EducationSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [activeTab, setActiveTab] = useState("formal-education");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  
  // State for employee data
  const [formalEducation, setFormalEducation] = useState<any[]>([]);
  const [informalEducation, setInformalEducation] = useState<any[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get employee methods from hook
  const { 
    addEducation, 
    updateEducation, 
    deleteEducation, 
    addWorkExperience, 
    updateWorkExperience, 
    deleteWorkExperience 
  } = useEmployees();

  // Form for education
  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      education_type: "formal",
    },
  });

  // Form for work experience
  const workExperienceForm = useForm<z.infer<typeof workExperienceSchema>>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: "",
      position: "",
      description: "",
      start_date: "",
      end_date: "",
    },
  });

  // Fetch education and work experience data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch education data from Supabase
      const { data: educationData, error: educationError } = await supabase
        .from('employee_education')
        .select('*')
        .eq('employee_id', employee.id)
        .order('start_date', { ascending: false });
        
      if (educationError) throw educationError;
      
      // Fetch work experience data
      const { data: experienceData, error: experienceError } = await supabase
        .from('employee_work_experience')
        .select('*')
        .eq('employee_id', employee.id)
        .order('start_date', { ascending: false });
        
      if (experienceError) throw experienceError;
      
      // Split education into formal and informal
      const formal = educationData?.filter(edu => edu.education_type === 'formal') || [];
      const informal = educationData?.filter(edu => edu.education_type === 'informal') || [];
      
      setFormalEducation(formal);
      setInformalEducation(informal);
      setWorkExperience(experienceData || []);
    } catch (error) {
      console.error("Error fetching education and experience data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employee.id]);

  // Handle form submission for education
  const handleEducationSubmit = async (data: z.infer<typeof educationSchema>) => {
    try {
      const educationData: EmployeeEducation = {
        employee_id: employee.id,
        institution: data.institution, // This is required
        degree: data.degree,
        field_of_study: data.field_of_study,
        start_date: data.start_date,
        end_date: data.end_date,
        education_type: data.education_type
      };

      if (editingItem) {
        await updateEducation(editingItem.id, educationData);
      } else {
        await addEducation(educationData);
      }
      
      // Close dialog and refetch data
      educationForm.reset();
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving education:", error);
    }
  };

  // Handle form submission for work experience
  const handleWorkExperienceSubmit = async (data: z.infer<typeof workExperienceSchema>) => {
    try {
      const experienceData: EmployeeWorkExperience = {
        employee_id: employee.id,
        company: data.company || "", // This is required
        position: data.position,
        start_date: data.start_date || "", // This is required
        end_date: data.end_date,
        description: data.description
      };

      if (editingItem) {
        await updateWorkExperience(editingItem.id, experienceData);
      } else {
        await addWorkExperience(experienceData);
      }
      
      // Close dialog and refetch data
      workExperienceForm.reset();
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving work experience:", error);
    }
  };

  // Handle edit button click
  const handleEditItem = (item: any, type: string) => {
    setEditingItem(item);
    
    if (type === 'formal-education' || type === 'informal-education') {
      educationForm.reset({
        institution: item.institution || "",
        degree: item.degree || "",
        field_of_study: item.field_of_study || "",
        start_date: item.start_date ? format(new Date(item.start_date), 'yyyy-MM-dd') : "",
        end_date: item.end_date ? format(new Date(item.end_date), 'yyyy-MM-dd') : "",
        education_type: type === 'formal-education' ? 'formal' : 'informal',
      });
    } else if (type === 'working-experience') {
      workExperienceForm.reset({
        company: item.company || "",
        position: item.position || "",
        description: item.description || "",
        start_date: item.start_date ? format(new Date(item.start_date), 'yyyy-MM-dd') : "",
        end_date: item.end_date ? format(new Date(item.end_date), 'yyyy-MM-dd') : "",
      });
    }
    
    setIsDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (id: string, type: string) => {
    setDeletingItemId(id);
    setActiveTab(type);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return;

    try {
      if (activeTab === 'formal-education' || activeTab === 'informal-education') {
        await deleteEducation(deletingItemId);
      } else if (activeTab === 'working-experience') {
        await deleteWorkExperience(deletingItemId);
      }
      
      // Refetch data
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingItemId(null);
    }
  };

  // Handle add button click
  const handleAddClick = (type: string) => {
    setEditingItem(null);
    
    if (type === 'formal-education' || type === 'informal-education') {
      educationForm.reset({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        education_type: type === 'formal-education' ? 'formal' : 'informal',
      });
    } else if (type === 'working-experience') {
      workExperienceForm.reset({
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
      });
    }
    
    setActiveTab(type);
    setIsDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Render table for formal education
  const renderFormalEducationTable = () => {
    if (formalEducation.length === 0) {
      return (
        <EmptyDataDisplay 
          title="No formal education data available"
          description="Add your formal education information here."
          section="formal-education"
          handleEdit={() => handleAddClick('formal-education')}
        />
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Field of Study</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formalEducation.map((education) => (
              <TableRow key={education.id}>
                <TableCell className="font-medium">{education.institution || '-'}</TableCell>
                <TableCell>{education.degree || '-'}</TableCell>
                <TableCell>{education.field_of_study || '-'}</TableCell>
                <TableCell>
                  {formatDate(education.start_date)} - {formatDate(education.end_date)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditItem(education, 'formal-education')}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(education.id!, 'formal-education')}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Render table for informal education
  const renderInformalEducationTable = () => {
    if (informalEducation.length === 0) {
      return (
        <EmptyDataDisplay 
          title="No informal education data available"
          description="Add your certifications, courses, or workshops information here."
          section="informal-education"
          handleEdit={() => handleAddClick('informal-education')}
        />
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Certificate/Course</TableHead>
              <TableHead>Field of Study</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {informalEducation.map((education) => (
              <TableRow key={education.id}>
                <TableCell className="font-medium">{education.institution || '-'}</TableCell>
                <TableCell>{education.degree || '-'}</TableCell>
                <TableCell>{education.field_of_study || '-'}</TableCell>
                <TableCell>
                  {formatDate(education.start_date)} - {formatDate(education.end_date)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditItem(education, 'informal-education')}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(education.id!, 'informal-education')}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Render table for work experience
  const renderWorkExperienceTable = () => {
    if (workExperience.length === 0) {
      return (
        <EmptyDataDisplay 
          title="No work experience data available"
          description="Add your previous work experience information here."
          section="working-experience"
          handleEdit={() => handleAddClick('working-experience')}
        />
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workExperience.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">{experience.company || '-'}</TableCell>
                <TableCell>{experience.position || '-'}</TableCell>
                <TableCell>
                  {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                </TableCell>
                <TableCell>{experience.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditItem(experience, 'working-experience')}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(experience.id!, 'working-experience')}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex justify-between">
          <h2 className="text-2xl font-bold">Education & experience</h2>
        </div>

        <Tabs defaultValue="formal-education" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
            <TabsTrigger value="formal-education" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Formal education
            </TabsTrigger>
            <TabsTrigger value="informal-education" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Informal education
            </TabsTrigger>
            <TabsTrigger value="working-experience" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Working experience
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 mb-4 flex justify-end">
            <Button 
              onClick={() => handleAddClick(activeTab)}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Add {activeTab.replace(/-/g, ' ')}
            </Button>
          </div>

          <TabsContent value="formal-education" className="pt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : formalEducation.length === 0 ? (
              <EmptyDataDisplay 
                title="No formal education data available"
                description="Add your formal education information here."
                section="formal-education"
                handleEdit={() => handleAddClick('formal-education')}
              />
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>Degree</TableHead>
                      <TableHead>Field of Study</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formalEducation.map((education) => (
                      <TableRow key={education.id}>
                        <TableCell className="font-medium">{education.institution || '-'}</TableCell>
                        <TableCell>{education.degree || '-'}</TableCell>
                        <TableCell>{education.field_of_study || '-'}</TableCell>
                        <TableCell>
                          {formatDate(education.start_date)} - {formatDate(education.end_date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditItem(education, 'formal-education')}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(education.id, 'formal-education')}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="informal-education" className="pt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : informalEducation.length === 0 ? (
              <EmptyDataDisplay 
                title="No informal education data available"
                description="Add your certifications, courses, or workshops information here."
                section="informal-education"
                handleEdit={() => handleAddClick('informal-education')}
              />
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>Certificate/Course</TableHead>
                      <TableHead>Field of Study</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {informalEducation.map((education) => (
                      <TableRow key={education.id}>
                        <TableCell className="font-medium">{education.institution || '-'}</TableCell>
                        <TableCell>{education.degree || '-'}</TableCell>
                        <TableCell>{education.field_of_study || '-'}</TableCell>
                        <TableCell>
                          {formatDate(education.start_date)} - {formatDate(education.end_date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditItem(education, 'informal-education')}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(education.id, 'informal-education')}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="working-experience" className="pt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : workExperience.length === 0 ? (
              <EmptyDataDisplay 
                title="No work experience data available"
                description="Add your previous work experience information here."
                section="working-experience"
                handleEdit={() => handleAddClick('working-experience')}
              />
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workExperience.map((experience) => (
                      <TableRow key={experience.id}>
                        <TableCell className="font-medium">{experience.company || '-'}</TableCell>
                        <TableCell>{experience.position || '-'}</TableCell>
                        <TableCell>
                          {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                        </TableCell>
                        <TableCell>{experience.description || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditItem(experience, 'working-experience')}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(experience.id, 'working-experience')}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Dialog for Education Form */}
      <Dialog open={isDialogOpen && (activeTab === 'formal-education' || activeTab === 'informal-education')} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit" : "Add"} {activeTab === 'formal-education' ? 'Formal Education' : 'Informal Education'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...educationForm}>
            <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-4">
              <FormField
                control={educationForm.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution/School/University</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter institution name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={educationForm.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {activeTab === 'formal-education' ? 'Degree/Level' : 'Certificate/Course Name'}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={activeTab === 'formal-education' ? "e.g., Bachelor's, Master's" : "e.g., Digital Marketing Certificate"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={educationForm.control}
                name="field_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={educationForm.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={educationForm.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <input 
                type="hidden" 
                name="education_type" 
                value={activeTab === 'formal-education' ? 'formal' : 'informal'} 
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Work Experience Form */}
      <Dialog open={isDialogOpen && activeTab === 'working-experience'} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit" : "Add"} Work Experience
            </DialogTitle>
          </DialogHeader>
          
          <Form {...workExperienceForm}>
            <form onSubmit={workExperienceForm.handleSubmit(handleWorkExperienceSubmit)} className="space-y-4">
              <FormField
                control={workExperienceForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={workExperienceForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position/Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={workExperienceForm.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={workExperienceForm.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={workExperienceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of your role and responsibilities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
