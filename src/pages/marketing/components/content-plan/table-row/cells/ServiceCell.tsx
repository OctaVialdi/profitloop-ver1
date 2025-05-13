
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@/hooks/content-plan";

interface ServiceCellProps {
  id: string;
  serviceId: string | null;
  services: Service[];
  onChange: (id: string, field: string, value: any) => void;
}

export default function ServiceCell({ 
  id, 
  serviceId, 
  services, 
  onChange 
}: ServiceCellProps) {
  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <Select 
        value={serviceId || "none"} 
        onValueChange={value => onChange(id, 'service_id', value === "none" ? "" : value)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">-</SelectItem>
          {services.map(service => (
            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
}
