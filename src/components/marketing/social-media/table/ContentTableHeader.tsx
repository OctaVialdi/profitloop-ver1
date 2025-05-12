
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ContentTableHeaderProps {
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
}

export const ContentTableHeader: React.FC<ContentTableHeaderProps> = ({
  selectAll,
  handleSelectAll,
}) => {
  return (
    <TableHeader className="sticky top-0 bg-white z-20 shadow-sm">
      <TableRow className="bg-slate-100">
        <TableHead className="w-[50px] text-center sticky left-0 bg-slate-100 z-30 border-r">
          <Checkbox 
            checked={selectAll} 
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
            className="mt-1"
          />
        </TableHead>
        <TableHead className="w-[110px] text-center font-semibold text-slate-700">Tanggal Posting</TableHead>
        <TableHead className="w-[110px] text-center font-semibold text-slate-700">Tipe Content</TableHead>
        <TableHead className="w-[90px] text-center font-semibold text-slate-700">PIC</TableHead>
        <TableHead className="w-[110px] text-center font-semibold text-slate-700">Layanan</TableHead>
        <TableHead className="w-[110px] text-center font-semibold text-slate-700">Sub Layanan</TableHead>
        <TableHead className="w-[160px] text-center font-semibold text-slate-700">Judul Content</TableHead>
        <TableHead className="w-[110px] text-center font-semibold text-slate-700">Content Pillar</TableHead>
        <TableHead className="w-[160px] text-center font-semibold text-slate-700">Brief</TableHead>
        <TableHead className="w-[90px] text-center font-semibold text-slate-700">Status</TableHead>
        <TableHead className="w-[90px] text-center font-semibold text-slate-700">Revision</TableHead>
      </TableRow>
    </TableHeader>
  );
};
