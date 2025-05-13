
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface DoneCellProps {
  id: string;
  done: boolean | undefined;
  onChange: (id: string, field: string, value: any) => void;
}

export default function DoneCell({ 
  id, 
  done, 
  onChange 
}: DoneCellProps) {
  return (
    <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
      <div className="flex justify-center">
        <Checkbox 
          checked={done} 
          onCheckedChange={checked => onChange(id, 'done', !!checked)} 
        />
      </div>
    </TableCell>
  );
}
