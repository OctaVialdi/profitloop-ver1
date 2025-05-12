
import React from "react";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <CardHeader className="flex-row justify-between items-center">
      <h3 className="text-lg font-medium">Content Management</h3>
      <div className="flex items-center space-x-2">
        {hasSelectedItems && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleAddRow}
          className="flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div>
    </CardHeader>
  );
};
