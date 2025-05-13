
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RevisionCellProps {
  id: string;
  count: number | undefined;
  resetCounter: () => Promise<boolean>;
}

export default function RevisionCell({ 
  id, 
  count, 
  resetCounter 
}: RevisionCellProps) {
  return (
    <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
      <div className="flex items-center justify-center gap-1">
        <span>{count || 0}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={resetCounter}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    </TableCell>
  );
}
