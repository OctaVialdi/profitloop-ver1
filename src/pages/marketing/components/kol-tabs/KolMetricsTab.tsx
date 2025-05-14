
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useKols } from "@/hooks/useKols";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

interface KolMetricsTabProps {
  selectedKol: any;
}

export const KolMetricsTab: React.FC<KolMetricsTabProps> = ({ selectedKol }) => {
  const { updateMetrics, isUpdating } = useKols();
  const [metricsData, setMetricsData] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0
  });
  
  // Calculate derived metrics
  const conversionRate = metricsData.clicks > 0 
    ? ((metricsData.purchases / metricsData.clicks) * 100).toFixed(2) 
    : "0.00";
    
  const roi = metricsData.cost > 0 
    ? (((metricsData.revenue - metricsData.cost) / metricsData.cost) * 100).toFixed(2)
    : "0.00";
  
  // Initialize the form with existing metrics data if available
  useEffect(() => {
    if (selectedKol?.metrics) {
      setMetricsData({
        likes: selectedKol.metrics.likes || 0,
        comments: selectedKol.metrics.comments || 0,
        shares: selectedKol.metrics.shares || 0,
        clicks: selectedKol.metrics.clicks || 0,
        purchases: selectedKol.metrics.purchases || 0,
        revenue: selectedKol.metrics.revenue || 0,
        cost: selectedKol.metrics.cost || 0
      });
    }
  }, [selectedKol]);
  
  const handleChange = (field: keyof typeof metricsData, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setMetricsData(prev => ({ ...prev, [field]: numValue }));
  };
  
  const handleSaveMetrics = async () => {
    try {
      await updateMetrics(selectedKol.id, metricsData);
    } catch (error) {
      console.error("Error saving metrics:", error);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-semibold mb-1">Performance Metrics</h4>
          <p className="text-sm text-gray-500">Track and update key performance metrics for this KOL</p>
        </div>
        <Button 
          onClick={handleSaveMetrics} 
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Metrics
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-purple-800 text-lg font-bold">{selectedKol.engagement_rate || 0}%</p>
          <p className="text-sm text-purple-700">Engagement Rate</p>
          <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-bold">{roi}%</p>
          <p className="text-sm text-blue-700">ROI</p>
          <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-800 text-lg font-bold">{conversionRate}%</p>
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
              <Input 
                type="number" 
                value={metricsData.likes}
                onChange={(e) => handleChange('likes', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <Input 
                type="number" 
                value={metricsData.comments}
                onChange={(e) => handleChange('comments', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shares</label>
              <Input 
                type="number" 
                value={metricsData.shares}
                onChange={(e) => handleChange('shares', e.target.value)}
              />
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
                value={metricsData.clicks}
                onChange={(e) => handleChange('clicks', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchases</label>
              <Input 
                type="number" 
                value={metricsData.purchases}
                onChange={(e) => handleChange('purchases', e.target.value)}
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
                type="number" 
                value={metricsData.revenue}
                onChange={(e) => handleChange('revenue', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current value: Rp {metricsData.revenue.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost (IDR)</label>
              <Input 
                type="number" 
                value={metricsData.cost}
                onChange={(e) => handleChange('cost', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Current value: Rp {metricsData.cost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
