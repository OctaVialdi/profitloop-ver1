
import React from "react";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { ExpenseCategory } from "@/hooks/useExpenses";

interface CategorySectionProps {
  category: string;
  setCategory: (value: string) => void;
  showAddCategory: boolean;
  setShowAddCategory: (value: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (value: string) => void;
  handleAddCategory: () => void;
  categories: ExpenseCategory[];
  validationErrors: Record<string, string>;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  setCategory,
  showAddCategory,
  setShowAddCategory,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
  categories,
  validationErrors,
}) => {
  return (
    <div className="space-y-2">
      <FormItem>
        <Label htmlFor="category" className="flex items-center">
          Category<span className="text-red-500">*</span>
        </Label>
        {!showAddCategory ? (
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="flex-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              className="h-10 px-3" 
              onClick={() => setShowAddCategory(true)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Input
              id="newCategory"
              placeholder="Enter new category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button 
              type="button" 
              variant="outline" 
              className="h-10 px-3" 
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
            >
              Add
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="h-10 w-10 p-0" 
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryName("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {validationErrors.category && (
          <p className="text-sm text-red-500">{validationErrors.category}</p>
        )}
      </FormItem>
      
      {/* Link to settings */}
      {!showAddCategory && (
        <div className="text-xs text-muted-foreground">
          <a 
            href="#" 
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // Change to settings tab when this link is clicked
              const event = new CustomEvent('switch-to-settings-tab', {
                detail: { activeTab: 'settings' }
              });
              document.dispatchEvent(event);
            }}
          >
            Manage categories and types in Settings
          </a>
        </div>
      )}
    </div>
  );
};

export default CategorySection;
