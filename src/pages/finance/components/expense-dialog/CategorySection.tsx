
import React from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategory } from "@/hooks/useExpenses";

interface CategorySectionProps {
  category: string;
  setCategory: (value: string) => void;
  showAddCategory: boolean;
  setShowAddCategory: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  handleAddCategory: () => void;
  categories: ExpenseCategory[];
  validationErrors: Record<string, string>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  setCategory,
  showAddCategory,
  setShowAddCategory,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  categories,
  validationErrors
}) => {
  return (
    <div className="space-y-2">
      <label className="text-base font-medium">
        Category<span className="text-red-500">*</span>
      </label>
      {showAddCategory ? (
        <div className="flex gap-2">
          <Input 
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name"
            className="h-[50px]"
          />
          <Button onClick={handleAddCategory} className="h-[50px]">
            <Check className="mr-1 h-4 w-4" /> Save
          </Button>
          <Button variant="ghost" onClick={() => setShowAddCategory(false)} className="h-[50px]">
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className={cn(
              "h-[50px] flex-1",
              validationErrors.category && "border-red-500"
            )}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <SelectItem value="no-categories" disabled>No categories found</SelectItem>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddCategory(true)} className="h-[50px] px-3">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      {validationErrors.category && (
        <p className="text-xs text-red-500 mt-1">{validationErrors.category}</p>
      )}
    </div>
  );
};
