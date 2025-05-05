
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Employee, 
  employeeService, 
  getEmployeeEmploymentData, 
  createOrUpdateEmployeeEmployment, 
  EmployeeEmploymentData 
} from "@/services/employeeService";

export default function EmploymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("id");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up form
  const form = useForm({
    defaultValues: {
      company_name: "PT CHEMISTRY BEAUTY INDONESIA",
      barcode: "",
      organization_name: "",
      job_position: "",
      job_level: "",
      employment_status: "Permanent",
      branch: "Pusat",
      join_date: new Date().toISOString().split('T')[0],
      sign_date: new Date().toISOString().split('T')[0]
    }
  });
  
  // Fetch employee and employment data
  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) return;
      
      setLoading(true);
      try {
        // Fetch employee data
        const employeeData = await employeeService.fetchEmployeeById(employeeId);
        if (employeeData) {
          setEmployee(employeeData);
          
          // Fetch employment data
          const employmentData = await getEmployeeEmploymentData(employeeId);
          
          // Set form values from employment data or employee data for backwards compatibility
          form.reset({
            company_name: "PT CHEMISTRY BEAUTY INDONESIA",
            barcode: employmentData?.barcode || employeeData.barcode || "",
            organization_name: employmentData?.organization_name || employeeData.organization_id || "",
            job_position: employmentData?.job_position || employeeData.job_position || "",
            job_level: employmentData?.job_level || employeeData.job_level || "",
            employment_status: employmentData?.employment_status || employeeData.employment_status || "Permanent",
            branch: employmentData?.branch || employeeData.branch || "Pusat",
            join_date: employmentData?.join_date || employeeData.join_date || new Date().toISOString().split('T')[0],
            sign_date: employmentData?.sign_date || employeeData.sign_date || new Date().toISOString().split('T')[0]
          });
        } else {
          toast.error("Employee not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId, form]);
  
  // Handle form submission
  const onSubmit = async (data: any) => {
    if (!employeeId) return;
    
    setIsSubmitting(true);
    
    try {
      // Create employment data object
      const employmentData: EmployeeEmploymentData = {
        employee_id: employeeId,
        company_name: data.company_name,
        barcode: data.barcode,
        organization_name: data.organization_name,
        job_position: data.job_position,
        job_level: data.job_level,
        employment_status: data.employment_status,
        branch: data.branch,
        join_date: data.join_date,
        sign_date: data.sign_date
      };
      
      // Save to new employment table
      await createOrUpdateEmployeeEmployment(employmentData);
      
      toast.success("Employment data saved successfully");
      navigate(`/my-info/employment?id=${employeeId}`);
    } catch (error) {
      console.error("Error saving employment data:", error);
      toast.error("Failed to save employment data");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">Employment Details</h1>
      </div>
      
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
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
                name="organization_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="job_position"
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
                name="job_level"
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
                name="employment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="join_date"
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
                name="sign_date"
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
}
