
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  email?: string;
}

const departments = [
  "Marketing",
  "Creative",
  "Sales",
  "Operations",
  "HR",
  "Finance",
  "IT"
];

const roles = {
  "Marketing": ["Content Planner", "Social Media Manager", "SEO Specialist", "Digital Marketer"],
  "Creative": ["Designer", "Produksi", "Copywriter", "Video Editor"],
  "Sales": ["Account Manager", "Sales Representative", "Business Development"],
  "Operations": ["Operations Manager", "Quality Control", "Logistics"],
  "HR": ["HR Manager", "Recruiter", "Training Specialist"],
  "Finance": ["Accountant", "Financial Analyst", "Payroll Specialist"],
  "IT": ["Developer", "System Administrator", "IT Support"]
};

export default function TeamMembersTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    department: "Marketing",
    role: "",
    email: ""
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Marketing");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Mock initial data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const initialData: TeamMember[] = [
        { id: "1", name: "John Doe", department: "Marketing", role: "Content Planner" },
        { id: "2", name: "Jane Smith", department: "Creative", role: "Designer" },
        { id: "3", name: "Mike Johnson", department: "Creative", role: "Produksi" },
        { id: "4", name: "Fajar", department: "Marketing", role: "Content Planner" },
        { id: "5", name: "Fajar Budiansyah", department: "Marketing", role: "Content Planner" },
        { id: "6", name: "Sarah Davis", department: "Sales", role: "Account Manager" },
        { id: "7", name: "Robert Wilson", department: "IT", role: "Developer" }
      ];
      setTeamMembers(initialData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update available roles when department changes
  useEffect(() => {
    if (newMember.department) {
      const departmentRoles = roles[newMember.department as keyof typeof roles] || [];
      setSelectedRoles(departmentRoles);
      setNewMember(prev => ({ ...prev, role: departmentRoles[0] || "" }));
    }
  }, [newMember.department]);

  // Handle add new member
  const handleAddMember = () => {
    if (!newMember.name || !newMember.department || !newMember.role) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: uuidv4(),
      name: newMember.name,
      department: newMember.department,
      role: newMember.role,
      email: newMember.email
    };

    setTeamMembers(prev => [...prev, member]);
    setIsAddMemberOpen(false);
    setNewMember({
      name: "",
      department: "Marketing",
      role: "",
      email: ""
    });

    toast({
      title: "Team member added",
      description: `${member.name} has been added as a ${member.role} in ${member.department}.`
    });
  };

  // Handle delete member
  const handleDeleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    toast({
      title: "Team member removed",
      description: "Team member has been removed successfully."
    });
  };

  // Filter team members by department
  const filteredTeamMembers = teamMembers.filter(member => member.department === selectedDepartment);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Team Members</h2>
        <Button onClick={() => setIsAddMemberOpen(true)}>Add Team Member</Button>
      </div>

      <Tabs defaultValue="Marketing" onValueChange={setSelectedDepartment}>
        <TabsList className="grid grid-cols-7 w-full">
          {departments.map(dept => (
            <TabsTrigger key={dept} value={dept}>
              {dept}
            </TabsTrigger>
          ))}
        </TabsList>

        {departments.map(dept => (
          <TabsContent key={dept} value={dept}>
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading team members...</p>
                ) : filteredTeamMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No team members found in this category.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredTeamMembers.map(member => (
                      <li key={member.id} className="flex justify-between items-center p-3 rounded-md border">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name"
                value={newMember.name}
                onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email (Optional)</label>
              <Input 
                id="email"
                value={newMember.email}
                onChange={e => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">Department</label>
              <Select 
                value={newMember.department} 
                onValueChange={(value) => setNewMember(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select 
                value={newMember.role} 
                onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {selectedRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
