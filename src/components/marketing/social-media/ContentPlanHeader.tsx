
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ContentPlanHeaderProps {
  hasSelectedItems: boolean;
  handleDeleteSelected: () => void;
  addContentItem: () => void;
}

export const ContentPlanHeader: React.FC<ContentPlanHeaderProps> = ({
  hasSelectedItems,
  handleDeleteSelected,
  addContentItem
}) => {
  return (
    <CardHeader className="py-3 flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Content Plan</CardTitle>
      <div className="flex space-x-2">
        {hasSelectedItems && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
        )}
        <Button 
          onClick={addContentItem} 
          size="sm" 
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Row
        </Button>
      </div>
    </CardHeader>
  );
};
