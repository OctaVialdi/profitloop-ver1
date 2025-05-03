
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChartBar, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import ReviewScheduleDialog from "@/components/hr/kinerja/ReviewScheduleDialog";
import AnalyticsSheet from "@/components/hr/kinerja/AnalyticsSheet";
import NewReviewDialog from "@/components/hr/kinerja/NewReviewDialog";
import ReviewDetailDialog from "@/components/hr/kinerja/ReviewDetailDialog";

// Mock data for employee reviews
const mockEmployeeReviews = [
  { 
    id: "1", 
    name: "Daniel Wilson", 
    department: "HR", 
    period: "Q1 2025", 
    score: "-", 
    status: "Menunggu", 
    reviewedBy: "Jane Smith"
  },
  { 
    id: "2", 
    name: "Emily Davis", 
    department: "Marketing", 
    period: "Q1 2025", 
    score: "5/6", 
    status: "Selesai", 
    reviewedBy: "John Doe"
  },
  { 
    id: "3", 
    name: "Jane Smith", 
    department: "HR", 
    period: "Q1 2025", 
    score: "5/6", 
    status: "Selesai", 
    reviewedBy: "Sarah Williams"
  },
  { 
    id: "4", 
    name: "John Doe", 
    department: "Marketing", 
    period: "Q1 2025", 
    score: "6/6", 
    status: "Selesai", 
    reviewedBy: "Emily Davis"
  },
  { 
    id: "5", 
    name: "Michael Brown", 
    department: "IT", 
    period: "Q1 2025", 
    score: "6/6", 
    status: "Selesai", 
    reviewedBy: "Robert Johnson"
  },
  { 
    id: "6", 
    name: "Olivia Taylor", 
    department: "Finance", 
    period: "Q1 2025", 
    score: "4/6", 
    status: "Selesai", 
    reviewedBy: "Sarah Williams"
  },
  { 
    id: "7", 
    name: "Robert Johnson", 
    department: "IT", 
    period: "Q1 2025", 
    score: "-", 
    status: "Draft", 
    reviewedBy: "Michael Brown"
  },
  { 
    id: "8", 
    name: "Sarah Williams", 
    department: "Finance", 
    period: "Q1 2025", 
    score: "-", 
    status: "Terlambat", 
    reviewedBy: "Olivia Taylor"
  }
];

// Mock data for upcoming reviews
const mockUpcomingReviews = [
  {
    id: "1",
    title: "Q2 Performance Review",
    date: "30 June 2025",
    employeeCount: 35
  },
  {
    id: "2",
    title: "Probation Review - New Hires",
    date: "15 May 2025",
    employeeCount: 5
  },
  {
    id: "3",
    title: "Mid-Year Leadership Evaluation",
    date: "15 July 2025",
    employeeCount: 8
  }
];

// Mock data for department KPI
const mockDepartmentKPI = [
  { department: "IT", percentage: 92 },
  { department: "Finance", percentage: 88 },
  { department: "Marketing", percentage: 85 },
  { department: "HR", percentage: 78 },
  { department: "Operations", percentage: 75 }
];

export default function HRKinerja() {
  const [activeTab, setActiveTab] = useState("review");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  
  // Dialog states
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showAnalyticsSheet, setShowAnalyticsSheet] = useState(false);
  const [showNewReviewDialog, setShowNewReviewDialog] = useState(false);
  const [showReviewDetailDialog, setShowReviewDetailDialog] = useState(false);

  const { toast } = useToast();

  // Filter employees based on search, department and status
  const filteredEmployees = mockEmployeeReviews.filter(employee => {
    const matchSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDepartment = !selectedDepartment || selectedDepartment === "all" || employee.department === selectedDepartment;
    const matchStatus = !selectedStatus || selectedStatus === "all" || employee.status === selectedStatus;
    
    return matchSearch && matchDepartment && matchStatus;
  });

  const handleViewReview = (employee: any) => {
    setSelectedEmployee(employee);
    setShowReviewDetailDialog(true);
  };

  const handleScheduleClick = () => {
    setShowScheduleDialog(true);
  };

  const handleAnalyticsClick = () => {
    setShowAnalyticsSheet(true);
  };

  const handleNewReviewClick = () => {
    setShowNewReviewDialog(true);
  };

  const handleCloseDialog = () => {
    setShowScheduleDialog(false);
    setShowNewReviewDialog(false);
    setShowReviewDetailDialog(false);
  };

  const handleCloseSheet = () => {
    setShowAnalyticsSheet(false);
  };

  const getDepartmentFilterLabel = () => {
    if (!selectedDepartment || selectedDepartment === "all") {
      return "Semua Departemen";
    }
    return selectedDepartment;
  };

  const getStatusFilterLabel = () => {
    if (!selectedStatus || selectedStatus === "all") {
      return "Semua Status";
    }
    return selectedStatus;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kinerja Karyawan</h1>
          <p className="text-muted-foreground">Kelola dan evaluasi kinerja karyawan perusahaan</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleScheduleClick}
            className="whitespace-nowrap"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Jadwal Review
          </Button>
          <Button 
            variant="outline"
            onClick={handleAnalyticsClick}
            className="whitespace-nowrap"
          >
            <ChartBar className="mr-2 h-4 w-4" />
            Analitik
          </Button>
          <Button 
            onClick={handleNewReviewClick}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Review Baru
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="review" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="review">Review Kinerja</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Review Kinerja Terbaru</CardTitle>
                  <CardDescription>Review periode Q1 2025</CardDescription>
                </div>
                <Button variant="outline" className="ml-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Periode Lain
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row items-center mb-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="search"
                    placeholder="Cari karyawan atau departemen..."
                    className="pl-9 pr-4 py-2 w-full border rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 ml-auto">
                  <Select
                    value={selectedDepartment || "all"}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Departemen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Departemen</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={selectedStatus || "all"}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Terlambat">Terlambat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">NAMA</TableHead>
                      <TableHead>DEPARTEMEN</TableHead>
                      <TableHead>PERIODE</TableHead>
                      <TableHead>NILAI</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">AKSI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.period}</TableCell>
                          <TableCell>{employee.score}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === "Selesai" ? "bg-green-100 text-green-800" :
                              employee.status === "Menunggu" ? "bg-blue-100 text-blue-800" :
                              employee.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {employee.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewReview(employee)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                              <span className="sr-only">View</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                toast({
                                  title: "Edit Review",
                                  description: `Editing review for ${employee.name}`,
                                });
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No reviews found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Review Mendatang
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUpcomingReviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="flex justify-between items-center border-b last:border-0 pb-3 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{review.title}</h3>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs font-medium">
                        {review.employeeCount} karyawan
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pencapaian KPI Tim</CardTitle>
                  <CardDescription>Persentase pencapaian KPI per departemen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDepartmentKPI.map((dept) => (
                    <div key={dept.department} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>{dept.department}</span>
                        <span className="font-medium">{dept.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dept.department === "IT" ? "bg-purple-500" :
                            dept.department === "Finance" ? "bg-green-500" :
                            dept.department === "Marketing" ? "bg-blue-500" :
                            dept.department === "HR" ? "bg-indigo-500" :
                            "bg-orange-500"
                          }`}
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Review Kinerja</CardTitle>
              <CardDescription>
                Kelola template, kriteria, dan jadwal review kinerja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Settings content will be implemented in the future.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Review Schedule Dialog */}
      <ReviewScheduleDialog 
        isOpen={showScheduleDialog} 
        onClose={handleCloseDialog} 
      />

      {/* Analytics Sheet */}
      <AnalyticsSheet 
        isOpen={showAnalyticsSheet} 
        onClose={handleCloseSheet} 
      />

      {/* New Review Dialog */}
      <NewReviewDialog 
        isOpen={showNewReviewDialog} 
        onClose={handleCloseDialog} 
      />

      {/* Review Detail Dialog */}
      <ReviewDetailDialog 
        isOpen={showReviewDetailDialog} 
        onClose={handleCloseDialog}
        employee={selectedEmployee}
      />
    </div>
  );
}
