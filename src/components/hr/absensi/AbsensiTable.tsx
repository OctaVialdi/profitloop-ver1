
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface AttendanceRecord {
  id: string;
  name: string;
  hadir: number;
  telat: number;
  cuti: number;
  sakit: number;
  tanpaIzin: number;
}

interface AbsensiTableProps {
  data: AttendanceRecord[];
}

export const AbsensiTable: React.FC<AbsensiTableProps> = ({ data }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">NAME</th>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">HADIR</th>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">TELAT</th>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">CUTI</th>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">SAKIT/IZIN</th>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">TANPA IZIN</th>
              <th className="py-2 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">DETAIL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((record) => (
              <tr 
                key={record.id} 
                className={record.tanpaIzin > 0 ? "bg-red-50" : record.telat > 3 ? "bg-yellow-50" : ""}
              >
                <td className="py-1.5 px-4 text-sm">{record.name}</td>
                <td className="py-1.5 px-4 text-sm">{record.hadir} hari</td>
                <td className="py-1.5 px-4 text-amber-500 text-sm">{record.telat > 0 ? `${record.telat} hari` : "0 hari"}</td>
                <td className="py-1.5 px-4 text-sm">{record.cuti > 0 ? `${record.cuti} hari` : "0 hari"}</td>
                <td className="py-1.5 px-4 text-sm">{record.sakit > 0 ? `${record.sakit} hari` : "0 hari"}</td>
                <td className="py-1.5 px-4 text-red-500 text-sm">{record.tanpaIzin > 0 ? `${record.tanpaIzin} hari` : "0 hari"}</td>
                <td className="py-1.5 px-4">
                  <Button variant="ghost" size="sm" className="h-6 text-xs flex items-center">
                    <Eye className="mr-1 h-3 w-3" /> Lihat Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
