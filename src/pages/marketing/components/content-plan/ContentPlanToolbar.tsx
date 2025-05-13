
import React from 'react';
import { Button } from "@/components/ui/button";

interface ContentPlanToolbarProps {
  selectedItems: string[];
  onAddNewRow: () => void;
  onDeleteSelected: () => void;
}

export default function ContentPlanToolbar({ selectedItems, onAddNewRow, onDeleteSelected }: ContentPlanToolbarProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onAddNewRow}>+ Add Row</Button>
        {selectedItems.length > 0 && (
          <Button variant="destructive" onClick={onDeleteSelected}>
            Delete Selected ({selectedItems.length})
          </Button>
        )}
      </div>
    </div>
  );
}
