
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ApprovedCellProps {
  id: string;
  approved: boolean | undefined;
  onChange: (id: string, field: string, value: any) => void;
  fieldName: string;
}

export default function ApprovedCell({ 
  id, 
  approved, 
  onChange, 
  fieldName 
}: ApprovedCellProps) {
  return (
    <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
      <div className="flex justify-center">
        <Checkbox 
          checked={approved} 
          onCheckedChange={checked => onChange(id, fieldName, !!checked)} 
        />
      </div>
    </TableCell>
  );
}
