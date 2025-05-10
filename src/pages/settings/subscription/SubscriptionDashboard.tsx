import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Info, CreditCard, Users, Calendar } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/types/organization';

const SubscriptionDashboard = () => {
  const { organization, hasPaidSubscription } = useOrganization();
  const { isTrialActive, daysLeftInTrial, progress } = useTrialStatus(organization?.id || null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  
  // Fetch current subscription plan
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (organization?.subscription_plan_id) {
        try {
          const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('id', organization.subscription_plan_id)
            .single();
            
          if (!error && data) {
            setCurrentPlan({
              ...data,
              features: data.features as Record<string, any> | null
            });
          }
        } catch (err) {
          console.error('Error fetching subscription plan:', err);
        }
      }
    };
    
    fetchCurrentPlan();
  }, [organization]);
  
  // Calculate subscription status
  const subscriptionStatus = () => {
    if (hasPaidSubscription) return "active";
    if (isTrialActive) return "trial";
    return "expired";
  };
  
  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), 'd MMMM yyyy', { locale: idLocale });
  };
  
  // Sample usage data for charts
  const usageData = [
    { name: '1 Jan', usage: 4 },
    { name: '2 Jan', usage: 3 },
    { name: '3 Jan', usage: 5 },
    { name: '4 Jan', usage: 7 },
    { name: '5 Jan', usage: 6 },
    { name: '6 Jan', usage: 8 },
    { name: '7 Jan', usage: 9 },
  ];
  
  // Sample data for pie chart
  const featureUsageData = [
    { name: 'Dokumen', value: 35 },
    { name: 'Karyawan', value: 25 },
    { name: 'Kontrak', value: 20 },
    { name: 'Lainnya', value: 20 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Dashboard Langganan</h1>
        <p className="text-gray-600">
          Pantau penggunaan dan status langganan organisasi Anda
        </p>
      </div>
      
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status Langganan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <Badge className={
                subscriptionStatus() === "active" ? "bg-green-100 text-green-800" : 
                subscriptionStatus() === "trial" ? "bg-blue-100 text-blue-800" :
                "bg-amber-100 text-amber-800"
              }>
                {subscriptionStatus() === "active" ? "Aktif" : 
                 subscriptionStatus() === "trial" ? "Trial" : 
                 "Berakhir"}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              {currentPlan?.name || (isTrialActive ? "Trial" : "Basic")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {hasPaidSubscription 
                ? "Berlangganan Premium" 
                : isTrialActive 
                ? `${daysLeftInTrial} hari tersisa dalam trial`
                : "Trial telah berakhir"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <Badge variant="outline">Member</Badge>
            </div>
            <h3 className="text-2xl font-bold mt-2">3 / {currentPlan?.max_members || 'Unlimited'}</h3>
            <p className="text-sm text-gray-500 mt-1">Anggota aktif dalam organisasi</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tanggal Penting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Calendar className="h-6 w-6 text-blue-600" />
              <Badge variant="outline">Jadwal</Badge>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium">
                {isTrialActive ? "Trial berakhir:" : hasPaidSubscription ? "Perpanjangan otomatis:" : "Trial berakhir:"}
              </div>
              <div>
                {formatDate(organization?.trial_end_date) || "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress bar for trial */}
      {isTrialActive && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Waktu Trial Tersisa</CardTitle>
            <CardDescription>
              Masa trial aktif selama 14 hari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Hari ke-1</span>
                <span>Hari ke-14</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm font-medium">
                {daysLeftInTrial} hari tersisa
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Penggunaan Langganan</CardTitle>
            <CardDescription>
              Statistik penggunaan fitur dalam 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribusi Penggunaan Fitur</CardTitle>
            <CardDescription>
              Persentase penggunaan fitur berbayar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={featureUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {featureUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tips and Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle>Tips Langganan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Maksimalkan masa trial Anda</h4>
              <p className="text-sm text-gray-600">
                Jelajahi semua fitur premium selama masa trial untuk menilai mana yang paling bermanfaat bagi organisasi Anda.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Tingkatkan ke paket premium</h4>
              <p className="text-sm text-gray-600">
                Dapatkan akses tanpa batas ke semua fitur dengan berlangganan paket premium. Fitur seperti laporan lanjutan dan AI assistant hanya tersedia untuk pelanggan premium.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Pertanyaan lainnya?</h4>
              <p className="text-sm text-gray-600">
                Kunjungi halaman <a href="/settings/subscription/faq" className="text-blue-600 hover:underline">FAQ</a> untuk informasi lebih lanjut tentang paket langganan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionDashboard;
