
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Kol, KolMetrics } from "@/hooks/useKols";

interface KolMetricsTabProps {
  selectedKol: Kol;
  metrics: KolMetrics | undefined;
  onSaveMetrics: (metrics: Omit<KolMetrics, 'id' | 'created_at' | 'updated_at'>) => Promise<KolMetrics[] | null>;
}

export const KolMetricsTab: React.FC<KolMetricsTabProps> = ({ 
  selectedKol,
  metrics,
  onSaveMetrics
}) => {
  const [formData, setFormData] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0
  });
  
  useEffect(() => {
    if (metrics) {
      setFormData({
        likes: metrics.likes || 0,
        comments: metrics.comments || 0,
        shares: metrics.shares || 0,
        clicks: metrics.clicks || 0,
        purchases: metrics.purchases || 0,
        revenue: metrics.revenue || 0,
        cost: metrics.cost || 0
      });
    }
  }, [metrics]);
  
  const handleInputChange = (field: string, value: number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSaveMetrics = async () => {
    await onSaveMetrics({
      ...formData,
      kol_id: selectedKol.id
    });
  };
  
  // Calculate metrics
  const calculateEngagementRate = () => {
    if (!formData.likes && !formData.comments && !formData.shares) return '0.0';
    const totalEngagement = formData.likes + formData.comments + formData.shares;
    return ((totalEngagement / (selectedKol.followers || 1)) * 100).toFixed(1);
  };
  
  const calculateROI = () => {
    if (!formData.revenue || !formData.cost) return '0.0';
    return (((formData.revenue - formData.cost) / formData.cost) * 100).toFixed(1);
  };
  
  const calculateConversionRate = () => {
    if (!formData.purchases || !formData.clicks) return '0.0';
    return ((formData.purchases / formData.clicks) * 100).toFixed(1);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };
  
  return (
    <div>
      <h4 className="font-semibold mb-1">Performance Metrics</h4>
      <p className="text-sm text-gray-500 mb-6">Track and update key performance metrics for this KOL</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-purple-800 text-lg font-bold">{calculateEngagementRate()}%</p>
          <p className="text-sm text-purple-700">Engagement Rate</p>
          <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-bold">{calculateROI()}%</p>
          <p className="text-sm text-blue-700">ROI</p>
          <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-800 text-lg font-bold">{calculateConversionRate()}%</p>
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
                placeholder="0" 
                value={formData.likes || ''} 
                onChange={(e) => handleInputChange('likes', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.comments || ''} 
                onChange={(e) => handleInputChange('comments', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shares</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.shares || ''} 
                onChange={(e) => handleInputChange('shares', parseInt(e.target.value) || 0)}
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
                placeholder="0" 
                value={formData.clicks || ''} 
                onChange={(e) => handleInputChange('clicks', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchases</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.purchases || ''} 
                onChange={(e) => handleInputChange('purchases', parseInt(e.target.value) || 0)}
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
                placeholder="0" 
                value={formData.revenue || ''} 
                onChange={(e) => handleInputChange('revenue', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Current value: Rp {formatCurrency(formData.revenue || 0)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost (IDR)</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.cost || ''} 
                onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Current value: Rp {formatCurrency(formData.cost || 0)}</p>
            </div>
          </div>
        </div>
        
        <Button onClick={handleSaveMetrics}>Save Metrics</Button>
      </div>
    </div>
  );
};
