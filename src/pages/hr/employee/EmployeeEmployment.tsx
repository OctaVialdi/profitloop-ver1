
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useEmployees } from "@/hooks/useEmployees";
import { employeeService } from "@/services/employeeService";

const EmployeeEmployment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("id");
  const { employees, fetchEmployees } = useEmployees();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the employee
  const employee = employees.find(emp => emp.id === employeeId);
  
  // Setup form with default values from employee
  const form = useForm({
    defaultValues: {
      employeeId: employee?.employee_id || '',
      barcode: employee?.employment?.barcode || '',
      organization: employee?.employment?.organization_name || '',
      jobPosition: employee?.employment?.job_position || '',
      jobLevel: employee?.employment?.job_level || '',
      employmentStatus: employee?.employment?.employment_status || 'Permanent',
      branch: employee?.employment?.branch || 'Pusat',
      joinDate: employee?.employment?.join_date || new Date().toISOString().split('T')[0],
      signDate: employee?.employment?.sign_date || new Date().toISOString().split('T')[0]
    }
  });
  
  // Handle save changes
  const onSubmit = async (data: any) => {
    if (!employeeId) return;
    
    setIsSubmitting(true);
    
    try {
      await employeeService.updateEmployeeEmployment(employeeId, {
        employee_id: data.employeeId,
        barcode: data.barcode,
        organization_name: data.organization,
        job_position: data.jobPosition,
        job_level: data.jobLevel,
        employment_status: data.employmentStatus,
        branch: data.branch,
        join_date: data.joinDate,
        sign_date: data.signDate
      });
      
      // Refresh data
      await fetchEmployees();
      navigate(`/my-info/personal?id=${employeeId}`);
    } catch (error) {
      console.error("Error updating employment details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!employee) {
    return (
      <div className="p-6">
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
        <h1 className="text-2xl font-bold">Employment Details</h1>
      </div>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="employmentForm" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Level</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Probation">Probation</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type="date" />
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
                    <FormLabel>Sign Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type="date" />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/my-info/personal?id=${employeeId}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeEmployment;
