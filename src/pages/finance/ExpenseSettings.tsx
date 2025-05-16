import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useExpenseTypeMappings, ExpenseType } from "@/hooks/useExpenseTypeMappings";
import { useExpenses } from "@/hooks/useExpenses";
import { PlusCircle, Pencil, Trash2, Save, Loader2, Type, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ExpenseCategory {
  id: string;
  name: string;
}

const ExpenseSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"settings" | "categories">("settings");
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ExpenseCategory | null>(null);
  
  const { toast } = useToast();
  const { fetchCategories, addCategory, updateCategory, deleteCategory } = useExpenses();
  const { expenseTypeMappings, fetchExpenseTypeMappings, addExpenseTypeMapping, updateExpenseTypeMapping, deleteExpenseTypeMapping } = useExpenseTypeMappings();
  const [newExpenseType, setNewExpenseType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [mappingToEdit, setMappingToEdit] = useState<{ id: string; category_id: string; expense_type: string; } | null>(null);
  const [editedExpenseType, setEditedExpenseType] = useState("");
  const [isMappingDeleteDialogOpen, setIsMappingDeleteDialogOpen] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<{ id: string; category_id: string; expense_type: string; } | null>(null);

  useEffect(() => {
    fetchCategories().then(fetchedCategories => {
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0].id);
      }
    });
    fetchExpenseTypeMappings();
    
    const handleSwitchTabEvent = (event: CustomEvent) => {
      setActiveTab(event.detail.activeTab);
    };

    document.addEventListener('switch-to-settings-tab', handleSwitchTabEvent);

    return () => {
      document.removeEventListener('switch-to-settings-tab', handleSwitchTabEvent);
    };
  }, [fetchCategories, fetchExpenseTypeMappings]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await addCategory(newCategoryName);
    setIsSubmitting(false);

    if (result) {
      setCategories([...categories, result]);
      setNewCategoryName("");
      toast({
        title: "Success",
        description: "Category added successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add category.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
    setIsCategoryDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    setIsSubmitting(true);
    const result = await updateCategory(editingCategory.id, editedCategoryName);
    setIsSubmitting(false);

    if (result) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, name: editedCategoryName } : cat
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
      setEditedCategoryName("");
      setIsCategoryDialogOpen(false);
      toast({
        title: "Success",
        description: "Category updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update category.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = (category: ExpenseCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsSubmitting(true);
    const success = await deleteCategory(categoryToDelete.id);
    setIsSubmitting(false);

    if (success) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast({
        title: "Success",
        description: "Category deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const handleAddExpenseTypeMapping = async () => {
    if (!newExpenseType.trim() || !selectedCategory) {
      toast({
        title: "Error",
        description: "Expense type and category must be selected.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await addExpenseTypeMapping(selectedCategory, newExpenseType);
    setIsSubmitting(false);

    if (result) {
      fetchExpenseTypeMappings();
      setNewExpenseType("");
      setIsMappingDialogOpen(false);
      toast({
        title: "Success",
        description: "Expense type mapping added successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add expense type mapping.",
        variant: "destructive",
      });
    }
  };

  const handleEditMapping = (mapping: { id: string; category_id: string; expense_type: string; }) => {
    setMappingToEdit(mapping);
    setEditedExpenseType(mapping.expense_type);
    setIsMappingDialogOpen(true);
  };

  const handleUpdateMapping = async () => {
    if (!mappingToEdit) return;

    setIsSubmitting(true);
    const result = await updateExpenseTypeMapping(mappingToEdit.id, editedExpenseType);
    setIsSubmitting(false);

    if (result) {
      fetchExpenseTypeMappings();
      setMappingToEdit(null);
      setEditedExpenseType("");
      setIsMappingDialogOpen(false);
      toast({
        title: "Success",
        description: "Expense type mapping updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update expense type mapping.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMapping = (mapping: { id: string; category_id: string; expense_type: string; }) => {
    setMappingToDelete(mapping);
    setIsMappingDeleteDialogOpen(true);
  };

  const confirmDeleteMapping = async () => {
    if (!mappingToDelete) return;

    setIsSubmitting(true);
    const success = await deleteExpenseTypeMapping(mappingToDelete.id);
    setIsSubmitting(false);

    if (success) {
      fetchExpenseTypeMappings();
      setIsMappingDeleteDialogOpen(false);
      setMappingToDelete(null);
      toast({
        title: "Success",
        description: "Expense type mapping deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete expense type mapping.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>Settings</TabsTrigger>
          <TabsTrigger value="categories" onClick={() => setActiveTab("categories")}>Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div>
            <h2>Settings Content</h2>
            <p>Here you can manage general settings.</p>
          </div>
        </TabsContent>
        <TabsContent value="categories">
          <div className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">Expense Categories</h2>
              <Button variant="outline" size="sm" className="ml-auto" onClick={() => setIsCategoryDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center">
              <h2 className="text-lg font-semibold">Expense Type Mappings</h2>
              <Button variant="outline" size="sm" className="ml-auto" onClick={() => setIsMappingDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Mapping
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Expense Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseTypeMappings.map(mapping => (
                  <TableRow key={mapping.id}>
                    <TableCell>{categories.find(cat => cat.id === mapping.category_id)?.name || "Unknown"}</TableCell>
                    <TableCell>{mapping.expense_type}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditMapping(mapping)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMapping(mapping)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Add Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editingCategory ? editedCategoryName : newCategoryName}
                      onChange={(e) => {
                        if (editingCategory) {
                          setEditedCategoryName(e.target.value);
                        } else {
                          setNewCategoryName(e.target.value);
                        }
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingCategory ? "Update" : "Create"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p>Are you sure you want to delete category "{categoryToDelete?.name}"?</p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={confirmDeleteCategory}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add/Edit Expense Type Mapping Dialog */}
            <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{mappingToEdit ? "Edit Expense Type Mapping" : "Add Expense Type Mapping"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {!mappingToEdit && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory} className="col-span-3">
                        <SelectTrigger id="category">
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
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expenseType" className="text-right">
                      Expense Type
                    </Label>
                    <Input
                      id="expenseType"
                      value={mappingToEdit ? editedExpenseType : newExpenseType}
                      onChange={(e) => {
                        if (mappingToEdit) {
                          setEditedExpenseType(e.target.value);
                        } else {
                          setNewExpenseType(e.target.value);
                        }
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsMappingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={mappingToEdit ? handleUpdateMapping : handleAddExpenseTypeMapping}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      mappingToEdit ? "Update" : "Create"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Expense Type Mapping Dialog */}
            <Dialog open={isMappingDeleteDialogOpen} onOpenChange={setIsMappingDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Expense Type Mapping</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p>Are you sure you want to delete this mapping?</p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsMappingDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={confirmDeleteMapping}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ExpenseSettings;
