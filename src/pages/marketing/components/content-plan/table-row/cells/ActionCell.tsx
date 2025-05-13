
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ActionCellProps {
  id: string;
  selected: boolean;
  onSelectChange: (id: string, checked: boolean) => void;
}

export default function ActionCell({ id, selected, onSelectChange }: ActionCellProps) {
  return (
    <TableCell className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px] border-r">
      <div className="flex justify-center">
        <Checkbox 
          checked={selected} 
          onCheckedChange={checked => onSelectChange(id, !!checked)} 
        />
      </div>
    </TableCell>
  );
}
