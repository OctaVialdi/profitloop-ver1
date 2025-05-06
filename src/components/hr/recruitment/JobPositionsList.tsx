
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { PlusIcon, Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function JobPositionsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [positions, setPositions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPosition, setNewPosition] = useState({
    title: "",
    location: "",
    status: "active",
    description: "",
  });
  
  useEffect(() => {
    fetchPositions();
  }, []);
  
  async function fetchPositions() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPositions(data || []);
    } catch (error) {
      console.error("Error fetching job positions:", error);
      toast.error("Failed to load job positions");
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleAddPosition() {
    try {
      if (!newPosition.title) {
        toast.error("Position title is required");
        return;
      }
      
      // Need to get the organization_id
      const { data: profileData } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', profileData.user?.id)
        .single();
        
      if (!userData?.organization_id) {
        toast.error("Could not determine your organization");
        return;
      }
      
      const { error } = await supabase
        .from('job_positions')
        .insert({
          title: newPosition.title,
          location: newPosition.location || null,
          status: newPosition.status,
          description: newPosition.description || null,
          organization_id: userData.organization_id
        });
        
      if (error) throw error;
      
      toast.success("Job position added successfully");
      setShowAddDialog(false);
      setNewPosition({
        title: "",
        location: "",
        status: "active",
        description: "",
      });
      fetchPositions();
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Failed to add job position");
    }
  }
  
  const handleStatusChange = async (positionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_positions')
        .update({ status: newStatus })
        .eq('id', positionId);
        
      if (error) throw error;
      
      toast.success("Status updated successfully");
      fetchPositions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  
  const filteredPositions = positions.filter(position => 
    position.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search positions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusIcon className="h-4 w-4 mr-2" /> Add Position
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : filteredPositions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No job positions found</TableCell>
            </TableRow>
          ) : (
            filteredPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>{position.title}</TableCell>
                <TableCell>{position.location || "-"}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    position.status === 'active' ? 'bg-green-100 text-green-800' :
                    position.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {position.status === 'active' ? 'Active' : 
                     position.status === 'inactive' ? 'Inactive' : 'Draft'}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(position.id, 'active')}>
                        Set as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(position.id, 'inactive')}>
                        Set as Inactive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Job Position</DialogTitle>
            <DialogDescription>
              Create a new job position for your organization.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Position Title*</Label>
              <Input 
                id="title" 
                value={newPosition.title} 
                onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                placeholder="e.g. Marketing Manager"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={newPosition.location} 
                onChange={(e) => setNewPosition({...newPosition, location: e.target.value})}
                placeholder="e.g. Remote, New York, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newPosition.status} 
                onValueChange={(value) => setNewPosition({...newPosition, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newPosition.description} 
                onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
                placeholder="Job description and requirements"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPosition}>Add Position</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
