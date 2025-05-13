
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TeamMembersTab() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [department, setDepartment] = useState("Content Planner");
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async () => {
    if (!newMemberName.trim()) return;
    
    try {
      const { error } = await supabase
        .from("team_members")
        .insert({ 
          name: newMemberName.trim(),
          department,
          role: role || department // Default role to department if not specified
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      
      setNewMemberName("");
      setRole("");
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const filteredTeamMembers = activeTab === "all" 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeTab);

  const departments = ["All", "Content Planner", "Creative", "Marketing", "Sales"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Enter team member name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="mb-2"
          />
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={department}
              onValueChange={setDepartment}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Content Planner">Content Planner</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Role (optional)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1"
            />

            <Button onClick={addTeamMember} disabled={!newMemberName.trim() || isLoading}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Content Planner">Content Planner</TabsTrigger>
          <TabsTrigger value="Creative">Creative</TabsTrigger>
          <TabsTrigger value="Marketing">Marketing</TabsTrigger>
          <TabsTrigger value="Sales">Sales</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading team members...</p>
            ) : filteredTeamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No team members found in this category.</p>
            ) : (
              <ul className="space-y-2">
                {filteredTeamMembers.map((member) => (
                  <li key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{member.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {member.department}
                        {member.role && member.role !== member.department && ` • ${member.role}`}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTeamMember(member.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
