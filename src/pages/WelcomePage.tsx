
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Calendar, Home, UserPlus } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { Skeleton } from "@/components/ui/skeleton";

const WelcomePage = () => {
  const { organization, isLoading, daysLeftInTrial } = useOrganization();
  
  const features = [
    {
      name: "Manajemen Anggota",
      description: "Kelola anggota organisasi dengan mudah",
      icon: User,
    },
    {
      name: "Kolaborasi Antar Organisasi",
      description: "Bekerja sama dengan organisasi lain",
      icon: UserPlus,
    },
    {
      name: "Masa Trial 30 Hari",
      description: "Akses semua fitur premium selama 30 hari",
      icon: Calendar,
    },
    {
      name: "Dashboard Terpadu",
      description: "Pantau semua aktivitas dalam satu tampilan",
      icon: Home,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <Card className="w-full max-w-4xl">
          <CardHeader className="space-y-1">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex gap-4 w-full justify-center">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            Selamat datang di Multi-Tenant App, {organization?.name || ""}!
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Anda telah berhasil membuat organisasi. Berikut adalah fitur-fitur yang bisa Anda gunakan:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-start space-x-4 p-4 border rounded-lg bg-white">
                <div className="bg-blue-100 p-2 rounded-full">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.name}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button asChild>
              <Link to="/invite">
                <UserPlus className="mr-2 h-4 w-4" />
                Undang Anggota
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/subscription">
                <Settings className="mr-2 h-4 w-4" />
                Kelola Subscription
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Masuk ke Beranda
              </Link>
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Anda memiliki masa trial {daysLeftInTrial} hari lagi. Berlangganan untuk menikmati semua fitur premium.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomePage;
