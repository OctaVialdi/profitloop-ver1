
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import EngagementAnalysis from "./EngagementAnalysis";
import ConversionMetrics from "./ConversionMetrics";
import RoiAnalysis from "./RoiAnalysis";

const KolDashboardCards: React.FC = () => {
  const [stats, setStats] = useState({
    totalKols: 0,
    activeProjects: 0,
    avgEngagement: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get total KOLs
        const { data: kolsData, error: kolsError } = await supabase
          .from('data_kol')
          .select('id');
        
        if (kolsError) throw kolsError;
        
        // Get average engagement
        const { data: engagementData, error: engagementError } = await supabase
          .from('kol_social_media')
          .select('engagement_rate');
        
        if (engagementError) throw engagementError;
        
        // Get total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('kol_metrics')
          .select('revenue');
        
        if (revenueError) throw revenueError;
        
        // Calculate metrics
        const totalKols = kolsData?.length || 0;
        const activeProjects = Math.floor(totalKols * 0.7); // Simplified calculation
        const avgEngagement = engagementData?.length 
          ? engagementData.reduce((sum, item) => sum + (item.engagement_rate || 0), 0) / engagementData.length 
          : 0;
        const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;
        
        setStats({
          totalKols,
          activeProjects,
          avgEngagement,
          totalRevenue
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('kol_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'data_kol' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kol_social_media' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kol_metrics' }, () => fetchDashboardData())
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total KOLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : stats.totalKols}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loading ? "..." : stats.activeProjects}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : `${stats.avgEngagement.toFixed(2)}%`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementAnalysis />
        <ConversionMetrics />
      </div>
      
      <div>
        <RoiAnalysis />
      </div>
    </div>
  );
};

export default KolDashboardCards;
