
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Plus, Loader2, Check, X, Trash2 } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { employeeService, EmployeeFamily } from "@/services/employeeService";
import { EmptyDataDisplay } from "./EmptyDataDisplay";

interface FamilySectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const FamilySection: React.FC<FamilySectionProps> = ({
  employee,
  handleEdit
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<EmployeeFamily | null>(null);
  
  // For demonstration, let's create a dummy family members array
  // In a real application, this would come from the API
  const [familyMembers, setFamilyMembers] = useState<EmployeeFamily[]>([
    // This is just sample data, in a real app this would be fetched from the backend
  ]);

  // Form state
  const [formValues, setFormValues] = useState({
    name: "",
    relationship: "spouse",
    occupation: "",
  });
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      relationship: "spouse",
      occupation: "",
    });
    setBirthDate(undefined);
    setSelectedMember(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (member: EmployeeFamily) => {
    setSelectedMember(member);
    setFormValues({
      name: member.name,
      relationship: member.relationship || "spouse",
      occupation: member.occupation || "",
    });
    setBirthDate(member.birth_date ? new Date(member.birth_date) : undefined);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formValues.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsLoading(true);
    try {
      const familyData = {
        employee_id: employee.id,
        name: formValues.name,
        relationship: formValues.relationship,
        birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
        occupation: formValues.occupation || null
      };

      // This is a placeholder - in a real app, you would call the API
      const result = await employeeService.saveFamilyMember(familyData);
      
      if (result) {
        // Update the local state with the new family member
        setFamilyMembers([...familyMembers, result]);
        toast.success("Family member added successfully");
        setIsAddDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to add family member:", error);
      toast.error("Failed to add family member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedMember || !formValues.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        ...selectedMember,
        name: formValues.name,
        relationship: formValues.relationship,
        birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
        occupation: formValues.occupation || null
      };

      // This is a placeholder - in a real app, you would call the API
      // For now we just update the local state
      const updatedMembers = familyMembers.map(member => 
        member.id === selectedMember.id ? updatedData : member
      );
      
      setFamilyMembers(updatedMembers);
      toast.success("Family member updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to update family member:", error);
      toast.error("Failed to update family member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      // This is a placeholder - in a real app, you would call the API
      // For now we just update the local state
      const updatedMembers = familyMembers.filter(member => member.id !== id);
      setFamilyMembers(updatedMembers);
      toast.success("Family member removed successfully");
    } catch (error) {
      console.error("Failed to remove family member:", error);
      toast.error("Failed to remove family member");
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Family Members</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 flex items-center"
            onClick={openAddDialog}
          >
            <Plus size={16} /> Add Family Member
          </Button>
        </div>
        
        {familyMembers.length === 0 ? (
          <EmptyDataDisplay 
            title="No family members" 
            description="Add family members to keep track of employee dependents" 
            actionLabel="Add Family Member"
            onAction={openAddDialog}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.relationship || "-"}</TableCell>
                  <TableCell>{member.birth_date || "-"}</TableCell>
                  <TableCell>{member.occupation || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit size={16} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Family Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Select
                value={formValues.relationship}
                onValueChange={(value) => handleSelectChange("relationship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Birth date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    {birthDate ? format(birthDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formValues.occupation}
                onChange={handleInputChange}
                placeholder="Enter occupation"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Family Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Family Member</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Select
                value={formValues.relationship}
                onValueChange={(value) => handleSelectChange("relationship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Birth date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    {birthDate ? format(birthDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formValues.occupation}
                onChange={handleInputChange}
                placeholder="Enter occupation"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
