
import React, { useMemo } from "react";
import { useKols } from "@/hooks/useKols";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Star, DollarSign } from "lucide-react";

interface KolDashboardCardsProps {
  activeKols: number;
  totalKols: number;
}

export const KolDashboardCards: React.FC<KolDashboardCardsProps> = ({ 
  activeKols, 
  totalKols 
}) => {
  const { kols } = useKols();

  // Calculate total metrics from all KOLs
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalEngagement = 0;
    let engagementSamplesCount = 0;
    let totalConversions = 0;
    let conversionSamplesCount = 0;
    
    kols.forEach(kol => {
      // Sum revenue from metrics
      if (kol.metrics?.revenue) {
        totalRevenue += Number(kol.metrics.revenue);
      }
      
      // Calculate average engagement rate
      if (kol.engagement_rate) {
        totalEngagement += kol.engagement_rate;
        engagementSamplesCount++;
      }
      
      // Calculate conversion metrics
      if (kol.metrics?.purchases && kol.metrics?.clicks && kol.metrics.clicks > 0) {
        totalConversions += (kol.metrics.purchases / kol.metrics.clicks) * 100;
        conversionSamplesCount++;
      }
    });
    
    return {
      totalRevenue,
      averageEngagement: engagementSamplesCount > 0 ? totalEngagement / engagementSamplesCount : 0,
      averageConversion: conversionSamplesCount > 0 ? totalConversions / conversionSamplesCount : 0
    };
  }, [kols]);

  // Format currency function for Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white shadow-sm border">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total KOLs</p>
              <h3 className="text-2xl font-bold mt-1">{totalKols}</h3>
              <p className="text-xs text-gray-500 mt-1">{activeKols} active</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Engagement</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.averageEngagement.toFixed(2)}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">From all active KOLs</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Conversion</p>
              <h3 className="text-2xl font-bold mt-1">
                {metrics.averageConversion.toFixed(2)}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">From all KOL campaigns</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(metrics.totalRevenue)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">From all KOL campaigns</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
