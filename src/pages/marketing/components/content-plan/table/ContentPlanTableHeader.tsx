
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContentPlanTableHeader() {
  return (
    <TableHeader className="sticky top-0 bg-background z-10">
      <TableRow>
        <TableHead className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px] border-r">Action</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tanggal Posting</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tipe Content</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">PIC</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Layanan</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Sub Layanan</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Judul Content</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Content Pillar</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Brief</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Status</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Revision</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Approved</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tanggal Selesai</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tanggal Upload</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tipe Content</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Judul Content</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">PIC Produksi</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Link Google Drive</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Status Produksi</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Revisi Counter</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tanggal Selesai Produksi</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Approved</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Tanggal Approved</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Download Link File</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Link Post</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Done</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Actual Post</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px] border-r">On Time Status</TableHead>
        <TableHead className="text-center whitespace-nowrap w-[220px]">Status Content</TableHead>
      </TableRow>
    </TableHeader>
  );
}
