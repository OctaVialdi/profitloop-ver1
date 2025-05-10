
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useOrganization } from "@/hooks/useOrganization";
import { AlertTriangle, Award, CheckCircle2, DollarSign, Users } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const SubscriptionAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<Record<string, number>>({});
  const [featureConversions, setFeatureConversions] = useState<{ feature: string; conversions: number }[]>([]);
  const [trialMetrics, setTrialMetrics] = useState<{ totalTrials: number; totalConversions: number; conversionRate: string }>({
    totalTrials: 0,
    totalConversions: 0,
    conversionRate: '0.00'
  });
  const { organization } = useOrganization();

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      try {
        // Track admin panel view
        subscriptionAnalyticsService.trackAdminPanelView('analytics', organization?.id);
        
        // Fetch analytics data
        const eventStats = await subscriptionAnalyticsService.getAnalyticsByEventType();
        setEventData(eventStats);
        
        // Fetch feature conversion data
        const featureData = await subscriptionAnalyticsService.getFeatureConversionAnalytics();
        setFeatureConversions(featureData);
        
        // Fetch trial conversion metrics
        const trialData = await subscriptionAnalyticsService.getTrialConversionMetrics();
        setTrialMetrics(trialData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [organization?.id]);
  
  // Transform data for charts
  const eventChartData = Object.entries(eventData).map(([name, value]) => ({
    name,
    count: value
  })).sort((a, b) => b.count - a.count);
  
  const featureChartData = featureConversions.slice(0, 5); // Top 5 features
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const conversionRateData = [
    { name: 'Converted', value: parseFloat(trialMetrics.conversionRate) },
    { name: 'Not Converted', value: 100 - parseFloat(trialMetrics.conversionRate) }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metrik Konversi Trial</CardTitle>
          <CardDescription>Statistik konversi dari trial ke langganan berbayar</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Total Trial</p>
                      <h3 className="text-2xl font-bold text-blue-700">{trialMetrics.totalTrials}</h3>
                    </div>
                    <Users className="h-10 w-10 text-blue-500" />
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-1">Total Konversi</p>
                      <h3 className="text-2xl font-bold text-green-700">{trialMetrics.totalConversions}</h3>
                    </div>
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-900 mb-1">Tingkat Konversi</p>
                      <h3 className="text-2xl font-bold text-amber-700">{trialMetrics.conversionRate}%</h3>
                    </div>
                    <Award className="h-10 w-10 text-amber-500" />
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Persentase Konversi</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={conversionRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {conversionRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : '#FF8042'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fitur yang Mendorong Konversi</CardTitle>
          <CardDescription>Fitur premium yang paling mendorong konversi langganan</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : featureChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
              <h3 className="text-lg font-medium">Belum ada data konversi</h3>
              <p className="text-muted-foreground">Data konversi akan muncul saat pengguna mengklik fitur premium dan melakukan checkout</p>
            </div>
          ) : (
            <ChartContainer 
              config={{
                conversion: {
                  label: "Konversi",
                  color: "#0088FE"
                }
              }} 
              className="h-72"
            >
              <BarChart data={featureChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="conversions" name="conversion" fill="#0088FE" />
              </BarChart>
            </ChartContainer>
          )}
          
          {featureChartData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Detail Fitur Konversi</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fitur</TableHead>
                    <TableHead className="text-right">Jumlah Konversi</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featureChartData.map((feature, idx) => {
                    const total = featureChartData.reduce((acc, f) => acc + f.conversions, 0);
                    const percentage = total > 0 ? ((feature.conversions / total) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <TableRow key={idx}>
                        <TableCell>{feature.feature}</TableCell>
                        <TableCell className="text-right">{feature.conversions}</TableCell>
                        <TableCell className="text-right">{percentage}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistik Event</CardTitle>
          <CardDescription>Distribusi event analitik berdasarkan jenis</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : eventChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
              <h3 className="text-lg font-medium">Belum ada data event</h3>
              <p className="text-muted-foreground">Data event akan muncul saat pengguna berinteraksi dengan fitur-fitur langganan</p>
            </div>
          ) : (
            <>
              <ChartContainer 
                config={eventChartData.reduce((acc, item) => {
                  acc[item.name] = { 
                    label: item.name,
                    color: COLORS[eventChartData.indexOf(item) % COLORS.length]
                  };
                  return acc;
                }, {} as Record<string, any>)} 
                className="h-96"
              >
                <BarChart data={eventChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" name="Jumlah" fill="#8884d8" />
                </BarChart>
              </ChartContainer>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Detail Event</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Event</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventChartData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionAnalytics;
