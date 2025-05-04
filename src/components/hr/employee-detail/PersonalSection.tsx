import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { LegacyEmployee } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { employeeService } from "@/services/employeeService";

interface PersonalSectionProps {
  employee: LegacyEmployee;
  handleEdit: (section: string) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  employee,
  handleEdit
}) => {
  const [editMode, setEditMode] = useState<string | null>(null); // null, "basic-info", "identity"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [familyLoading, setFamilyLoading] = useState(true);
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [currentFamily, setCurrentFamily] = useState<any>(null);
  
  // Form state for personal info
  const [personalInfo, setPersonalInfo] = useState({
    fullName: employee.name || "",
    mobilePhone: employee.mobilePhone || "",
    email: employee.email || "",
    phone: employee.phone || "",
    birthPlace: employee.birthPlace || "",
    birthDate: employee.birthDate || "",
    gender: employee.gender || "",
    maritalStatus: employee.maritalStatus || "",
    bloodType: employee.bloodType || "",
    religion: employee.religion || ""
  });
  
  // Form state for identity info
  const [identityInfo, setIdentityInfo] = useState({
    nik: "",
    passportNumber: "",
    passportExpiry: "",
    postalCode: "",
    citizenAddress: "",
    residentialAddress: employee.address || ""
  });
  
  // Form state for family member
  const [familyMember, setFamilyMember] = useState({
    name: "",
    relationship: "",
    birthDate: "",
    phone: "",
    occupation: ""
  });
  
  const toggleEditMode = (section: string) => {
    if (editMode === section) {
      setEditMode(null);
    } else {
      setEditMode(section);
    }
  };
  
  // Load family members on tab change
  const handleTabChange = (value: string) => {
    if (value === "family" && familyLoading) {
      loadFamilyMembers();
    }
  };
  
  const loadFamilyMembers = async () => {
    try {
      setFamilyLoading(true);
      if (!employee.id) return;
      
      const members = await employeeService.fetchFamilyMembers(employee.id);
      setFamilyMembers(members);
    } catch (error) {
      console.error("Error loading family members:", error);
      toast.error("Failed to load family members");
    } finally {
      setFamilyLoading(false);
    }
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleIdentityInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setIdentityInfo(prev => ({ ...prev, [id]: value }));
  };
  
  const handleFamilyMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFamilyMember(prev => ({ ...prev, [id]: value }));
  };
  
  const handleFamilyRelationshipChange = (value: string) => {
    setFamilyMember(prev => ({ ...prev, relationship: value }));
  };
  
  const savePersonalInfo = async () => {
    try {
      if (!employee.id) return;
      
      setIsSubmitting(true);
      
      // Split full name into first and last name
      const nameParts = personalInfo.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ");
      
      // Prepare data for update
      const baseUpdate = {
        id: employee.id,
        name: personalInfo.fullName,
        email: personalInfo.email,
      };
      
      const personalData = {
        employee_id: employee.id,
        mobile_phone: personalInfo.mobilePhone,
        birth_place: personalInfo.birthPlace,
        birth_date: personalInfo.birthDate,
        gender: personalInfo.gender,
        marital_status: personalInfo.maritalStatus,
        blood_type: personalInfo.bloodType,
        religion: personalInfo.religion
      };
      
      // Update employee data
      await employeeService.updateEmployee(employee.id, baseUpdate);
      const result = await employeeService.updateEmployeePersonalDetails(employee.id, personalData);
      
      toast.success("Personal information updated successfully");
      setEditMode(null);
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error("Failed to update personal information");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const saveIdentityInfo = async () => {
    try {
      if (!employee.id) return;
      
      setIsSubmitting(true);
      
      // Prepare data for update
      const addressData = {
        employee_id: employee.id,
        nik: identityInfo.nik,
        passport_number: identityInfo.passportNumber,
        passport_expiry: identityInfo.passportExpiry,
        postal_code: identityInfo.postalCode,
        citizen_address: identityInfo.citizenAddress,
        residential_address: identityInfo.residentialAddress
      };
      
      // Update identity address data
      const result = await employeeService.updateEmployeeIdentityAddress(employee.id, addressData);
      
      toast.success("Identity information updated successfully");
      setEditMode(null);
    } catch (error) {
      console.error("Error updating identity info:", error);
      toast.error("Failed to update identity information");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openFamilyDialog = (member?: any) => {
    if (member) {
      setCurrentFamily(member);
      setFamilyMember({
        name: member.name || "",
        relationship: member.relationship || "",
        birthDate: member.birth_date || "",
        phone: member.phone || "",
        occupation: member.occupation || ""
      });
    } else {
      setCurrentFamily(null);
      setFamilyMember({
        name: "",
        relationship: "",
        birthDate: "",
        phone: "",
        occupation: ""
      });
    }
    setShowFamilyDialog(true);
  };
  
  const saveFamilyMember = async () => {
    try {
      if (!employee.id) return;
      
      setIsSubmitting(true);
      
      // Prepare family member data
      const familyData = {
        id: currentFamily?.id,
        employee_id: employee.id,
        name: familyMember.name,
        relationship: familyMember.relationship,
        birth_date: familyMember.birthDate,
        phone: familyMember.phone,
        occupation: familyMember.occupation
      };
      
      // Save family member
      await employeeService.saveFamilyMember(familyData);
      
      // Reload family members
      await loadFamilyMembers();
      
      toast.success(`Family member ${currentFamily ? 'updated' : 'added'} successfully`);
      setShowFamilyDialog(false);
    } catch (error) {
      console.error("Error saving family member:", error);
      toast.error("Failed to save family member");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteFamilyMember = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      // Delete family member
      await employeeService.deleteFamilyMember(id);
      
      // Reload family members
      await loadFamilyMembers();
      
      toast.success("Family member removed successfully");
    } catch (error) {
      console.error("Error deleting family member:", error);
      toast.error("Failed to delete family member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Personal</h2>
        </div>

        <Tabs defaultValue="basic-info" onValueChange={handleTabChange}>
          <TabsList className="border-b w-full justify-start rounded-none space-x-6 px-0">
            <TabsTrigger value="basic-info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Basic info
            </TabsTrigger>
            <TabsTrigger value="family" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none pb-2">
              Family
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Personal data</h3>
                <p className="text-sm text-gray-500 mb-4">Your email address is your identity on Talenta and is used to log in.</p>
                
                <div className="border rounded-md">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div></div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 flex items-center"
                      onClick={() => toggleEditMode("basic-info")}
                    >
                      {editMode === "basic-info" ? (
                        <>
                          <X size={14} /> Cancel
                        </>
                      ) : (
                        <>
                          <Edit size={14} /> Edit
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editMode === "basic-info" ? (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="fullName">Full name</label>
                          <Input 
                            id="fullName" 
                            value={personalInfo.fullName} 
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="mobilePhone">Mobile phone</label>
                          <Input 
                            id="mobilePhone" 
                            value={personalInfo.mobilePhone} 
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="email">Email</label>
                          <Input 
                            id="email" 
                            value={personalInfo.email} 
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="phone">Phone</label>
                          <Input 
                            id="phone" 
                            value={personalInfo.phone} 
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="birthPlace">Place of birth</label>
                          <Input 
                            id="birthPlace" 
                            value={personalInfo.birthPlace} 
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="birthDate">Birthdate</label>
                          <Input 
                            id="birthDate" 
                            value={personalInfo.birthDate} 
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Gender</label>
                          <Select value={personalInfo.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Marital status</label>
                          <Select value={personalInfo.maritalStatus} onValueChange={(value) => handleSelectChange("maritalStatus", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Blood type</label>
                          <Select value={personalInfo.bloodType} onValueChange={(value) => handleSelectChange("bloodType", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                              <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">Religion</label>
                          <Select value={personalInfo.religion} onValueChange={(value) => handleSelectChange("religion", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select religion" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Islam">Islam</SelectItem>
                              <SelectItem value="Christianity">Christianity</SelectItem>
                              <SelectItem value="Catholicism">Catholicism</SelectItem>
                              <SelectItem value="Hinduism">Hinduism</SelectItem>
                              <SelectItem value="Buddhism">Buddhism</SelectItem>
                              <SelectItem value="Confucianism">Confucianism</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          type="button" 
                          onClick={savePersonalInfo}
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          <Save size={14} />
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Full name</p>
                          <p className="font-medium">{employee.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mobile phone</p>
                          <p className="font-medium">{employee.mobilePhone || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{employee.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{employee.mobilePhone || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Place of birth</p>
                          <p className="font-medium">{employee.birthPlace || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Birthdate</p>
                          <p className="font-medium">
                            {employee.birthDate || "-"} 
                            {employee.birthDate && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">30 years old</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{employee.gender || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Marital status</p>
                          <p className="font-medium">{employee.maritalStatus || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Blood type</p>
                          <p className="font-medium">{employee.bloodType || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Religion</p>
                          <p className="font-medium">{employee.religion || "-"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Identity & Address</h3>
                <div className="border rounded-md">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div></div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 flex items-center"
                      onClick={() => toggleEditMode("identity")}
                    >
                      {editMode === "identity" ? (
                        <>
                          <X size={14} /> Cancel
                        </>
                      ) : (
                        <>
                          <Edit size={14} /> Edit
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editMode === "identity" ? (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="nik">NIK (NPWP 16 digit)</label>
                          <Input 
                            id="nik" 
                            value={identityInfo.nik} 
                            onChange={handleIdentityInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="passportNumber">Passport number</label>
                          <Input 
                            id="passportNumber" 
                            value={identityInfo.passportNumber} 
                            onChange={handleIdentityInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="passportExpiry">Passport expiration date</label>
                          <Input 
                            id="passportExpiry" 
                            value={identityInfo.passportExpiry} 
                            onChange={handleIdentityInfoChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="postalCode">Postal code</label>
                          <Input 
                            id="postalCode" 
                            value={identityInfo.postalCode} 
                            onChange={handleIdentityInfoChange}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="citizenAddress">Citizen ID address</label>
                          <Input 
                            id="citizenAddress" 
                            value={identityInfo.citizenAddress} 
                            onChange={handleIdentityInfoChange}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-500 mb-1" htmlFor="residentialAddress">Residential address</label>
                          <Input 
                            id="residentialAddress" 
                            value={identityInfo.residentialAddress} 
                            onChange={handleIdentityInfoChange}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          type="button" 
                          onClick={saveIdentityInfo}
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          <Save size={14} />
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-sm text-gray-500">NIK (NPWP 16 digit)</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Passport number</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Passport expiration date</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Postal code</p>
                          <p className="font-medium">-</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Citizen ID address</p>
                          <p className="font-medium">-</p>
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
            </div>
          </TabsContent>

          <TabsContent value="family" className="pt-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Family Members</h3>
              <Button 
                size="sm" 
                className="gap-2 flex items-center"
                onClick={() => openFamilyDialog()}
              >
                <Plus size={14} /> Add Family Member
              </Button>
            </div>
            
            {familyLoading ? (
              <div className="text-center py-8">
                <p>Loading family members...</p>
              </div>
            ) : familyMembers.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <div className="mx-auto w-16 h-16 mb-4">
                  <img src="/placeholder.svg" alt="No family members" className="w-full h-full" />
                </div>
                <h3 className="text-base font-medium">No family members yet</h3>
                <p className="text-gray-500 mt-2">Add family members using the button above</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Birth Date</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Occupation</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {familyMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.relationship || "-"}</TableCell>
                        <TableCell>{member.birth_date || "-"}</TableCell>
                        <TableCell>{member.phone || "-"}</TableCell>
                        <TableCell>{member.occupation || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0" 
                              onClick={() => openFamilyDialog(member)}
                            >
                              <Edit size={14} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                                  <Trash2 size={14} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete family member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this family member? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-500 hover:bg-red-600" 
                                    onClick={() => deleteFamilyMember(member.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Family Member Dialog */}
            <AlertDialog open={showFamilyDialog} onOpenChange={setShowFamilyDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {currentFamily ? "Edit Family Member" : "Add Family Member"}
                  </AlertDialogTitle>
                </AlertDialogHeader>
                
                <div className="space-y-4 py-2">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1" htmlFor="name">Name</label>
                    <Input 
                      id="name" 
                      value={familyMember.name} 
                      onChange={handleFamilyMemberChange} 
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Relationship</label>
                    <Select 
                      value={familyMember.relationship} 
                      onValueChange={handleFamilyRelationshipChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1" htmlFor="birthDate">Birth Date</label>
                    <Input 
                      id="birthDate" 
                      type="date" 
                      value={familyMember.birthDate} 
                      onChange={handleFamilyMemberChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1" htmlFor="phone">Phone</label>
                    <Input 
                      id="phone" 
                      value={familyMember.phone} 
                      onChange={handleFamilyMemberChange}
                      placeholder="Phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-500 mb-1" htmlFor="occupation">Occupation</label>
                    <Input 
                      id="occupation" 
                      value={familyMember.occupation} 
                      onChange={handleFamilyMemberChange}
                      placeholder="Occupation"
                    />
                  </div>
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={saveFamilyMember}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

// We're removing the EmptyDataDisplay component as it's no longer needed
