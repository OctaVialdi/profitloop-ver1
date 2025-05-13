
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/hooks/content-plan";

interface ContentTypeCellProps {
  id: string;
  contentTypeId: string | null;
  contentTypes: ContentType[];
  onChange: (id: string, field: string, value: any) => void;
}

export default function ContentTypeCell({ 
  id, 
  contentTypeId, 
  contentTypes, 
  onChange 
}: ContentTypeCellProps) {
  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Select 
        value={contentTypeId || "none"} 
        onValueChange={value => onChange(id, 'content_type_id', value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {contentTypes.map(type => (
            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
