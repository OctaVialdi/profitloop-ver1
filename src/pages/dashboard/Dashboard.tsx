
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";
import TrialMilestone from "@/components/trial/TrialMilestone";
import TrialDashboard from "@/components/trial/TrialDashboard";
import TrialPersonalizedRecommendation from "@/components/trial/TrialPersonalizedRecommendation";

export default function Dashboard() {
  const { organization } = useOrganization();
  
  return (
    <div className="space-y-6">
      {/* Trial-related milestone notifications */}
      <TrialMilestone milestoneId="first-day" />
      <TrialMilestone milestoneId="25-percent" />
      <TrialMilestone milestoneId="50-percent" />
      <TrialMilestone milestoneId="75-percent" />
      <TrialMilestone milestoneId="final-day" />
      
      {/* Welcome heading */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Selamat datang di dashboard {organization?.name || "Anda"}
        </p>
      </div>
      
      {/* Trial dashboard for users in trial period */}
      <TrialDashboard />
      
      {/* Main content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp45.231.000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% dibandingkan bulan lalu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Karyawan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">
              +4 karyawan baru bulan ini
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absensi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Tingkat kehadiran minggu ini
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penggunaan Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organization?.subscription_status === 'active' ? (
                'Premium'
              ) : (
                organization?.trial_expired ? 'Berakhir' : 'Aktif'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {organization?.subscription_status === 'active' ? (
                'Berlangganan aktif'
              ) : (
                organization?.trial_expired ? (
                  <a href="/settings/subscription" className="text-blue-600 hover:underline">
                    Upgrade sekarang
                  </a>
                ) : (
                  'Masa uji coba sedang berlangsung'
                )
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional dashboard components can be added here */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Organisasi</CardTitle>
            <CardDescription>
              Ringkasan aktivitas dalam organisasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Data aktivitas akan muncul di sini
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
