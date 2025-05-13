
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusCellProps {
  id: string;
  status: string;
  onChange: (id: string, field: string, value: any) => void;
  fieldName: string;
  options?: StatusOption[];
}

export default function StatusCell({ 
  id, 
  status, 
  onChange, 
  fieldName,
  options
}: StatusCellProps) {
  const defaultOptions = [
    { value: "none", label: "-" },
    { value: "Butuh Di Review", label: "Butuh Di Review" },
    { value: "Request Revisi", label: "Request Revisi" }
  ];

  const selectOptions = options || defaultOptions;

  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Select 
        value={status || "none"} 
        onValueChange={value => onChange(id, fieldName, value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
