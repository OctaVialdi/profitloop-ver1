
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Edit, CalendarIcon, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LegacyEmployee, EmployeeIdentityAddress } from "@/hooks/useEmployees";
import { updateEmployeeIdentityAddress } from "@/services/employeeService";

interface IdentityAddressSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const IdentityAddressSection: React.FC<IdentityAddressSectionProps> = ({
  employee,
  handleEdit
}) => {
  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formValues, setFormValues] = useState({
    nik: employee.nik || "",
    passportNumber: employee.passportNumber || "",
    postalCode: employee.postalCode || "",
    citizenAddress: employee.citizenAddress || "",
    residentialAddress: employee.address || ""
  });

  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(
    employee.passportExpiry ? new Date(employee.passportExpiry) : undefined
  );
  
  const [useResidentialAddress, setUseResidentialAddress] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleUseResidentialAddress = (checked: boolean) => {
    setUseResidentialAddress(checked);
    if (checked && formValues.citizenAddress) {
      setFormValues(prev => ({ ...prev, residentialAddress: formValues.citizenAddress }));
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form values
      setFormValues({
        nik: employee.nik || "",
        passportNumber: employee.passportNumber || "",
        postalCode: employee.postalCode || "",
        citizenAddress: employee.citizenAddress || "",
        residentialAddress: employee.address || ""
      });
      setPassportExpiry(employee.passportExpiry ? new Date(employee.passportExpiry) : undefined);
      setUseResidentialAddress(false);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const updatedData: Partial<EmployeeIdentityAddress> = {
        nik: formValues.nik,
        passport_number: formValues.passportNumber,
        passport_expiry: passportExpiry ? format(passportExpiry, 'yyyy-MM-dd') : null,
        postal_code: formValues.postalCode,
        citizen_address: formValues.citizenAddress,
        residential_address: formValues.residentialAddress
      };
      
      await updateEmployeeIdentityAddress(employee.id, updatedData);
      
      toast.success("Identity and address information updated successfully");
      setIsEditing(false);
      // Refresh data
      handleEdit("refresh");
    } catch (error) {
      console.error("Failed to update identity and address:", error);
      toast.error("Failed to update identity and address information");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Identity & Address</h2>
        </div>
        
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
                  <Label htmlFor="nik">NIK (16 digit)</Label>
                  <Input
                    id="nik"
                    value={formValues.nik}
                    onChange={handleInputChange}
                    placeholder="Enter NIK"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport number</Label>
                  <Input
                    id="passportNumber"
                    value={formValues.passportNumber}
                    onChange={handleInputChange}
                    placeholder="Enter passport number"
                  />
                </div>
              
                <div className="space-y-2">
                  <Label>Passport expiry date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !passportExpiry && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {passportExpiry ? format(passportExpiry, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={passportExpiry}
                        onSelect={setPassportExpiry}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input
                    id="postalCode"
                    value={formValues.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citizenAddress">Citizen ID address</Label>
                <Input
                  id="citizenAddress"
                  value={formValues.citizenAddress}
                  onChange={handleInputChange}
                  placeholder="Enter citizen ID address"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useResidentialAddress" 
                  checked={useResidentialAddress} 
                  onCheckedChange={handleUseResidentialAddress}
                />
                <Label htmlFor="useResidentialAddress" className="font-normal cursor-pointer">
                  Use citizen ID address as residential address
                </Label>
              </div>
              
              {!useResidentialAddress && (
                <div className="space-y-2">
                  <Label htmlFor="residentialAddress">Residential address</Label>
                  <Input
                    id="residentialAddress"
                    value={formValues.residentialAddress}
                    onChange={handleInputChange}
                    placeholder="Enter residential address"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">NIK (16 digit)</p>
                  <p className="font-medium">{employee.nik || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passport number</p>
                  <p className="font-medium">{employee.passportNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passport expiration date</p>
                  <p className="font-medium">{employee.passportExpiry || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Postal code</p>
                  <p className="font-medium">{employee.postalCode || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Citizen ID address</p>
                  <p className="font-medium">{employee.citizenAddress || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Residential address</p>
                  <p className="font-medium">{employee.address || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
