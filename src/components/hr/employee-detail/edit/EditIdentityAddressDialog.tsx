
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LegacyEmployee, EmployeeIdentityAddress } from "@/hooks/useEmployees";
import { updateEmployeeIdentityAddress } from "@/services/employeeService";

interface EditIdentityAddressDialogProps {
  open: boolean;
  employee: LegacyEmployee;
  onClose: () => void;
  onSave: () => void;
}

export const EditIdentityAddressDialog = ({
  open,
  employee,
  onClose,
  onSave
}: EditIdentityAddressDialogProps) => {
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
  const [isLoading, setIsLoading] = useState(false);

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
      onSave();
    } catch (error) {
      console.error("Failed to update identity and address:", error);
      toast.error("Failed to update identity and address information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Identity & Address</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Passport expiry date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
