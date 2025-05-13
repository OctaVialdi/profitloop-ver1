
import React from "react";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface LinkCellProps {
  id: string;
  link: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  asButton?: boolean;
  linkText?: string;
}

export default function LinkCell({ 
  id, 
  link, 
  onChange, 
  placeholder = "", 
  asButton = false,
  linkText = ""
}: LinkCellProps) {
  if (asButton) {
    return (
      <TableCell className="p-1 w-[220px] border-r">
        {link && (
          <Button variant="outline" size="sm" className="w-full h-8" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" /> {linkText || "Open"}
            </a>
          </Button>
        )}
      </TableCell>
    );
  }

  return (
    <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
      <div className="flex items-center gap-1">
        <Input 
          value={link || ""} 
          onChange={onChange ? e => onChange(e.target.value) : undefined} 
          placeholder={placeholder} 
          className="w-full h-8 text-xs" 
        />
        {link && (
          <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </TableCell>
  );
}
