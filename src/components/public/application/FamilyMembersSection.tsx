
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface FamilyMember {
  id?: string;
  name: string;
  relationship: string;
  gender: string;
  age: number;
  occupation: string;
  phone: string;
  address: string;
  isEmergencyContact: boolean;
}

interface FamilyMembersSectionProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

export const FamilyMembersSection: React.FC<FamilyMembersSectionProps> = ({ familyMembers, setFamilyMembers }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [currentMember, setCurrentMember] = useState<FamilyMember>({
    name: "",
    relationship: "",
    gender: "",
    age: 0,
    occupation: "",
    phone: "",
    address: "",
    isEmergencyContact: false
  });

  const openAddDialog = () => {
    setCurrentMember({
      name: "",
      relationship: "",
      gender: "",
      age: 0,
      occupation: "",
      phone: "",
      address: "",
      isEmergencyContact: false
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setCurrentMember({ ...familyMembers[index] });
    setEditIndex(index);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!currentMember.name || !currentMember.relationship) {
      return;
    }

    if (isEditing) {
      const updatedMembers = [...familyMembers];
      updatedMembers[editIndex] = currentMember;
      setFamilyMembers(updatedMembers);
    } else {
      setFamilyMembers([...familyMembers, currentMember]);
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Family Members</h3>
          <p className="text-sm text-muted-foreground">Add your family members or emergency contacts.</p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {familyMembers.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead className="hidden md:table-cell">Age</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="text-center">Emergency Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.relationship}</TableCell>
                  <TableCell className="hidden md:table-cell">{member.age}</TableCell>
                  <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                  <TableCell className="text-center">
                    {member.isEmergencyContact ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(index)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(index)}>
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No family members added yet.</p>
          <Button variant="outline" className="mt-4" onClick={openAddDialog}>
            Add Your First Family Member
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"} Family Member</DialogTitle>
            <DialogDescription>
              Enter the details of your family member or emergency contact.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name" className="required">Full Name</Label>
                <Input
                  id="name"
                  value={currentMember.name}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship" className="required">Relationship</Label>
                <Select 
                  value={currentMember.relationship} 
                  onValueChange={(value) => setCurrentMember({ ...currentMember, relationship: value })}
                >
                  <SelectTrigger id="relationship">
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
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={currentMember.gender} 
                  onValueChange={(value) => setCurrentMember({ ...currentMember, gender: value })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={currentMember.age === 0 ? "" : currentMember.age}
                  onChange={(e) => setCurrentMember({ ...currentMember, age: parseInt(e.target.value, 10) || 0 })}
                  placeholder="Enter age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={currentMember.occupation}
                  onChange={(e) => setCurrentMember({ ...currentMember, occupation: e.target.value })}
                  placeholder="Enter occupation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={currentMember.phone}
                  onChange={(e) => setCurrentMember({ ...currentMember, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={currentMember.address}
                  onChange={(e) => setCurrentMember({ ...currentMember, address: e.target.value })}
                  placeholder="Enter address"
                  className="min-h-[80px]"
                />
              </div>

              <div className="col-span-2 flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isEmergencyContact" 
                  checked={currentMember.isEmergencyContact}
                  onCheckedChange={(checked) => 
                    setCurrentMember({ ...currentMember, isEmergencyContact: checked === true })}
                />
                <Label 
                  htmlFor="isEmergencyContact" 
                  className="text-sm font-normal cursor-pointer"
                >
                  This person is an emergency contact
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {isEditing ? "Update" : "Add"} Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
