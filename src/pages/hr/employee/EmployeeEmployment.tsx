
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEmployees } from "@/hooks/useEmployees";
import { employeeService } from "@/services/employeeService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

const EmployeeEmployment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateEmployee } = useEmployees();

  // Find the employee with the matching ID
  const employee = employees.find(emp => emp.id === id);

  // Setup form with default values from employee data
  const form = useForm({
    defaultValues: {
      companyName: "PT CHEMISTRY BEAUTY INDONESIA",
      employeeId: employee?.employee_id || '',
      barcode: employee?.employment?.barcode || '',
      organization: employee?.employment?.organization || '',
      jobPosition: employee?.employment?.job_position || '',
      jobLevel: employee?.employment?.job_level || '',
      employmentStatus: employee?.employment?.employment_status || 'Permanent',
      branch: employee?.employment?.branch || 'Pusat',
      joinDate: employee?.employment?.join_date || '',
      signDate: employee?.employment?.sign_date || '',
      grade: '',
      class: '',
      approvalLine: 'No approval line',
      isManager: false,
      manager: 'No manager',
    }
  });

  // Handle save changes
  const onSubmit = (data: any) => {
    // Update employee data
    if (employee && id) {
      // Update base employee data
      const baseUpdate = {
        id: id,
        employee_id: data.employeeId
      };

      // Update employment data separately
      const employmentData = {
        employee_id: id,
        barcode: data.barcode,
        organization: data.organization,
        job_position: data.jobPosition,
        job_level: data.jobLevel,
        employment_status: data.employmentStatus,
        branch: data.branch,
        join_date: data.joinDate,
        sign_date: data.signDate
      };
      
      // First update the base employee data
      updateEmployee(baseUpdate)
        .then(() => {
          // Then update the employment data
          return employeeService.updateEmployeeEmployment(id, employmentData);
        })
        .then(() => {
          toast.success("Employment data updated successfully");
          navigate(`/hr/data/employee/${id}`);
        })
        .catch(error => {
          console.error("Error updating employee:", error);
          toast.error("Failed to update employment data");
        });
    }
  };

  const handleCancel = () => {
    navigate(`/hr/data/employee/${id}`);
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate(`/hr/data/employee/${id}`)}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee Details</span>
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Employment</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Employment data</h3>
            <p className="text-sm text-gray-500 mb-4">Your data information related to company.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization name *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job position *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Developer">Developer</SelectItem>
                          <SelectItem value="Designer">Designer</SelectItem>
                          <SelectItem value="HR Officer">HR Officer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Permanent">Permanent</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Probation">Probation</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pusat">Pusat</SelectItem>
                          <SelectItem value="Branch 1">Branch 1</SelectItem>
                          <SelectItem value="Branch 2">Branch 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Join date *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="signDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sign date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Grade 1">Grade 1</SelectItem>
                          <SelectItem value="Grade 2">Grade 2</SelectItem>
                          <SelectItem value="Grade 3">Grade 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Class 1">Class 1</SelectItem>
                          <SelectItem value="Class 2">Class 2</SelectItem>
                          <SelectItem value="Class 3">Class 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="approvalLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approval line</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select approval line" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="No approval line">No approval line</SelectItem>
                          <SelectItem value="Line 1">Line 1</SelectItem>
                          <SelectItem value="Line 2">Line 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isManager"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as manager</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="No manager">No manager</SelectItem>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
      
      <Card className="p-6">
        <Tabs defaultValue="approval-line">
          <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
            <TabsTrigger 
              value="approval-line" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            >
              Approval line
            </TabsTrigger>
            <TabsTrigger 
              value="manager" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
            >
              Manager
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="approval-line" className="pt-6">
            <div className="text-center py-8">
              <p>Employee doesn't have direct reports</p>
            </div>
          </TabsContent>
          
          <TabsContent value="manager" className="pt-6">
            <div className="text-center py-8">
              <p>No manager assigned</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EmployeeEmployment;
