
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContentPlanTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[60px] text-center sticky left-0 z-20 border-r">Action</TableHead>
        <TableHead className="w-[220px] border-r">Tanggal Posting</TableHead>
        <TableHead className="w-[220px] border-r">Tipe Content</TableHead>
        <TableHead className="w-[220px] border-r">PIC</TableHead>
        <TableHead className="w-[220px] border-r">Layanan</TableHead>
        <TableHead className="w-[220px] border-r">Sub Layanan</TableHead>
        <TableHead className="w-[220px] border-r">Judul Content</TableHead>
        <TableHead className="w-[220px] border-r">Content Pillar</TableHead>
        <TableHead className="w-[220px] border-r">Brief</TableHead>
        <TableHead className="w-[220px] border-r">Status</TableHead>
        <TableHead className="w-[220px] border-r text-center">Revision</TableHead>
        <TableHead className="w-[220px] border-r text-center">Approved</TableHead>
        <TableHead className="w-[220px] border-r text-center">Tanggal Selesai</TableHead>
        <TableHead className="w-[220px] border-r text-center">Tanggal Upload</TableHead>
        <TableHead className="w-[220px] border-r text-center">Tipe Content</TableHead>
        <TableHead className="w-[220px] border-r">Judul Content</TableHead>
        <TableHead className="w-[220px] border-r">PIC Produksi</TableHead>
        <TableHead className="w-[220px] border-r">Link Google Drive</TableHead>
        <TableHead className="w-[220px] border-r">Status Produksi</TableHead>
        <TableHead className="w-[220px] border-r text-center">Revisi</TableHead>
        <TableHead className="w-[220px] border-r text-center">Tanggal Selesai</TableHead>
        <TableHead className="w-[220px] border-r text-center">Approved</TableHead>
        <TableHead className="w-[220px] border-r text-center">Tanggal Approved</TableHead>
        <TableHead className="w-[220px] border-r">Download</TableHead>
        <TableHead className="w-[220px] border-r">Link Post</TableHead>
        <TableHead className="w-[220px] border-r text-center">Done</TableHead>
        <TableHead className="w-[220px] border-r text-center">Actual Post</TableHead>
        <TableHead className="w-[220px] border-r text-center">On Time Status</TableHead>
        <TableHead className="w-[220px]">Status Content</TableHead>
      </TableRow>
    </TableHeader>
  );
}
