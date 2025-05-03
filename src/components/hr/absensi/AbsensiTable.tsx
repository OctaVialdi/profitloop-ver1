
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
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">NAME</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">HADIR</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">TELAT</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">CUTI</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">SAKIT/IZIN</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">TANPA IZIN</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">DETAIL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((record) => (
              <tr 
                key={record.id} 
                className={record.tanpaIzin > 0 ? "bg-red-50" : record.telat > 3 ? "bg-yellow-50" : ""}
              >
                <td className="py-4 px-4">{record.name}</td>
                <td className="py-4 px-4">{record.hadir} hari</td>
                <td className="py-4 px-4 text-amber-500">{record.telat > 0 ? `${record.telat} hari` : "0 hari"}</td>
                <td className="py-4 px-4">{record.cuti > 0 ? `${record.cuti} hari` : "0 hari"}</td>
                <td className="py-4 px-4">{record.sakit > 0 ? `${record.sakit} hari` : "0 hari"}</td>
                <td className="py-4 px-4 text-red-500">{record.tanpaIzin > 0 ? `${record.tanpaIzin} hari` : "0 hari"}</td>
                <td className="py-4 px-4">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" /> Lihat Detail
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
