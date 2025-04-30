
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, Building, Calendar, Settings, Shield, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { 
    organization, 
    userProfile, 
    isLoading, 
    error, 
    isSuperAdmin, 
    isAdmin, 
    isTrialActive, 
    daysLeftInTrial 
  } = useOrganization();

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-5 w-96 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Selamat datang kembali di {organization?.name || "-"}
            {isSuperAdmin && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <Shield className="w-3 h-3 mr-1" /> Super Admin
            </span>}
            {isAdmin && !isSuperAdmin && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" /> Admin
            </span>}
          </p>
        </header>
        
        {isTrialActive && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">
                Anda sedang dalam periode trial
              </p>
              <p className="text-blue-700 text-sm">
                {daysLeftInTrial} hari lagi sebelum trial berakhir.
              </p>
            </div>
            {isAdmin && (
              <Button asChild variant="outline" className="ml-auto bg-white">
                <Link to="/subscription">Berlangganan Sekarang</Link>
              </Button>
            )}
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Organisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">{organization?.name || "-"}</span>
                </div>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/organization/edit">Edit</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Anggota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">{organization?.employee_count || 1} Anggota</span>
                </div>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/invite">Undang</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold capitalize">
                    {isTrialActive ? "Trial" : (organization?.subscription_plan_id ? "Aktif" : "Tidak Aktif")}
                  </span>
                </div>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/subscription">Kelola</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fitur Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Manajemen Anggota</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Kolaborasi Organisasi</span>
                </li>
                {isAdmin && (
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Pengaturan Organisasi</span>
                  </li>
                )}
              </ul>
              
              {isAdmin && (
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/collaborations">Kelola Kolaborasi</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Home className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p>Belum ada aktivitas terbaru</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
