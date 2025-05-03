
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrainingProgram {
  id: number;
  name: string;
  category: string;
  startDate: string;
  duration: string;
  participants: string;
  status: string;
}

interface TrainingProgramListProps {
  activeTab: string;
  onProgramClick: (program: TrainingProgram) => void;
}

export const TrainingProgramList: React.FC<TrainingProgramListProps> = ({
  activeTab,
  onProgramClick
}) => {
  const activePrograms: TrainingProgram[] = [
    {
      id: 1,
      name: "Digital Marketing Strategy",
      category: "Marketing",
      startDate: "11 May 2025",
      duration: "3 hari",
      participants: "12/15 orang",
      status: "Persiapan"
    },
    {
      id: 2,
      name: "Java Programming Advanced",
      category: "Technical",
      startDate: "18 May 2025",
      duration: "5 hari",
      participants: "10/12 orang",
      status: "Persiapan"
    },
    {
      id: 3,
      name: "Financial Planning",
      category: "Finance",
      startDate: "06 May 2025",
      duration: "2 hari",
      participants: "15/15 orang",
      status: "Persiapan"
    },
    {
      id: 4,
      name: "Agile Project Management",
      category: "Management",
      startDate: "25 May 2025",
      duration: "2 hari",
      participants: "9/15 orang",
      status: "Persiapan"
    }
  ];

  const completedPrograms: TrainingProgram[] = [
    {
      id: 5,
      name: "Leadership Development",
      category: "Leadership",
      startDate: "16 Apr 2025",
      duration: "5 hari",
      participants: "8/10 orang",
      status: "Selesai"
    },
    {
      id: 6,
      name: "Customer Service Excellence",
      category: "Customer Service",
      startDate: "28 Apr 2025",
      duration: "1 hari",
      participants: "18/20 orang",
      status: "Selesai"
    }
  ];

  const programs = activeTab === "selesai" ? completedPrograms : activePrograms;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Persiapan":
        return <Badge className="bg-amber-500">Persiapan</Badge>;
      case "Sedang Berjalan":
        return <Badge className="bg-blue-500">Sedang Berjalan</Badge>;
      case "Selesai":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "Dibatalkan":
        return <Badge className="bg-red-500">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Program</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Peserta</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.name}</TableCell>
              <TableCell>{program.category}</TableCell>
              <TableCell>{program.startDate}</TableCell>
              <TableCell>{program.duration}</TableCell>
              <TableCell>{program.participants}</TableCell>
              <TableCell>{getStatusBadge(program.status)}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onProgramClick(program)}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
