import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Plus, Loader2, Check, X, Trash2, Phone, MapPin, UserIcon } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EmployeeFamily, getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from "@/services/employeeService";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { Badge } from "@/components/ui/badge";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<EmployeeFamily | null>(null);
  const [familyMembers, setFamilyMembers] = useState<EmployeeFamily[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Form state
  const [formValues, setFormValues] = useState({
    name: "",
    relationship: "spouse",
    age: "",
    occupation: "",
    phone: "",
    address: "",
    gender: "",
    isEmergencyContact: false
  });

  useEffect(() => {
    loadFamilyMembers();
  }, [employee.id]);

  const loadFamilyMembers = async () => {
    setIsDataLoading(true);
    try {
      const data = await getFamilyMembers(employee.id);
      setFamilyMembers(data);
    } catch (error) {
      console.error("Failed to load family members:", error);
      toast.error("Failed to load family members");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormValues(prev => ({ ...prev, isEmergencyContact: checked }));
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      relationship: "spouse",
      age: "",
      occupation: "",
      phone: "",
      address: "",
      gender: "",
      isEmergencyContact: false
    });
    setSelectedMember(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (member: EmployeeFamily) => {
    setSelectedMember(member);
    setFormValues({
      name: member.name || "",
      relationship: member.relationship || "spouse",
      age: member.age?.toString() || "",
      occupation: member.occupation || "",
      phone: member.phone || "",
      address: member.address || "",
      gender: member.gender || "",
      isEmergencyContact: member.is_emergency_contact || false
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member: EmployeeFamily) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formValues.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsLoading(true);
    try {
      const familyData: EmployeeFamily = {
        employee_id: employee.id,
        name: formValues.name,
        relationship: formValues.relationship || null,
        age: formValues.age ? parseInt(formValues.age, 10) : null,
        occupation: formValues.occupation || null,
        phone: formValues.phone || null,
        address: formValues.address || null,
        gender: formValues.gender || null,
        is_emergency_contact: formValues.isEmergencyContact
      };

      const result = await addFamilyMember(familyData);
      
      if (result) {
        setFamilyMembers([result, ...familyMembers]);
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
      const updatedData: Partial<EmployeeFamily> = {
        name: formValues.name,
        relationship: formValues.relationship || null,
        age: formValues.age ? parseInt(formValues.age, 10) : null,
        occupation: formValues.occupation || null,
        phone: formValues.phone || null,
        address: formValues.address || null,
        gender: formValues.gender || null,
        is_emergency_contact: formValues.isEmergencyContact
      };

      const result = await updateFamilyMember(selectedMember.id!, updatedData);
      
      if (result) {
        setFamilyMembers(familyMembers.map(member => 
          member.id === selectedMember.id ? result : member
        ));
        toast.success("Family member updated successfully");
        setIsEditDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to update family member:", error);
      toast.error("Failed to update family member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    setIsLoading(true);
    try {
      const success = await deleteFamilyMember(selectedMember.id!);
      
      if (success) {
        setFamilyMembers(familyMembers.filter(member => member.id !== selectedMember.id));
        toast.success("Family member deleted successfully");
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete family member:", error);
      toast.error("Failed to delete family member");
    } finally {
      setIsLoading(false);
    }
  };

  // Common dialog form for both add and edit
  const renderDialogForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name *</Label>
          <Input
            id="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Label>Gender</Label>
          <Select
            value={formValues.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formValues.age}
            onChange={handleInputChange}
            placeholder="Enter age"
          />
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

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          value={formValues.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formValues.address}
          onChange={handleInputChange}
          placeholder="Enter address"
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="isEmergencyContact" 
          checked={formValues.isEmergencyContact} 
          onCheckedChange={handleCheckboxChange} 
        />
        <Label htmlFor="isEmergencyContact" className="text-sm font-normal">
          Emergency Contact
        </Label>
      </div>
    </div>
  );

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Family Members</h2>
          <Button 
            onClick={openAddDialog} 
            className="gap-1 flex items-center"
            size="sm"
          >
            <Plus size={14} /> Add family member
          </Button>
        </div>
        
        <div>
          {isDataLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : familyMembers.length === 0 ? (
            <EmptyDataDisplay 
              title="No family members found" 
              description="Add family members to see them here" 
              buttonText="Add family member" 
              onClick={openAddDialog}
            />
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familyMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{member.name}</span>
                          {member.is_emergency_contact && (
                            <Badge variant="secondary" className="mt-1 w-fit">Emergency Contact</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{member.relationship}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{member.occupation}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openEditDialog(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openDeleteDialog(member)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add family member dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          
          {renderDialogForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit family member dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Family Member</DialogTitle>
          </DialogHeader>
          
          {renderDialogForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Family Member</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete this family member?</p>
            <p className="font-semibold mt-2">{selectedMember?.name}</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
