
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusSquare, Trash2, Edit } from "lucide-react";
import { useContentManagement } from "@/hooks/useContentManagement";
import { toast } from "sonner";

const ContentTypesTab = () => {
  const { contentTypes, addContentType, updateContentType, deleteContentType } = useContentManagement();
  const [newTypeName, setNewTypeName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddType = () => {
    if (!newTypeName.trim()) {
      toast.error("Content type name cannot be empty");
      return;
    }
    
    addContentType(newTypeName);
    toast.success("Content type added successfully");
    setNewTypeName("");
  };
  
  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };
  
  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) {
      toast.error("Content type name cannot be empty");
      return;
    }
    
    updateContentType(editingId, editingName);
    toast.success("Content type updated successfully");
    setEditingId(null);
    setEditingName("");
  };
  
  const handleDelete = (id: string) => {
    deleteContentType(id);
    toast.success("Content type deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Enter new content type" 
          value={newTypeName} 
          onChange={(e) => setNewTypeName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddType} className="flex items-center">
          <PlusSquare className="h-4 w-4 mr-1" />
          <span>Add Type</span>
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Type</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                  No content types defined. Add your first one above.
                </TableCell>
              </TableRow>
            ) : (
              contentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    {editingId === type.id ? (
                      <Input 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      type.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === type.id ? (
                      <div className="flex justify-end space-x-2">
                        <Button onClick={handleSaveEdit} size="sm">Save</Button>
                        <Button onClick={() => setEditingId(null)} size="sm" variant="outline">Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEdit(type.id, type.name)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(type.id)}
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

export default ContentTypesTab;
