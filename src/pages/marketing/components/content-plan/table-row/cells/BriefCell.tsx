
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { truncateText } from "../../utils/tableUtils";

interface BriefCellProps {
  id: string;
  brief: string | null;
  extractLink: (text: string | null) => string | null;
  openBriefDialog: (id: string, brief: string | null) => void;
}

export default function BriefCell({ 
  id, 
  brief, 
  extractLink, 
  openBriefDialog 
}: BriefCellProps) {
  return (
    <TableCell className="p-1 w-[220px] border-r">
      <Button 
        variant="ghost" 
        className="w-full h-8 flex items-center justify-between px-3 hover:bg-gray-50 text-left" 
        onClick={() => openBriefDialog(id, brief)}
      >
        <span className="truncate flex-grow text-left">
          {brief ? truncateText(brief) : "Add brief"}
        </span>
        {extractLink(brief) && <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />}
      </Button>
    </TableCell>
  );
}
