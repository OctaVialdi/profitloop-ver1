
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TrainingProgram {
  id: number;
  name: string;
  category: string;
  startDate: string;
  duration: string;
  participants: string;
  status: string;
}

interface TrainingDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  program: TrainingProgram;
}

export const TrainingDetailDialog: React.FC<TrainingDetailDialogProps> = ({
  isOpen,
  onClose,
  program
}) => {
  const [activeTab, setActiveTab] = useState("detail");

  // Mock data for tabs
  const getEndDate = (startDate: string, duration: string) => {
    // Simple function to generate an end date
    const days = parseInt(duration.split(' ')[0]);
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return `${date.getDate()} May 2025`;
  };
  
  const endDate = getEndDate(program.startDate, program.duration);
  
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

  const participants = [
    { name: "Agus Hermawan", department: "IT", status: "Disetujui" },
    { name: "Sarah Garcia", department: "Legal", status: "Disetujui" },
    { name: "John Doe", department: "IT", status: "Disetujui" },
    { name: "Emily Davis", department: "Marketing", status: "Disetujui" },
    { name: "Bambang Suprapto", department: "Operations", status: "Disetujui" },
    { name: "Sarah Garcia", department: "Legal", status: "Disetujui" },
    { name: "Rina Wati", department: "Customer Support", status: "Disetujui" },
    { name: "Robert Johnson", department: "Finance", status: "Disetujui" },
    { name: "Eko Prasetyo", department: "Sales", status: "Disetujui" },
    { name: "Dewi Lestari", department: "Marketing", status: "Disetujui" },
    { name: "Eko Prasetyo", department: "Sales", status: "Disetujui" },
    { name: "Agus Hermawan", department: "IT", status: "Disetujui" },
  ];

  const materials = [
    "Digital Marketing Handbook",
    "Case Studies PDF",
    "Analytics Templates"
  ];

  const objectives = [
    "Understand SEO fundamentals",
    "Create effective social media campaigns",
    "Measure marketing ROI"
  ];

  const trainer = program.name.includes("Marketing") 
    ? "Dr. Susan Lee"
    : program.name.includes("Java") 
      ? "Dr. James Wilson"
      : program.name.includes("Financial") 
        ? "Michael Smith, CFA"
        : "Prof. James Wilson";

  const location = program.name.includes("Marketing") 
    ? "Main Conference Room"
    : program.name.includes("Java") 
      ? "IT Training Lab"
      : program.name.includes("Financial") 
        ? "Finance Department"
        : "Executive Training Center";

  const budget = {
    allocated: program.name.includes("Leadership") ? "Rp 25.000.000" : "Rp 15.000.000",
    actual: program.name.includes("Leadership") ? "Rp 23.500.000" : "Rp 14.000.000",
    remaining: program.name.includes("Leadership") ? "Rp 1.500.000" : "Rp 1.000.000"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold">{program.name}</h2>
                <div className="text-gray-600 flex items-center gap-2 mt-1">
                  <span>{program.category}</span>
                  <span>•</span>
                  <span>{program.startDate} - {endDate}</span>
                  <span>•</span>
                  <span>{program.duration}</span>
                </div>
              </div>
              {getStatusBadge(program.status)}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Tabs defaultValue="detail" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <div className="px-6">
                <TabsList className="bg-transparent -mb-px h-auto p-0 justify-start gap-4">
                  <TabsTrigger
                    value="detail"
                    className={`border-b-2 rounded-none px-1 pb-3 ${
                      activeTab === "detail"
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Detail
                  </TabsTrigger>
                  <TabsTrigger
                    value="peserta"
                    className={`border-b-2 rounded-none px-1 pb-3 ${
                      activeTab === "peserta"
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Peserta ({participants.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="materi"
                    className={`border-b-2 rounded-none px-1 pb-3 ${
                      activeTab === "materi"
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Materi
                  </TabsTrigger>
                  <TabsTrigger
                    value="budget"
                    className={`border-b-2 rounded-none px-1 pb-3 ${
                      activeTab === "budget"
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    Budget
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="p-6">
              <TabsContent value="detail" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Deskripsi Program</h3>
                    <p className="text-gray-700">
                      {program.name.includes("Marketing")
                        ? "Comprehensive training on modern digital marketing strategies, SEO, SEM, and social media campaigns."
                        : program.name.includes("Leadership")
                        ? "Executive leadership training focusing on team management, strategic planning, and decision making."
                        : program.name.includes("Java")
                        ? "Advanced Java programming course covering enterprise development, multithreading, and cloud deployment."
                        : "Program pelatihan untuk meningkatkan keterampilan dan pengetahuan karyawan."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold mb-2">Trainer</h3>
                      <p>{trainer}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-2">Lokasi</h3>
                      <p>{location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2">Tujuan Program</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {program.name.includes("Leadership") && (
                    <div>
                      <h3 className="text-lg font-bold mb-2">Prasyarat</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Minimum 2 years of management experience</li>
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="peserta" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={index}>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.department}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {participant.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="materi" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold mb-4">Materi Training</h3>
                  
                  {materials.map((material, index) => (
                    <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                      <span className="font-medium">{material}</span>
                      <Button variant="outline">Download</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="budget" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold mb-4">Alokasi Budget</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="font-medium">Alokasi Budget</span>
                      <span className="font-bold text-lg">{budget.allocated}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-4">
                      <span className="font-medium">Biaya Aktual</span>
                      <span className="font-bold text-lg">{budget.actual}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sisa/Kelebihan</span>
                      <span className="font-bold text-lg text-green-600">{budget.remaining}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="p-6 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {program.status === "Selesai" ? "Tutup" : "Edit Program"}
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
