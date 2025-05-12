
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusSquare, Trash2, Edit } from "lucide-react";
import { useContentManagement } from "@/hooks/useContentManagement";
import { toast } from "sonner";

const ContentPillarsTab = () => {
  const { contentPillars, addContentPillar, updateContentPillar, deleteContentPillar } = useContentManagement();
  const [newPillarName, setNewPillarName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddPillar = () => {
    if (!newPillarName.trim()) {
      toast.error("Content pillar name cannot be empty");
      return;
    }
    
    addContentPillar(newPillarName);
    toast.success("Content pillar added successfully");
    setNewPillarName("");
  };
  
  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };
  
  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) {
      toast.error("Content pillar name cannot be empty");
      return;
    }
    
    updateContentPillar(editingId, editingName);
    toast.success("Content pillar updated successfully");
    setEditingId(null);
    setEditingName("");
  };
  
  const handleDelete = (id: string) => {
    deleteContentPillar(id);
    toast.success("Content pillar deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Enter new content pillar" 
          value={newPillarName} 
          onChange={(e) => setNewPillarName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddPillar} className="flex items-center">
          <PlusSquare className="h-4 w-4 mr-1" />
          <span>Add Pillar</span>
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Pillar</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentPillars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                  No content pillars defined. Add your first one above.
                </TableCell>
              </TableRow>
            ) : (
              contentPillars.map((pillar) => (
                <TableRow key={pillar.id}>
                  <TableCell>
                    {editingId === pillar.id ? (
                      <Input 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      pillar.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === pillar.id ? (
                      <div className="flex justify-end space-x-2">
                        <Button onClick={handleSaveEdit} size="sm">Save</Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEdit(pillar.id, pillar.name)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(pillar.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentPillarsTab;
