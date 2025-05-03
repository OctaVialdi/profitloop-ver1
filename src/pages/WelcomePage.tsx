
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Calendar, Home, UserPlus, Building, Shield, CreditCard, Timer } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const WelcomePage = () => {
  const { organization, isLoading, daysLeftInTrial, isTrialActive, hasPaidSubscription, subscriptionPlan } = useOrganization();
  const [countdownString, setCountdownString] = useState<string>('');
  const navigate = useNavigate();
  
  // Calculate the countdown string when the organization data is loaded
  useEffect(() => {
    if (isLoading || !organization?.trial_end_date) return;
    
    const updateCountdown = () => {
      const trialEndDate = new Date(organization.trial_end_date!);
      const now = new Date();
      const diffTime = trialEndDate.getTime() - now.getTime();
      
      if (diffTime <= 0) {
        setCountdownString('0 hari 00:00:00');
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      // Format as "X hari HH:MM:SS"
      const formattedTime = `${days} hari ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setCountdownString(formattedTime);
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for updating the countdown
    const interval = setInterval(updateCountdown, 1000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [isLoading, organization?.trial_end_date]);
  
  const features = [
    {
      name: "Manajemen Anggota",
      description: "Kelola anggota organisasi dengan mudah",
      icon: User,
      path: "/invite",
    },
    {
      name: "Kolaborasi Antar Organisasi",
      description: "Bekerja sama dengan organisasi lain",
      icon: Building,
      path: "/collaborations",
    },
    {
      name: hasPaidSubscription ? "Paket Premium Aktif" : "Masa Trial",
      description: hasPaidSubscription 
        ? `Paket ${subscriptionPlan?.name} aktif`
        : `Akses semua fitur premium selama ${countdownString || `${daysLeftInTrial} hari`}`,
      icon: hasPaidSubscription ? CreditCard : Timer,
      path: "/subscription",
    },
    {
      name: "Dashboard Terpadu",
      description: "Pantau semua aktivitas dalam satu tampilan",
      icon: Home,
      path: "/dashboard",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 trial-exempt">
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
        
        {isTrialActive && !hasPaidSubscription && (
          <div className="px-6 pb-2">
            <Alert className="bg-blue-50 border-blue-200">
              <Timer className="h-4 w-4 text-blue-600" />
              <AlertTitle>Masa Trial Aktif</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  <Progress value={(daysLeftInTrial / 30) * 100} className="h-2" />
                  <p className="text-sm text-blue-700">
                    Anda memiliki <span className="font-medium">{countdownString || `${daysLeftInTrial} hari`}</span> lagi untuk menikmati semua fitur premium.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="flex items-start space-x-4 p-4 border rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
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
            {hasPaidSubscription 
              ? `Anda menggunakan paket ${subscriptionPlan?.name || "Premium"}. Nikmati semua fitur tanpa batasan.`
              : `Anda memiliki masa trial ${countdownString || `${daysLeftInTrial} hari`} lagi. Berlangganan untuk menikmati semua fitur premium.`}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomePage;
