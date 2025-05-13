
import React from "react";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ReadonlyCellProps {
  value: string;
  className?: string;
}

export default function ReadonlyCell({ value, className }: ReadonlyCellProps) {
  return (
    <TableCell className={cn("whitespace-nowrap p-1 w-[220px] border-r", className)}>
      <div className="truncate max-w-full" title={value}>
        {value}
      </div>
    </TableCell>
  );
}
