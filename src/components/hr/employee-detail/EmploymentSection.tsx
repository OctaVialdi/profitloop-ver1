
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Check, X } from "lucide-react";
import { LegacyEmployee, useEmployees } from "@/hooks/useEmployees";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
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
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface EmploymentSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

const employmentSchema = z.object({
  barcode: z.string().optional(),
  organization: z.string().optional(),
  job_position: z.string().optional(),
  job_level: z.string().optional(),
  employment_status: z.string().optional(),
  branch: z.string().optional(),
  join_date: z.string().optional(),
  sign_date: z.string().optional(),
});

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateEmploymentDetails } = useEmployees();

  // Define the form
  const form = useForm<z.infer<typeof employmentSchema>>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      barcode: employee.barcode || "",
      organization: employee.organization || "",
      job_position: employee.jobPosition || "",
      job_level: employee.jobLevel || "",
      employment_status: employee.employmentStatus || "Permanent",
      branch: employee.branch || "Pusat",
      join_date: employee.joinDate ? format(new Date(employee.joinDate), 'yyyy-MM-dd') : "",
      sign_date: employee.signDate ? format(new Date(employee.signDate), 'yyyy-MM-dd') : "",
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof employmentSchema>) => {
    setIsLoading(true);
    try {
      await updateEmploymentDetails(employee.id, data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating employment details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate tenure based on join date
  const calculateTenure = (joinDate: string | null | undefined) => {
    if (!joinDate) return null;
    
    try {
      const startDate = new Date(joinDate);
      const now = new Date();
      
      const years = now.getFullYear() - startDate.getFullYear();
      const months = now.getMonth() - startDate.getMonth();
      const days = now.getDate() - startDate.getDate();
      
      let yearDiff = years;
      let monthDiff = months;
      let dayDiff = days;
      
      if (days < 0) {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        dayDiff = days + lastMonthDate;
        monthDiff--;
      }
      
      if (monthDiff < 0) {
        monthDiff += 12;
        yearDiff--;
      }
      
      return `${yearDiff} Year${yearDiff !== 1 ? 's' : ''} ${monthDiff} Month${monthDiff !== 1 ? 's' : ''} ${dayDiff} Day${dayDiff !== 1 ? 's' : ''}`;
    } catch (error) {
      return null;
    }
  };

  const employmentStatusOptions = [
    "Permanent",
    "Contract",
    "Probation",
    "Internship",
    "Part-time",
    "Outsourced",
  ];

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Employment</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Employment data</h3>
          <p className="text-sm text-gray-500 mb-4">Your data information related to company.</p>
          
          <div className="border rounded-md">
            <div className="flex justify-between items-center p-3 border-b">
              <div></div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2 flex items-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit size={14} /> Edit
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Company name</p>
                  <p className="font-medium">PT CHEMISTRY BEAUTY INDONESIA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{employee.employeeId || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Barcode</p>
                  <p className="font-medium">{employee.barcode || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organization name</p>
                  <p className="font-medium">{employee.organization || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job position</p>
                  <p className="font-medium">{employee.jobPosition || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job level</p>
                  <p className="font-medium">{employee.jobLevel || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment status</p>
                  <p className="font-medium">{employee.employmentStatus || "Permanent"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{employee.branch || "Pusat"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join date</p>
                  <p className="font-medium">
                    {employee.joinDate || "-"}
                    {employee.joinDate && calculateTenure(employee.joinDate) && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                        {calculateTenure(employee.joinDate)}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sign date</p>
                  <p className="font-medium">{employee.signDate || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employment Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employment Information</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barcode" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="Enter organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="job_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="e.g., Senior, Junior" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status</FormLabel>
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
                          {employmentStatusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                        <Input placeholder="e.g., Pusat, Jakarta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="join_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Join Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
