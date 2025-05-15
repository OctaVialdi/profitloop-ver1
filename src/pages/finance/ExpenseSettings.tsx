
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useExpenseTypeMappings, ExpenseType } from "@/hooks/useExpenseTypeMappings";
import { useExpenses } from "@/hooks/useExpenses";
import { PlusCircle, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { clearExpenseTypeCache } from "./components/expense-dialog/categoryExpenseTypeMap";

export default function ExpenseSettings() {
  const { toast } = useToast();
  const { categories, fetchCategories } = useExpenses();
  const { 
    loading, 
    expenseTypes, 
    categoryMappings,
    fetchExpenseTypes, 
    fetchCategoryMappings,
    createExpenseType, 
    updateExpenseType, 
    deleteExpenseType,
    saveCategoryTypeMappings
  } = useExpenseTypeMappings();
  
  // Local state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [currentType, setCurrentType] = useState<ExpenseType | null>(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [mappings, setMappings] = useState<Record<string, Record<string, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchExpenseTypes();
      await fetchCategoryMappings();
    };
    
    loadData();
  }, []);
  
  // Initialize mappings when data is loaded
  useEffect(() => {
    if (categories.length > 0 && expenseTypes.length > 0) {
      const initialMappings: Record<string, Record<string, boolean>> = {};
      
      // Initialize all to false
      categories.forEach(category => {
        initialMappings[category.id] = {};
        expenseTypes.forEach(type => {
          initialMappings[category.id][type.name] = false;
        });
      });
      
      // Set true for existing mappings
      categoryMappings.forEach(mapping => {
        if (initialMappings[mapping.category_id]) {
          initialMappings[mapping.category_id][mapping.expense_type] = true;
        }
      });
      
      setMappings(initialMappings);
    }
  }, [categories, expenseTypes, categoryMappings]);
  
  // Handle add new expense type
  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast({
        title: "Error",
        description: "Type name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const result = await createExpenseType(newTypeName.trim());
    if (result) {
      setNewTypeName("");
      setIsAddDialogOpen(false);
    }
  };
  
  // Handle edit expense type
  const handleEditType = async () => {
    if (!currentType || !editTypeName.trim()) {
      toast({
        title: "Error",
        description: "Type name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const result = await updateExpenseType(currentType.id, editTypeName.trim());
    if (result) {
      setCurrentType(null);
      setEditTypeName("");
      setIsEditDialogOpen(false);
      clearExpenseTypeCache();
    }
  };
  
  // Handle delete expense type
  const handleDeleteType = async (typeId: string) => {
    if (confirm("Are you sure you want to delete this expense type?")) {
      const result = await deleteExpenseType(typeId);
      if (result) {
        clearExpenseTypeCache();
      }
    }
  };
  
  // Handle mapping change
  const handleMappingChange = (categoryId: string, typeName: string, checked: boolean) => {
    setMappings(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [typeName]: checked
      }
    }));
  };
  
  // Handle save mappings
  const handleSaveMappings = async () => {
    setIsSaving(true);
    
    try {
      const mappingsToSave: Array<{categoryId: string, expenseType: string}> = [];
      
      // Convert mappings object to array
      Object.entries(mappings).forEach(([categoryId, typeMap]) => {
        Object.entries(typeMap).forEach(([typeName, isSelected]) => {
          if (isSelected) {
            mappingsToSave.push({
              categoryId,
              expenseType: typeName
            });
          }
        });
      });
      
      const result = await saveCategoryTypeMappings(mappingsToSave);
      
      if (result) {
        toast({
          title: "Success",
          description: "Category-type mappings saved successfully",
        });
        clearExpenseTypeCache();
      }
    } catch (error) {
      console.error("Error saving mappings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expense Settings</h1>
      </div>
      
      <Tabs defaultValue="mappings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mappings">Category-Type Mappings</TabsTrigger>
          <TabsTrigger value="types">Expense Types</TabsTrigger>
        </TabsList>
        
        {/* Mappings Tab */}
        <TabsContent value="mappings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category to Expense Type Mappings</CardTitle>
              <CardDescription>
                Configure which expense types are available for each category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Category</th>
                          {expenseTypes.map(type => (
                            <th key={type.id} className="px-4 py-2 text-center font-medium text-gray-600">
                              {type.name}
                              {type.is_default && (
                                <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
                                  Default
                                </Badge>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(category => (
                          <tr key={category.id} className="border-t">
                            <td className="px-4 py-2">{category.name}</td>
                            {expenseTypes.map(type => (
                              <td key={`${category.id}-${type.id}`} className="px-4 py-2 text-center">
                                <Checkbox
                                  checked={mappings[category.id]?.[type.name] || false}
                                  onCheckedChange={(checked) => 
                                    handleMappingChange(category.id, type.name, checked === true)
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={handleSaveMappings}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Mappings
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Expense Types</CardTitle>
                <CardDescription>
                  Manage custom expense types for your organization
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Type
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : expenseTypes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-gray-500">No expense types found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {expenseTypes.map(type => (
                    <div key={type.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center">
                        <span>{type.name}</span>
                        {type.is_default && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentType(type);
                            setEditTypeName(type.name);
                            setIsEditDialogOpen(true);
                          }}
                          disabled={type.is_default}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteType(type.id)}
                          disabled={type.is_default}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense Type</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name">Type Name</Label>
            <Input
              id="name"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddType}>
              Add Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense Type</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="editName">Type Name</Label>
            <Input
              id="editName"
              value={editTypeName}
              onChange={(e) => setEditTypeName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditType}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
