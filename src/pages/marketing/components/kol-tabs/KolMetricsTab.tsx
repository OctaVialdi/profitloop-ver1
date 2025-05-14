
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Edit } from "lucide-react";

interface KolMetricsTabProps {
  kolId: string;
}

interface Metrics {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  purchases: number;
  revenue: number;
  cost: number;
  roi: number;
  conversion_rate: number;
}

const KolMetricsTab: React.FC<KolMetricsTabProps> = ({ kolId }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("kol_metrics")
          .select("*")
          .eq("kol_id", kolId)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        setMetrics(data || null);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel(`kol_metrics_${kolId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kol_metrics', filter: `kol_id=eq.${kolId}` }, () => {
        fetchMetrics();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [kolId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-10 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No metrics data available</p>
        <Button className="mt-4">Add Metrics</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Performance Metrics</h3>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" /> Update Metrics
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <p className="text-2xl font-bold">{metrics.roi?.toFixed(2)}%</p>
              {metrics.roi > 0 ? (
                <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="ml-2 h-4 w-4 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">{metrics.conversion_rate?.toFixed(2)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">${metrics.revenue?.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">${metrics.cost?.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Likes</h4>
                <p className="text-xl font-bold">{metrics.likes?.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Comments</h4>
                <p className="text-xl font-bold">{metrics.comments?.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Shares</h4>
                <p className="text-xl font-bold">{metrics.shares?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Clicks</h4>
                <p className="text-xl font-bold">{metrics.clicks?.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Purchases</h4>
                <p className="text-xl font-bold">{metrics.purchases?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KolMetricsTab;
