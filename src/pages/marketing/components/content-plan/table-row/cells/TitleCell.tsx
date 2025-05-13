
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { truncateText } from "../../utils/tableUtils";

interface TitleCellProps {
  id: string;
  title: string | null;
  openTitleDialog: (id: string, title: string | null) => void;
}

export default function TitleCell({ 
  id, 
  title, 
  openTitleDialog 
}: TitleCellProps) {
  return (
    <TableCell className="p-1 w-[220px] border-r">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => openTitleDialog(id, title)} 
        className="w-full h-8 flex items-center justify-start px-3 hover:bg-gray-50 truncate text-left" 
        title={title || ""}
      >
        {title ? truncateText(title) : "Click to add title"}
      </Button>
    </TableCell>
  );
}
