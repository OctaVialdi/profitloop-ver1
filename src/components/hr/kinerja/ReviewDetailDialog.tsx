
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EmployeeReview {
  id: string;
  name: string;
  department: string;
  period: string;
  score: string;
  status: string;
  reviewedBy: string;
}

interface ReviewDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeReview | null;
}

const ReviewDetailDialog: React.FC<ReviewDetailDialogProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-xl">Detail Review Kinerja</DialogTitle>
          <div className="shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              employee?.status === "Selesai" ? "bg-green-100 text-green-800" :
              employee?.status === "Menunggu" ? "bg-blue-100 text-blue-800" :
              employee?.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {employee?.status}
            </span>
          </div>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="kpi" className="flex-1">KPI & Kompetensi</TabsTrigger>
            <TabsTrigger value="feedback" className="flex-1">Feedback & Komentar</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="pt-4 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">{employee?.name}</h3>
              <p className="text-muted-foreground">{employee?.department} Specialist - {employee?.department}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm text-muted-foreground">Periode Review</h4>
                <p className="font-semibold">{employee?.period}</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Tanggal Review</h4>
                <p className="font-semibold">01 Jan 2025 - 31 Mar 2025</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm text-muted-foreground">Direview Oleh</h4>
                <p className="font-semibold">{employee?.reviewedBy}</p>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground">Tanggal Submit</h4>
                <p className="font-semibold">
                  {employee?.status === "Selesai" ? "15 Mar 2025" : "Belum disubmit"}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground">Nilai Keseluruhan</h4>
              <p className="text-2xl font-bold mt-1">
                {employee?.score !== "-" ? employee?.score : "Belum dinilai"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground">Komentar</h4>
              <p className="mt-1">
                {employee?.status === "Selesai" 
                  ? "Karyawan telah menunjukkan performa yang baik selama Q1 2025. Konsisten dalam mencapai target dan memiliki komunikasi yang baik dengan tim." 
                  : "Tidak ada komentar"}
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="16" height="18" x="4" y="3" rx="2"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h8"/></svg>
                Cetak
              </Button>
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Unduh PDF
              </Button>
            </div>
          </TabsContent>
          
          {/* KPI Tab */}
          <TabsContent value="kpi" className="pt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
              <p className="text-muted-foreground text-sm">Penilaian berdasarkan target dan pencapaian KPI</p>
              
              {employee?.status === "Selesai" ? (
                <div className="mt-4 border rounded-md p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Delivery Tepat Waktu</span>
                      <span>5/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "100%"}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Quality of Work</span>
                      <span>4/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "80%"}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Target Revenue</span>
                      <span>4/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "80%"}}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 border rounded-md p-6 text-center text-muted-foreground">
                  Belum ada KPI yang diinput untuk review ini
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Kompetensi & Soft Skills</h3>
              <p className="text-muted-foreground text-sm">Penilaian terhadap kemampuan dan perilaku kerja</p>
              
              {employee?.status === "Selesai" ? (
                <div className="mt-4 border rounded-md p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Komunikasi</span>
                      <span>5/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: "100%"}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Teamwork</span>
                      <span>5/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: "100%"}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Inisiatif</span>
                      <span>4/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: "80%"}}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 border rounded-md p-6 text-center text-muted-foreground">
                  Belum ada data kompetensi yang diinput untuk review ini
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Feedback Tab */}
          <TabsContent value="feedback" className="pt-4 space-y-6">
            <div>
              <h3 className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span className="font-semibold">Feedback & Diskusi</span>
              </h3>
              
              {employee?.status === "Selesai" ? (
                <div className="mt-4 space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{employee.reviewedBy}</p>
                        <p className="text-xs text-muted-foreground">15 Mar 2025, 10:30</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Manager</span>
                    </div>
                    <p className="mt-2">
                      {employee.name} telah menunjukkan kinerja yang baik selama Q1. Komunikasi dan kolaborasi dengan tim sangat baik, dan berhasil menyelesaikan semua pekerjaan tepat waktu.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">14 Mar 2025, 16:45</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Self</span>
                    </div>
                    <p className="mt-2">
                      Saya merasa puas dengan pencapaian di Q1 ini. Saya berhasil menyelesaikan semua proyek tepat waktu dan mendapatkan feedback positif dari klien. Target untuk Q2 adalah meningkatkan skill teknis saya.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 border rounded-md p-6 text-center text-muted-foreground">
                  Belum ada komentar atau feedback untuk review ini
                </div>
              )}
            </div>
            
            <div>
              <h3 className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                <span className="font-semibold">Status Persetujuan</span>
              </h3>
              
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Self Assessment</p>
                    <p className="text-sm text-muted-foreground">Karyawan</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee?.status === "Selesai" || employee?.status === "Draft" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {employee?.status === "Selesai" || employee?.status === "Draft" ? "Selesai" : "Menunggu"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">Manager Review</p>
                    <p className="text-sm text-muted-foreground">Supervisor Langsung</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee?.status === "Selesai" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {employee?.status === "Selesai" ? "Selesai" : "Menunggu"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">HR Approval</p>
                    <p className="text-sm text-muted-foreground">Human Resources Department</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee?.status === "Selesai" ? "bg-green-100 text-green-800" : 
                    employee?.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {employee?.status === "Selesai" ? "Selesai" : 
                     employee?.status === "Menunggu" ? "Pending" : "Menunggu"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium">Final Approval</p>
                    <p className="text-sm text-muted-foreground">Department Head</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee?.status === "Selesai" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {employee?.status === "Selesai" ? "Selesai" : "Menunggu"}
                  </span>
                </div>
              </div>
            </div>
            
            {employee?.status === "Menunggu" && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="destructive">Tolak</Button>
                <Button>Setujui</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailDialog;
