
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";
import { useOrganization } from "@/hooks/useOrganization";
import SubscriptionAnalytics from '@/components/admin/SubscriptionAnalytics';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { organization } = useOrganization();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has admin access (only papadhanta@gmail.com)
  const hasAdminAccess = user?.email === 'papadhanta@gmail.com';
  
  useEffect(() => {
    // Redirect if no admin access
    if (user && !hasAdminAccess) {
      navigate('/settings/subscription');
    }
    
    // Track admin panel view
    if (hasAdminAccess) {
      subscriptionAnalyticsService.trackAdminPanelView('main', organization?.id);
    }
  }, [user, hasAdminAccess, navigate, organization?.id]);
  
  if (!hasAdminAccess) {
    return (
      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Akses Terbatas</h2>
          <p className="text-gray-600 text-center max-w-md">
            Maaf, halaman ini hanya tersedia untuk administrator sistem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8" data-admin-page="true">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600">
          Panel monitoring dan analitik untuk administrator sistem
        </p>
      </div>
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analitik Langganan</TabsTrigger>
          <TabsTrigger value="trials">Manajemen Trial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <SubscriptionAnalytics />
        </TabsContent>
        
        <TabsContent value="trials">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Trial</CardTitle>
              <CardDescription>Monitor dan kelola status trial pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold">Fitur Sedang Dibangun</h3>
                <p className="text-gray-600 mt-2 max-w-md">
                  Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
