
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ContentTableHeaderProps {
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  visibleColumns: string[];
}

export const ContentTableHeader: React.FC<ContentTableHeaderProps> = ({
  selectAll,
  handleSelectAll,
  visibleColumns,
}) => {
  // Define column mappings
  const columnHeaders: Record<string, { title: string; width: string }> = {
    selectColumn: { title: "", width: "w-[60px]" },
    postDate: { title: "Tanggal Posting", width: "w-[120px]" },
    contentType: { title: "Tipe Content", width: "w-[120px]" },
    pic: { title: "PIC", width: "w-[120px]" },
    service: { title: "Layanan", width: "w-[120px]" },
    subService: { title: "Sub Layanan", width: "w-[120px]" },
    title: { title: "Judul Content", width: "w-[120px]" },
    contentPillar: { title: "Content Pillar", width: "w-[120px]" },
    brief: { title: "Brief", width: "w-[120px]" },
    status: { title: "Status", width: "w-[120px]" },
    revision: { title: "Revision", width: "w-[80px]" },
    approved: { title: "Approved", width: "w-[80px]" },
    completionDate: { title: "Tanggal Selesai", width: "w-[120px]" },
    mirrorPostDate: { title: "Tanggal Upload", width: "w-[120px]" },
    mirrorContentType: { title: "Tipe Content", width: "w-[120px]" },
    mirrorTitle: { title: "Judul Content", width: "w-[120px]" },
    picProduction: { title: "PIC Produksi", width: "w-[120px]" },
    googleDriveLink: { title: "Link Google Drive", width: "w-[120px]" },
    productionStatus: { title: "Status Produksi", width: "w-[120px]" },
    productionRevision: { title: "Revisi Counter", width: "w-[80px]" },
    productionCompletionDate: { title: "Tanggal Selesai Produksi", width: "w-[120px]" },
    productionApproved: { title: "Approved", width: "w-[80px]" },
    productionApprovedDate: { title: "Tanggal Approved", width: "w-[120px]" },
    downloadLink: { title: "Download Link File", width: "w-[120px]" },
    postLink: { title: "Link Post", width: "w-[120px]" },
    isDone: { title: "Done", width: "w-[80px]" },
    actualPostDate: { title: "Actual Post", width: "w-[120px]" },
    onTimeStatus: { title: "On Time Status", width: "w-[120px]" },
    contentStatus: { title: "Status Content", width: "w-[120px]" }
  };

  return (
    <TableHeader className="sticky top-0 bg-white z-10">
      <TableRow className="bg-slate-50">
        {/* Always show select column */}
        <TableHead className="w-[60px] text-center sticky left-0 bg-slate-50 z-20">
          <Checkbox 
            checked={selectAll} 
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
            className="ml-2"
          />
        </TableHead>

        {/* Show visible columns based on the activeTab */}
        {visibleColumns.filter(col => col !== 'selectColumn').map(columnKey => {
          const column = columnHeaders[columnKey];
          return (
            <TableHead key={columnKey} className={`${column.width} text-center whitespace-nowrap border-r border-slate-200`}>
              {column.title}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
