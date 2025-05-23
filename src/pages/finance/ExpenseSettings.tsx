
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useExpenseTypeMappings, ExpenseType } from "@/hooks/useExpenseTypeMappings";
import { useExpenses } from "@/hooks/useExpenses";
import { PlusCircle, Pencil, Trash2, Save, Loader2, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clearExpenseTypeCache } from "./components/expense-dialog/categoryExpenseTypeMap";

export default function ExpenseSettings() {
  const { toast } = useToast();
  const { 
    categories, 
    fetchCategories, 
    addCategory,
    deleteExpenseCategory: deleteCategory
  } = useExpenses();
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
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [currentType, setCurrentType] = useState<ExpenseType | null>(null);
  const [currentCategory, setCurrentCategory] = useState<any | null>(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [mappings, setMappings] = useState<Record<string, Record<string, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

    if (!selectedCategoryId) {
      toast({
        title: "Error",
        description: "Please select a parent category",
        variant: "destructive",
      });
      return;
    }
    
    const result = await createExpenseType(newTypeName.trim(), selectedCategoryId);
    if (result) {
      setNewTypeName("");
      setSelectedCategoryId(null);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Expense type "${newTypeName.trim()}" has been created`,
      });
    }
  };

  // Handle add new expense category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addCategory(newCategoryName.trim(), newCategoryDescription.trim() || undefined);
    if (result) {
      setNewCategoryName("");
      setNewCategoryDescription("");
      setIsAddCategoryDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Expense category "${newCategoryName.trim()}" has been created`,
      });
      
      // Refresh mappings data
      await fetchCategories();
      await fetchCategoryMappings();
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
    
    const result = await updateExpenseType(currentType.id, editTypeName.trim(), selectedCategoryId || undefined);
    if (result) {
      setCurrentType(null);
      setEditTypeName("");
      setSelectedCategoryId(null);
      setIsEditDialogOpen(false);
      clearExpenseTypeCache();
      
      toast({
        title: "Success",
        description: `Expense type updated successfully`,
      });
    }
  };

  // Handle edit expense category 
  const handleEditCategory = async () => {
    if (!currentCategory || !editCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // This function doesn't exist yet, but we'll mock it for now
    // We'll need to add this function to useExpenses hook
    toast({
      title: "Info",
      description: "Category update functionality will be available soon.",
    });
    
    setCurrentCategory(null);
    setEditCategoryName("");
    setEditCategoryDescription("");
    setIsEditCategoryDialogOpen(false);
  };
  
  // Handle delete expense type
  const handleDeleteType = async (typeId: string) => {
    if (confirm("Are you sure you want to delete this expense type?")) {
      const result = await deleteExpenseType(typeId);
      if (result) {
        clearExpenseTypeCache();
        
        toast({
          title: "Success",
          description: "Expense type deleted successfully",
        });
      }
    }
  };

  // Handle delete expense category
  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this expense category?")) {
      setIsDeleting(true);
      
      try {
        const result = await deleteCategory(categoryId);
        
        if (result) {
          toast({
            title: "Success",
            description: "Expense category deleted successfully",
          });
          
          // Refresh mappings data
          await fetchCategories();
          await fetchCategoryMappings();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category. It may be in use with existing expenses.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
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
      toast({
        title: "Error",
        description: "Failed to save category-type mappings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get types for a specific category
  const getTypesForCategory = (categoryId: string) => {
    return expenseTypes.filter(type => type.category_id === categoryId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expense Settings</h1>
      </div>
      
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="types">Expense Types</TabsTrigger>
          <TabsTrigger value="mappings">Category-Type Mappings</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>
                  Manage expense categories for your organization
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddCategoryDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-gray-500">No expense categories found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{category.name}</span>
                        {category.description && (
                          <span className="text-sm text-gray-500">{category.description}</span>
                        )}
                        <div className="mt-1">
                          {getTypesForCategory(category.id).length > 0 && (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
                              {getTypesForCategory(category.id).length} types
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentCategory(category);
                            setEditCategoryName(category.name);
                            setEditCategoryDescription(category.description || "");
                            setIsEditCategoryDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting}
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

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Expense Types</CardTitle>
                <CardDescription>
                  Manage expense types for your organization
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
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-gray-500">Please create categories first</p>
                </div>
              ) : expenseTypes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <p className="text-gray-500">No expense types found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map(category => (
                    <div key={category.id} className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">{category.name}</h3>
                      {getTypesForCategory(category.id).length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">No types for this category</p>
                      ) : (
                        <div className="space-y-2">
                          {getTypesForCategory(category.id).map(type => (
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
                                    setSelectedCategoryId(type.category_id || null);
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
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
      </Tabs>
      
      {/* Add Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="parentCategory">Parent Category</Label>
              <Select 
                value={selectedCategoryId || ""} 
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Type Name</Label>
              <Input
                id="name"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="mt-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddType();
                  }
                }}
              />
            </div>
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

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-2"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="categoryDescription">Description (Optional)</Label>
              <Input
                id="categoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
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
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editParentCategory">Parent Category</Label>
              <Select 
                value={selectedCategoryId || ""} 
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editName">Type Name</Label>
              <Input
                id="editName"
                value={editTypeName}
                onChange={(e) => setEditTypeName(e.target.value)}
                className="mt-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEditType();
                  }
                }}
              />
            </div>
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="mt-2"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="editCategoryDescription">Description (Optional)</Label>
              <Input
                id="editCategoryDescription"
                value={editCategoryDescription}
                onChange={(e) => setEditCategoryDescription(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
