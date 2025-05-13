
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TeamMembersTab() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newMember, setNewMember] = useState({
    name: "",
    department: "Content Planner", // Default department
    role: "",
  });
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
    if (!newMember.name.trim() || !newMember.role.trim()) return;
    
    try {
      const { error } = await supabase
        .from("team_members")
        .insert({
          name: newMember.name.trim(),
          department: newMember.department,
          role: newMember.role.trim(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      
      setNewMember({
        name: "",
        department: "Content Planner",
        role: "",
      });
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

  // Filter team members based on the active tab
  const filteredMembers = activeTab === "all" 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="Team member name"
          value={newMember.name}
          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
          className="max-w-sm"
        />
        <Select 
          value={newMember.department} 
          onValueChange={(val) => setNewMember({...newMember, department: val})}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Content Planner">Content Planner</SelectItem>
            <SelectItem value="Creative">Creative</SelectItem>
            <SelectItem value="Social Media">Social Media</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Role"
          value={newMember.role}
          onChange={(e) => setNewMember({...newMember, role: e.target.value})}
          className="max-w-sm"
        />
        <Button onClick={addTeamMember} disabled={!newMember.name.trim() || !newMember.role.trim() || isLoading}>
          <UserPlus className="h-4 w-4 mr-1" /> Add Member
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Content Planner">Content Planner</TabsTrigger>
          <TabsTrigger value="Creative">Creative</TabsTrigger>
          <TabsTrigger value="Social Media">Social Media</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          {filteredMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members found in this department.</p>
          ) : (
            <ul className="space-y-2">
              {filteredMembers.map((member) => (
                <li key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({member.department} - {member.role})
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
    </div>
  );
}
