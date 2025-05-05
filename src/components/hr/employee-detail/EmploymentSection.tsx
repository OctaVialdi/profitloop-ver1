
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Edit, CalendarIcon, Loader2, Check, X } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { updateEmployeeEmployment, getEmployeeEmploymentData, createOrUpdateEmployeeEmployment } from "@/services/employeeService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmploymentSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  employee,
  handleEdit
}) => {
  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employmentData, setEmploymentData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Form state
  const [formValues, setFormValues] = useState({
    member_id: "",
    barcode: "",
    company_name: "PT CHEMISTRY BEAUTY INDONESIA",
    organization_name: "",
    jobPosition: "",
    jobLevel: "",
    employmentStatus: "",
    branch: "",
  });

  const [joinDate, setJoinDate] = useState<Date | undefined>(undefined);
  const [signDate, setSignDate] = useState<Date | undefined>(undefined);

  // Fetch employment data
  useEffect(() => {
    const fetchEmploymentData = async () => {
      setIsLoadingData(true);
      try {
        const data = await getEmployeeEmploymentData(employee.id);
        if (data) {
          setEmploymentData(data);
          setFormValues({
            member_id: data.member_id || "",
            barcode: data.barcode || "",
            company_name: data.company_name || "PT CHEMISTRY BEAUTY INDONESIA",
            organization_name: data.organization_name || "",
            jobPosition: data.job_position || "",
            jobLevel: data.job_level || "",
            employmentStatus: data.employment_status || "",
            branch: data.branch || "",
          });
          setJoinDate(data.join_date ? new Date(data.join_date) : undefined);
          setSignDate(data.sign_date ? new Date(data.sign_date) : undefined);
        }
      } catch (error) {
        console.error("Error fetching employment data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (employee && employee.id) {
      fetchEmploymentData();
    }
  }, [employee]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form values
      if (employmentData) {
        setFormValues({
          member_id: employmentData.member_id || "",
          barcode: employmentData.barcode || "",
          company_name: employmentData.company_name || "PT CHEMISTRY BEAUTY INDONESIA",
          organization_name: employmentData.organization_name || "",
          jobPosition: employmentData.job_position || "",
          jobLevel: employmentData.job_level || "",
          employmentStatus: employmentData.employment_status || "",
          branch: employmentData.branch || "",
        });
        setJoinDate(employmentData.join_date ? new Date(employmentData.join_date) : undefined);
        setSignDate(employmentData.sign_date ? new Date(employmentData.sign_date) : undefined);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Prepare data for API call
      const updatedData = {
        barcode: formValues.barcode,
        company_name: formValues.company_name,
        organization_name: formValues.organization_name,
        job_position: formValues.jobPosition,
        job_level: formValues.jobLevel,
        employment_status: formValues.employmentStatus,
        branch: formValues.branch,
        join_date: joinDate ? format(joinDate, 'yyyy-MM-dd') : null,
        sign_date: signDate ? format(signDate, 'yyyy-MM-dd') : null
      };
      
      // Use our service function to update employment data
      const success = await createOrUpdateEmployeeEmployment(employee.id, updatedData);
      
      if (success) {
        toast.success("Employment data updated successfully");
        setIsEditing(false);
        // Refresh data
        const updatedData = await getEmployeeEmploymentData(employee.id);
        if (updatedData) {
          setEmploymentData(updatedData);
        }
      } else {
        toast.error("Failed to update employment data");
      }
    } catch (error) {
      console.error("Failed to update employment data:", error);
      toast.error("Failed to update employment data");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoadingData) {
    return (
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Employment</h2>
          </div>
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </Card>
    );
  }
  
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
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 flex items-center"
                    onClick={toggleEditMode}
                    disabled={isLoading}
                  >
                    <X size={14} /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="gap-1 flex items-center"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Save
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2 flex items-center"
                  onClick={toggleEditMode}
                >
                  <Edit size={14} /> Edit
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="p-4 space-y-5">
                {/* Editing Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member_id">Member ID</Label>
                    <Input
                      id="member_id"
                      value={formValues.member_id}
                      readOnly
                      disabled
                      className="bg-gray-100"
                      placeholder="Auto-generated"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formValues.barcode}
                      onChange={handleInputChange}
                      placeholder="Enter barcode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company name</Label>
                    <Input
                      id="company_name"
                      value={formValues.company_name}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization_name">Organization name</Label>
                    <Input
                      id="organization_name"
                      value={formValues.organization_name}
                      onChange={handleInputChange}
                      placeholder="Enter organization name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobPosition">Job position</Label>
                    <Input
                      id="jobPosition"
                      value={formValues.jobPosition}
                      onChange={handleInputChange}
                      placeholder="Enter job position"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobLevel">Job level</Label>
                    <Input
                      id="jobLevel"
                      value={formValues.jobLevel}
                      onChange={handleInputChange}
                      placeholder="Enter job level"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Employment status</Label>
                    <Select
                      value={formValues.employmentStatus}
                      onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Probation">Probation</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={formValues.branch}
                      onChange={handleInputChange}
                      placeholder="Enter branch"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Join date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left",
                            !joinDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {joinDate ? format(joinDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={joinDate}
                          onSelect={setJoinDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sign date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left",
                            !signDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {signDate ? format(signDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={signDate}
                          onSelect={setSignDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Company name</p>
                    <p className="font-medium">{employmentData?.company_name || "PT CHEMISTRY BEAUTY INDONESIA"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member ID</p>
                    <p className="font-medium">{employmentData?.member_id || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Barcode</p>
                    <p className="font-medium">{employmentData?.barcode || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organization name</p>
                    <p className="font-medium">{employmentData?.organization_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job position</p>
                    <p className="font-medium">{employmentData?.job_position || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job level</p>
                    <p className="font-medium">{employmentData?.job_level || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employment status</p>
                    <p className="font-medium">{employmentData?.employment_status || "Permanent"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium">{employmentData?.branch || "Pusat"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Join date</p>
                    <p className="font-medium">
                      {employmentData?.join_date || "-"}
                      {employmentData?.join_date && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">14 Year 5 Month 24 Day</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sign date</p>
                    <p className="font-medium">{employmentData?.sign_date || "-"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
