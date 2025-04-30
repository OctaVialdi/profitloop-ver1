
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, Building, Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // This would be fetched from Supabase after integration
  const organization = {
    name: "PT Example Corp",
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    memberCount: 3,
    role: "super_admin",
    subscription: "trial"
  };

  // Calculate days remaining in trial
  const daysRemaining = Math.ceil((organization.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang kembali di {organization.name}</p>
        </header>
        
        {organization.subscription === "trial" && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">
                Anda sedang dalam periode trial
              </p>
              <p className="text-blue-700 text-sm">
                {daysRemaining} hari lagi sebelum trial berakhir.
              </p>
            </div>
            <Button asChild variant="outline" className="ml-auto bg-white">
              <Link to="/subscription">Berlangganan Sekarang</Link>
            </Button>
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
                  <span className="font-semibold">{organization.name}</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/organization/edit">Edit</Link>
                </Button>
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
                  <span className="font-semibold">{organization.memberCount} Anggota</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/invite">Undang</Link>
                </Button>
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
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold capitalize">{organization.subscription}</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/subscription">Kelola</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>Belum ada aktivitas terbaru</p>
              <Button variant="outline" className="mt-4">
                Mulai Menggunakan Aplikasi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
