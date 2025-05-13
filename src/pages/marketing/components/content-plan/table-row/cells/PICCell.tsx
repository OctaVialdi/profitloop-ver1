
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LegacyEmployee } from "@/hooks/useEmployees";

interface PICCellProps {
  id: string;
  picId: string | null;
  teamMembers: LegacyEmployee[];
  onChange: (id: string, field: string, value: any) => void;
  fieldName: string;
}

export default function PICCell({ 
  id, 
  picId, 
  teamMembers, 
  onChange,
  fieldName
}: PICCellProps) {
  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Select 
        value={picId || "none"} 
        onValueChange={value => onChange(id, fieldName, value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {teamMembers.map(member => (
            <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
