import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/useEmployees";
import { SBUItem } from "./employee/types";

// Define form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  employeeId: z.string().min(3, {
    message: "Employee ID must be at least 3 characters.",
  }),
  groupStructure: z.string().optional(),
  employmentStatus: z.string().optional(),
  branch: z.string().optional(),
  organization: z.string().optional(),
  jobPosition: z.string().optional(),
  jobLevel: z.string().optional(),
  grade: z.string().optional(),
  class: z.string().optional(),
  schedule: z.string().optional(),
  approvalLine: z.string().optional(),
  manager: z.string().optional(),
});

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const { addEmployee } = useEmployees();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      employeeId: "",
      groupStructure: "",
      employmentStatus: "",
      branch: "",
      organization: "",
      jobPosition: "",
      jobLevel: "",
      grade: "",
      class: "",
      schedule: "",
      approvalLine: "",
      manager: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { name, email, employeeId } = data;
      const newEmployee = await addEmployee({ 
        name, 
        email, 
        employee_id: employeeId,
        ...data 
      });

      if (newEmployee) {
        toast.success("Employee created successfully!");
        navigate("/hr/data");
      } else {
        toast.error("Failed to create employee.");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee.");
    }
  };

  const handleCancel = () => {
    navigate("/hr/data");
  };

  const sbuItems: SBUItem[] = [
    { group: "Group 1", name: "SBU 1" },
    { group: "Group 1", name: "SBU 2" },
    { group: "Group 2", name: "SBU 3" },
    { group: "Group 2", name: "SBU 4" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate("/hr/data")}
        >
          <ArrowLeft size={16} />
          <span>Back to Employee List</span>
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Add Employee</h1>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="employment" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2"
          >
            Employment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-6">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter employee's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter employee's email" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="Enter employee's ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Employee</Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="pt-6">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="groupStructure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Structure</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group structure" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sbuItems.map((item, index) => (
                              <SelectItem key={index} value={item.name}>
                                {item.name} ({item.group})
                              </SelectItem>
                            ))}
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
                        <FormLabel>Employment Status</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter employment status" {...field} />
                        </FormControl>
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
                          <Input placeholder="Enter branch" {...field} />
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

                  <FormField
                    control={form.control}
                    name="jobPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter job position" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="Enter job level" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter schedule" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="approvalLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approval Line</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter approval line" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Employee</Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddEmployee;
