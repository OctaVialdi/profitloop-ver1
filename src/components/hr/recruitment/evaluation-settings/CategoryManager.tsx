
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { candidateService, EvaluationCategory } from "@/services/candidateService";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

export default function CategoryManager() {
  const [categories, setCategories] = useState<EvaluationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EvaluationCategory | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    const data = await candidateService.fetchAllCategories();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (name: string, description?: string) => {
    const result = await candidateService.createCategory(name, description);
    if (result.success && result.data) {
      setCategories([...categories, result.data]);
      toast.success("Category added successfully");
    } else {
      toast.error("Failed to add category");
    }
  };

  const handleUpdateCategory = async (id: string, name: string, description?: string) => {
    const result = await candidateService.updateCategory(id, { name, description });
    if (result.success) {
      setCategories(categories.map(cat => cat.id === id ? { ...cat, name, description } : cat));
      toast.success("Category updated successfully");
    } else {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await candidateService.deleteCategory(id);
    if (result.success) {
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success("Category deleted successfully");
    } else {
      toast.error(result.error?.message || "Failed to delete category");
    }
  };

  const openEditDialog = (category: EvaluationCategory) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: EvaluationCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Evaluation Categories</CardTitle>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No categories found. Add your first category to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Order</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <AddCategoryDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen}
          onAdd={handleAddCategory}
        />

        {selectedCategory && (
          <EditCategoryDialog 
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            category={selectedCategory}
            onUpdate={handleUpdateCategory}
          />
        )}

        {selectedCategory && (
          <DeleteCategoryDialog 
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            category={selectedCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </CardContent>
    </Card>
  );
}
