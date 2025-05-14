
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useKols } from "@/hooks/useKols";

export const MetricsTab: React.FC = () => {
  const { kols } = useKols();
  
  const [metrics, setMetrics] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0,
  });

  // Calculate metrics based on real data
  useEffect(() => {
    // Calculate revenue from all KOLs that have metrics
    let totalRevenue = 0;
    let totalCost = 0;
    let totalPurchases = 0;
    let totalClicks = 0;
    let totalEngagement = 0;
    let kolsWithMetricsCount = 0;

    kols.forEach(kol => {
      if (kol.metrics) {
        totalRevenue += Number(kol.metrics.revenue) || 0;
        totalCost += Number(kol.metrics.cost) || 0;
        totalPurchases += Number(kol.metrics.purchases) || 0;
        totalClicks += Number(kol.metrics.clicks) || 0;
        totalEngagement += (Number(kol.metrics.likes) || 0) + 
                           (Number(kol.metrics.comments) || 0) + 
                           (Number(kol.metrics.shares) || 0);
        kolsWithMetricsCount++;
      }
    });

    // Update metrics state with calculated values
    setMetrics(prev => ({
      ...prev,
      revenue: totalRevenue,
      cost: totalCost,
      purchases: totalPurchases,
      clicks: totalClicks,
    }));
  }, [kols]);

  // Calculate derived metrics
  const conversionRate = metrics.clicks > 0 
    ? ((metrics.purchases / metrics.clicks) * 100).toFixed(2)
    : "0.00";

  // Calculate ROI
  const roi = metrics.cost > 0 
    ? (((metrics.revenue - metrics.cost) / metrics.cost) * 100).toFixed(2)
    : "0.00";

  // Format currency - IDR
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <h4 className="font-semibold mb-1">Performance Metrics</h4>
      <p className="text-sm text-gray-500 mb-6">Track and update key performance metrics for this KOL</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-purple-800 text-lg font-bold">
            {metrics.clicks > 0 && metrics.purchases > 0
              ? `${conversionRate}%`
              : "N/A"}
          </p>
          <p className="text-sm text-purple-700">Engagement Rate</p>
          <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-bold">
            {metrics.cost > 0 && metrics.revenue > 0
              ? `${roi}%`
              : "N/A%"}
          </p>
          <p className="text-sm text-blue-700">ROI</p>
          <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-800 text-lg font-bold">
            {metrics.clicks > 0 && metrics.purchases > 0
              ? `${conversionRate}%`
              : "N/A"}
          </p>
          <p className="text-sm text-green-700">Conversion Rate</p>
          <p className="text-xs text-green-600 mt-1">Purchases / Clicks * 100</p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h5 className="font-medium mb-4">Engagement Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Likes</label>
              <Input type="number" placeholder="0" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <Input type="number" placeholder="0" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shares</label>
              <Input type="number" placeholder="0" disabled />
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Conversion Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Clicks</label>
              <Input 
                type="number" 
                placeholder="0"
                value={metrics.clicks.toString()}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchases</label>
              <Input 
                type="number" 
                placeholder="0"
                value={metrics.purchases.toString()}
                disabled
              />
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Financial Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Revenue (IDR)</label>
              <Input 
                type="text" 
                placeholder="0" 
                value={formatCurrency(metrics.revenue)}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Total from {kols.length} KOL campaigns
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost (IDR)</label>
              <Input 
                type="text" 
                placeholder="0" 
                value={formatCurrency(metrics.cost)}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
