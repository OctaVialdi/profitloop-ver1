
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubService } from "@/hooks/content-plan";

interface SubServiceCellProps {
  id: string;
  serviceId: string | null;
  subServiceId: string | null;
  getFilteredSubServices: (serviceId: string) => SubService[];
  onChange: (id: string, field: string, value: any) => void;
}

export default function SubServiceCell({ 
  id, 
  serviceId, 
  subServiceId, 
  getFilteredSubServices, 
  onChange 
}: SubServiceCellProps) {
  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Select 
        value={subServiceId || "none"} 
        onValueChange={value => onChange(id, 'sub_service_id', value === "none" ? "" : value)} 
        disabled={!serviceId}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {serviceId && getFilteredSubServices(serviceId).map(subService => (
            <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
