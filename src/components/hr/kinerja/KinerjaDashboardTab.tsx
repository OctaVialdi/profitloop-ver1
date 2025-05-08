
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  BarChart3, 
  ChevronUp,
  ChevronDown, 
  Star, 
  Clock, 
  UserCheck, 
  FileText,
  Calendar,
  Plus 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NewReviewDialog from "./NewReviewDialog";
import ReviewScheduleDialog from "./ReviewScheduleDialog";
import ReviewDetailDialog from "./ReviewDetailDialog";
import AnalyticsSheet from "./AnalyticsSheet";

const KinerjaDashboardTab: React.FC = () => {
  const [showNewReviewDialog, setShowNewReviewDialog] = useState(false);
  const [showReviewScheduleDialog, setShowReviewScheduleDialog] = useState(false);
  const [showAnalyticsSheet, setShowAnalyticsSheet] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Sample data for visualization
  const employeeReviews = [
    { id: 'rev-1', name: 'Ahmad Fauzi', department: 'Finance', period: 'Q1 2025', score: '4.7/5.0', status: 'Selesai', reviewedBy: 'Bambang Sudjatmiko' },
    { id: 'rev-2', name: 'Dewi Kartika', department: 'Marketing', period: 'Q1 2025', score: '4.5/5.0', status: 'Selesai', reviewedBy: 'Ratna Sari' },
    { id: 'rev-3', name: 'Budi Santoso', department: 'IT', period: 'Q1 2025', score: '4.8/5.0', status: 'Selesai', reviewedBy: 'Hendro Wijaya' },
    { id: 'rev-4', name: 'Rina Handayani', department: 'HR', period: 'Q1 2025', score: '-', status: 'Menunggu', reviewedBy: 'Siti Nuraini' },
    { id: 'rev-5', name: 'Joko Widodo', department: 'Operations', period: 'Q1 2025', score: '-', status: 'Draft', reviewedBy: 'Agus Hermawan' }
  ];

  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Performance Management</h2>
          <p className="text-muted-foreground">Monitor dan kelola kinerja karyawan</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowAnalyticsSheet(true)} className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button onClick={() => setShowReviewScheduleDialog(true)} variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Jadwal Review
          </Button>
          <Button onClick={() => setShowNewReviewDialog(true)} variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Review Baru
          </Button>
        </div>
      </div>

      {/* Performance overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Nilai Kinerja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">4.6</span>
                <span className="text-muted-foreground ml-1">/5.0</span>
              </div>
              <div className="flex items-center text-green-600">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+0.3</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Dari periode sebelumnya (Q4 2024)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status Review Q1 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-600">65%</span>
                <span className="text-xs text-muted-foreground">Selesai</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-500">20%</span>
                <span className="text-xs text-muted-foreground">Proses</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-amber-500">15%</span>
                <span className="text-xs text-muted-foreground">Belum</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
              <div className="flex h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-l-full" style={{ width: "65%" }}></div>
                <div className="bg-blue-500 h-2" style={{ width: "20%" }}></div>
                <div className="bg-amber-500 h-2 rounded-r-full" style={{ width: "15%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Review mendatang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
              <div>
                <div className="font-medium">Q2 2025 Review</div>
                <div className="text-xs text-muted-foreground">Mulai 30 Juni 2025</div>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
              <div>
                <div className="font-medium">Probation Review</div>
                <div className="text-xs text-muted-foreground">15 Mei 2025 (5 karyawan)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance metrics visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Distribusi Nilai Kinerja per Departemen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  IT
                </span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-purple-500" style={{ width: "96%" }}></div>
              </div>
            </div>
              
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  Finance
                </span>
                <span className="font-medium">4.5/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-green-500" style={{ width: "90%" }}></div>
              </div>
            </div>
              
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  Marketing
                </span>
                <span className="font-medium">4.3/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: "86%" }}></div>
              </div>
            </div>
              
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  HR
                </span>
                <span className="font-medium">4.0/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-indigo-500" style={{ width: "80%" }}></div>
              </div>
            </div>
              
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  Operations
                </span>
                <span className="font-medium">3.8/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-orange-500" style={{ width: "76%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent performance reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Review Kinerja Terbaru</CardTitle>
          <Button variant="outline" size="sm">
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {employeeReviews.map((employee) => (
              <div key={employee.id} 
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                onClick={() => handleEmployeeClick(employee)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.department} - {employee.period}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {employee.score !== '-' && (
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{employee.score}</span>
                    </div>
                  )}
                  <Badge variant={
                    employee.status === 'Selesai' ? 'default' :
                    employee.status === 'Menunggu' ? 'outline' : 'secondary'
                  } className={
                    employee.status === 'Selesai' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                    employee.status === 'Menunggu' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                    'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }>
                    {employee.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <NewReviewDialog isOpen={showNewReviewDialog} onClose={() => setShowNewReviewDialog(false)} />
      <ReviewScheduleDialog isOpen={showReviewScheduleDialog} onClose={() => setShowReviewScheduleDialog(false)} />
      <ReviewDetailDialog isOpen={showDetailDialog} onClose={() => setShowDetailDialog(false)} employee={selectedEmployee} />
      <AnalyticsSheet isOpen={showAnalyticsSheet} onClose={() => setShowAnalyticsSheet(false)} />
    </div>
  );
};

export default KinerjaDashboardTab;
