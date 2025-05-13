
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ContentPlanToolbarProps {
  selectedCount: number;
  onAddRow: () => void;
  onConfirmDelete: () => void;
}

export default function ContentPlanToolbar({
  selectedCount,
  onAddRow,
  onConfirmDelete
}: ContentPlanToolbarProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">Content Plans</h2>
        {selectedCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
          </p>
        )}
      </div>
      <div className="space-x-2">
        <Button variant="default" size="sm" onClick={onAddRow}>
          <Plus className="h-4 w-4 mr-1" /> Add Row
        </Button>
        {selectedCount > 0 && (
          <Button variant="destructive" size="sm" onClick={onConfirmDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
          </Button>
        )}
      </div>
    </div>
  );
}
