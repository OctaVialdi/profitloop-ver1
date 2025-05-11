
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

interface ContentHeaderProps {
  handleDeleteSelected: () => void;
  handleAddRow: () => void;
  hasSelectedItems: boolean;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  handleDeleteSelected,
  handleAddRow,
  hasSelectedItems
}) => {
  return (
    <CardHeader className="py-3 flex flex-row items-center justify-between">
      <CardTitle className="text-lg">Content Management</CardTitle>
      <div className="flex space-x-2">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDeleteSelected}
          disabled={!hasSelectedItems}
          className="text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Selected
        </Button>
        <Button onClick={handleAddRow} size="sm" className="text-sm">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Row
        </Button>
      </div>
    </CardHeader>
  );
};
