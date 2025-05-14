
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useKols } from "@/hooks/useKols";

interface KolMetricsTabProps {
  selectedKol: any;
}

export const KolMetricsTab: React.FC<KolMetricsTabProps> = ({ selectedKol }) => {
  const [metrics, setMetrics] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { updateMetrics, isUpdating } = useKols();

  // Initialize form with existing data when component mounts or when selectedKol changes
  useEffect(() => {
    if (selectedKol?.metrics) {
      setMetrics({
        likes: selectedKol.metrics.likes || 0,
        comments: selectedKol.metrics.comments || 0,
        shares: selectedKol.metrics.shares || 0,
        clicks: selectedKol.metrics.clicks || 0,
        purchases: selectedKol.metrics.purchases || 0,
        revenue: selectedKol.metrics.revenue || 0,
        cost: selectedKol.metrics.cost || 0,
      });
    }
  }, [selectedKol?.metrics]);

  const handleInputChange = (field: string, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const handleSaveMetrics = async () => {
    try {
      setIsLoading(true);
      // Ensure we pass all metric fields to the updateMetrics function
      const updatedMetrics = await updateMetrics(selectedKol.id, {
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        clicks: metrics.clicks,
        purchases: metrics.purchases,
        revenue: metrics.revenue,
        cost: metrics.cost
      });
      
      if (updatedMetrics) {
        toast({
          title: "Success",
          description: "Metrics saved successfully",
        });
      } else {
        throw new Error("Failed to save metrics");
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast({
        title: "Error",
        description: "Failed to save metrics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate conversion rate
  const conversionRate = metrics.clicks > 0 
    ? ((metrics.purchases / metrics.clicks) * 100).toFixed(2)
    : "0.00";

  // Calculate ROI
  const roi = metrics.cost > 0 
    ? (((metrics.revenue - metrics.cost) / metrics.cost) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-1">Performance Metrics</h4>
        <p className="text-sm text-gray-500 mb-6">Track KOL campaign performance and return on investment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Likes</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.likes}
                  onChange={(e) => handleInputChange('likes', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comments</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shares</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.shares}
                  onChange={(e) => handleInputChange('shares', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Link Clicks</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.clicks}
                  onChange={(e) => handleInputChange('clicks', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchases</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.purchases}
                  onChange={(e) => handleInputChange('purchases', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Conversion Rate</label>
                <Input 
                  type="text" 
                  value={`${conversionRate}%`}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Calculated automatically from clicks and purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Cost</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={metrics.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Revenue Generated</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={metrics.revenue}
                onChange={(e) => handleInputChange('revenue', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ROI</label>
              <Input 
                type="text" 
                value={`${roi}%`}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Calculated automatically from cost and revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={handleSaveMetrics}
          disabled={isLoading || isUpdating}
        >
          {(isLoading || isUpdating) ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <SaveIcon size={16} className="mr-2" />
              Save Metrics
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
