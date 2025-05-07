
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import { candidateService, EvaluationCategory, EvaluationCriterion } from "@/services/candidateService";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import AddCriterionDialog from "./AddCriterionDialog";
import EditCriterionDialog from "./EditCriterionDialog";
import DeleteCriterionDialog from "./DeleteCriterionDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CriteriaManager() {
  const [categories, setCategories] = useState<EvaluationCategory[]>([]);
  const [criteriaByCategory, setCriteriaByCategory] = useState<Record<string, EvaluationCriterion[]>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState<EvaluationCriterion | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    const data = await candidateService.fetchAllCategories();
    setCategories(data);
    
    // If we have categories, set the first one as selected by default
    if (data.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(data[0].id);
    }
    
    setIsLoading(false);
  };

  const fetchCriteria = async (categoryId: string) => {
    if (!categoryId) return;
    
    setIsLoading(true);
    const data = await candidateService.fetchCriteriaByCategory(categoryId);
    
    setCriteriaByCategory(prev => ({
      ...prev,
      [categoryId]: data
    }));
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchCriteria(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const handleAddCriterion = async (question: string) => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }
    
    const result = await candidateService.createCriterion(selectedCategoryId, question);
    
    if (result.success && result.data) {
      // Update the criteria list for the selected category
      setCriteriaByCategory(prev => ({
        ...prev,
        [selectedCategoryId]: [...(prev[selectedCategoryId] || []), result.data!]
      }));
      
      toast.success("Criterion added successfully");
    } else {
      toast.error("Failed to add criterion");
    }
  };

  const handleUpdateCriterion = async (id: string, question: string) => {
    if (!selectedCategoryId || !selectedCriterion) return;
    
    const result = await candidateService.updateCriterion(id, { question });
    
    if (result.success) {
      // Update the criteria list
      setCriteriaByCategory(prev => ({
        ...prev,
        [selectedCategoryId]: prev[selectedCategoryId].map(crit => 
          crit.id === id ? { ...crit, question } : crit
        )
      }));
      
      toast.success("Criterion updated successfully");
    } else {
      toast.error("Failed to update criterion");
    }
  };

  const handleDeleteCriterion = async (id: string) => {
    if (!selectedCategoryId) return;
    
    const result = await candidateService.deleteCriterion(id);
    
    if (result.success) {
      // Remove the criterion from the list
      setCriteriaByCategory(prev => ({
        ...prev,
        [selectedCategoryId]: prev[selectedCategoryId].filter(crit => crit.id !== id)
      }));
      
      toast.success("Criterion deleted successfully");
    } else {
      toast.error("Failed to delete criterion");
    }
  };

  const openEditDialog = (criterion: EvaluationCriterion) => {
    setSelectedCriterion(criterion);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (criterion: EvaluationCriterion) => {
    setSelectedCriterion(criterion);
    setDeleteDialogOpen(true);
  };

  const getCriteriaForCurrentCategory = () => {
    return selectedCategoryId ? criteriaByCategory[selectedCategoryId] || [] : [];
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === selectedCategoryId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation Criteria</CardTitle>
        <CardDescription>
          Manage evaluation criteria for each category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Category selector */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xs">
              <Select 
                value={selectedCategoryId} 
                onValueChange={setSelectedCategoryId}
                disabled={categories.length === 0}
              >
                <SelectTrigger>
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
            
            <Button 
              onClick={() => setAddDialogOpen(true)}
              disabled={!selectedCategoryId}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Criterion
            </Button>
          </div>
          
          {/* Criteria list */}
          {isLoading ? (
            <div className="flex justify-center py-8">Loading criteria...</div>
          ) : !selectedCategoryId ? (
            <div className="text-center py-8 text-muted-foreground">
              Please select a category to view its criteria.
            </div>
          ) : getCriteriaForCurrentCategory().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No criteria found for this category. Add your first criterion to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Question</TableHead>
                  <TableHead className="w-[15%]">Order</TableHead>
                  <TableHead className="text-right w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCriteriaForCurrentCategory().map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell>{criterion.question}</TableCell>
                    <TableCell>{criterion.display_order}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(criterion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openDeleteDialog(criterion)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        <AddCriterionDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen}
          onAdd={handleAddCriterion}
          category={getCurrentCategory()}
        />

        {selectedCriterion && (
          <EditCriterionDialog 
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            criterion={selectedCriterion}
            category={getCurrentCategory()}
            onUpdate={handleUpdateCriterion}
          />
        )}

        {selectedCriterion && (
          <DeleteCriterionDialog 
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            criterion={selectedCriterion}
            onDelete={handleDeleteCriterion}
          />
        )}
      </CardContent>
    </Card>
  );
}
