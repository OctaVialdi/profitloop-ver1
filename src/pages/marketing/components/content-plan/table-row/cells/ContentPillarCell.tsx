
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentPillar } from "@/hooks/content-plan";

interface ContentPillarCellProps {
  id: string;
  contentPillarId: string | null;
  contentPillars: ContentPillar[];
  onChange: (id: string, field: string, value: any) => void;
}

export default function ContentPillarCell({ 
  id, 
  contentPillarId, 
  contentPillars, 
  onChange 
}: ContentPillarCellProps) {
  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Select 
        value={contentPillarId || "none"} 
        onValueChange={value => onChange(id, 'content_pillar_id', value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {contentPillars.map(pillar => (
            <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
