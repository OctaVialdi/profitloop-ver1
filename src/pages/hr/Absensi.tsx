
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AbsensiFilters, 
  AbsensiTable, 
  AbsensiStats,
  AbsensiHeader
} from "@/components/hr/absensi";
import type { AttendanceRecord } from "@/components/hr/absensi/AbsensiTable";

// Sample data
const sampleAttendanceData = [
  {
    id: "1",
    name: "John Doe",
    hadir: 20,
    telat: 2,
    cuti: 1,
    sakit: 0,
    tanpaIzin: 0,
  },
  {
    id: "2",
    name: "Jane Smith",
    hadir: 18,
    telat: 0,
    cuti: 3,
    sakit: 1,
    tanpaIzin: 0,
  },
  {
    id: "3",
    name: "Robert Chen",
    hadir: 15,
    telat: 5,
    cuti: 0,
    sakit: 2,
    tanpaIzin: 1,
  },
  {
    id: "4",
    name: "Maria Garcia",
    hadir: 22,
    telat: 0,
    cuti: 0,
    sakit: 0,
    tanpaIzin: 0,
  },
  {
    id: "5",
    name: "Akira Tanaka",
    hadir: 17,
    telat: 3,
    cuti: 2,
    sakit: 0,
    tanpaIzin: 0,
  },
];

const departmentStats = [
  { name: "IT", hadir: 35, telat: 3, cuti: 2 },
  { name: "Marketing", hadir: 18, telat: 2, cuti: 3 },
  { name: "Finance", hadir: 15, telat: 1, cuti: 2 },
  { name: "HR", hadir: 22, telat: 4, cuti: 1 },
];

// Calculate totals for stats
const calculateTotals = (data: AttendanceRecord[]) => {
  return data.reduce(
    (acc, curr) => {
      acc.hadir += curr.hadir;
      acc.telat += curr.telat;
      acc.cuti += curr.cuti;
      acc.sakit += curr.sakit;
      acc.tanpaIzin += curr.tanpaIzin;
      return acc;
    },
    { hadir: 0, telat: 0, cuti: 0, sakit: 0, tanpaIzin: 0 }
  );
};

export default function HRAbsensi() {
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("Bulan Ini");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Filter data based on selected filters
  const filteredData = sampleAttendanceData.filter((record) => {
    // Filter by department
    if (departmentFilter !== "all") {
      // In a real app, you would check record.department === departmentFilter
      // For this demo, we'll just not filter by department
    }

    // Filter by status
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "hadir":
          if (record.hadir === 0) return false;
          break;
        case "telat":
          if (record.telat === 0) return false;
          break;
        case "cuti":
          if (record.cuti === 0) return false;
          break;
        case "sakit":
          if (record.sakit === 0) return false;
          break;
        case "tanpa_izin":
          if (record.tanpaIzin === 0) return false;
          break;
      }
    }

    // Filter by search term
    if (searchTerm && !record.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Calculate stat totals from filtered data
  const attendanceTotals = calculateTotals(filteredData);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <AbsensiHeader title="Data Absensi Karyawan" />
          
          <AbsensiFilters
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />
          
          <AbsensiTable data={filteredData} />
          
          <AbsensiStats
            attendanceData={attendanceTotals}
            departmentData={departmentStats}
          />
        </CardContent>
      </Card>
    </div>
  );
}
