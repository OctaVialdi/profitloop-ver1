
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KolMetricsTabProps {
  selectedKol: any;
}

export const KolMetricsTab: React.FC<KolMetricsTabProps> = ({ selectedKol }) => {
  const initialMetrics = selectedKol?.kol_metrics?.[0] || {
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0
  };
  
  const [metrics, setMetrics] = useState(initialMetrics);
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics(prev => ({ 
      ...prev, 
      [name]: parseFloat(value) || 0
    }));
  };
  
  // Save metrics
  const handleSaveMetrics = async () => {
    setIsSaving(true);
    try {
      if (metrics.id) {
        // Update existing metrics
        const { error } = await supabase
          .from('kol_metrics')
          .update({
            likes: metrics.likes,
            comments: metrics.comments,
            shares: metrics.shares,
            clicks: metrics.clicks,
            purchases: metrics.purchases,
            revenue: metrics.revenue,
            cost: metrics.cost
          })
          .eq('id', metrics.id);
          
        if (error) throw error;
      } else {
        // Add new metrics
        const { error } = await supabase
          .from('kol_metrics')
          .insert({
            kol_id: selectedKol.id,
            likes: metrics.likes,
            comments: metrics.comments,
            shares: metrics.shares,
            clicks: metrics.clicks,
            purchases: metrics.purchases,
            revenue: metrics.revenue,
            cost: metrics.cost
          });
          
        if (error) throw error;
      }
      
      toast.success('Metrics updated successfully');
    } catch (error) {
      console.error('Error updating metrics:', error);
      toast.error('Failed to update metrics');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Calculate derived metrics
  const calculatedROI = metrics.cost > 0 
    ? ((metrics.revenue - metrics.cost) / metrics.cost * 100).toFixed(2) 
    : '0.00';
    
  const calculatedConversionRate = metrics.clicks > 0 
    ? ((metrics.purchases / metrics.clicks) * 100).toFixed(2) 
    : '0.00';
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-6">Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Engagement Metrics</h4>
              
              <div className="space-y-2">
                <Label htmlFor="likes">Likes</Label>
                <Input 
                  id="likes" 
                  name="likes"
                  type="number"
                  value={metrics.likes} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Input 
                  id="comments" 
                  name="comments"
                  type="number"
                  value={metrics.comments} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shares">Shares</Label>
                <Input 
                  id="shares" 
                  name="shares"
                  type="number"
                  value={metrics.shares} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Conversion Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Conversion Metrics</h4>
              
              <div className="space-y-2">
                <Label htmlFor="clicks">Clicks</Label>
                <Input 
                  id="clicks" 
                  name="clicks"
                  type="number"
                  value={metrics.clicks} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchases">Purchases</Label>
                <Input 
                  id="purchases" 
                  name="purchases"
                  type="number"
                  value={metrics.purchases} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conversion_rate">Conversion Rate</Label>
                <Input 
                  id="conversion_rate" 
                  value={`${calculatedConversionRate}%`} 
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Financial Metrics</h4>
              
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue</Label>
                <Input 
                  id="revenue" 
                  name="revenue"
                  type="number"
                  value={metrics.revenue} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input 
                  id="cost" 
                  name="cost"
                  type="number"
                  value={metrics.cost} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roi">ROI</Label>
                <Input 
                  id="roi" 
                  value={`${calculatedROI}%`} 
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">Performance Summary</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Engagement:</span>
                  <span className="font-medium">
                    {(metrics.likes + metrics.comments + metrics.shares).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-medium">{calculatedConversionRate}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">{formatCurrency(metrics.revenue)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">{formatCurrency(metrics.cost)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit:</span>
                  <span className="font-medium">
                    {formatCurrency(metrics.revenue - metrics.cost)}
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-700 font-medium">ROI:</span>
                  <span className={`font-bold ${parseFloat(calculatedROI) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatedROI}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveMetrics} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? "Saving..." : "Save Metrics"}
        </Button>
      </div>
    </div>
  );
};
