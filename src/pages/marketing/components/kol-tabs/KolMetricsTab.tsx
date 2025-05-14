
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, PlusIcon, TrashIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useKols } from "@/hooks/useKols";

interface KolMetricsTabProps {
  selectedKol: any;
}

interface VideoMetric {
  id?: string;
  title: string;
  url: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
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
    impressions: 0,
  });
  
  const [videoMetrics, setVideoMetrics] = useState<VideoMetric[]>([]);
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
        impressions: selectedKol.metrics.impressions || 0,
      });

      if (selectedKol.metrics.video_data) {
        try {
          const parsedVideoData = typeof selectedKol.metrics.video_data === 'string' 
            ? JSON.parse(selectedKol.metrics.video_data) 
            : selectedKol.metrics.video_data;
          setVideoMetrics(parsedVideoData || []);
        } catch (error) {
          console.error("Error parsing video data:", error);
          setVideoMetrics([]);
        }
      }
    }
  }, [selectedKol?.metrics]);

  const handleInputChange = (field: string, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const handleAddVideo = () => {
    setVideoMetrics(prev => [...prev, { 
      title: '', 
      url: '', 
      likes: 0, 
      comments: 0, 
      shares: 0,
      impressions: 0 
    }]);
  };

  const handleRemoveVideo = (index: number) => {
    setVideoMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoMetricChange = (index: number, field: string, value: string | number) => {
    setVideoMetrics(prev => 
      prev.map((video, i) => 
        i === index ? { ...video, [field]: field === 'url' || field === 'title' ? value : Number(value) || 0 } : video
      )
    );
  };

  const calculateTotalEngagement = () => {
    let totalLikes = metrics.likes;
    let totalComments = metrics.comments;
    let totalShares = metrics.shares;
    let totalImpressions = metrics.impressions;
    
    videoMetrics.forEach(video => {
      totalLikes += video.likes || 0;
      totalComments += video.comments || 0;
      totalShares += video.shares || 0;
      totalImpressions += video.impressions || 0;
    });

    // Calculate engagement rate only if impressions exist to avoid division by zero
    const engagementRate = totalImpressions > 0 
      ? (((totalLikes + totalComments + totalShares) / totalImpressions) * 100).toFixed(2)
      : "0.00";

    return {
      totalLikes,
      totalComments,
      totalShares,
      totalImpressions,
      engagementRate
    };
  };

  const handleSaveMetrics = async () => {
    try {
      setIsLoading(true);
      const engagement = calculateTotalEngagement();
      
      // Prepare data to be stored
      const updatedMetrics = await updateMetrics(selectedKol.id, {
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        clicks: metrics.clicks,
        purchases: metrics.purchases,
        revenue: metrics.revenue,
        cost: metrics.cost,
        impressions: metrics.impressions,
        video_data: JSON.stringify(videoMetrics),
        total_engagement_rate: Number(engagement.engagementRate)
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
    
  const engagement = calculateTotalEngagement();

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
                <label className="block text-sm font-medium mb-1">Likes (Overall)</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.likes}
                  onChange={(e) => handleInputChange('likes', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comments (Overall)</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shares (Overall)</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.shares}
                  onChange={(e) => handleInputChange('shares', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Impressions (Overall)</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={metrics.impressions}
                  onChange={(e) => handleInputChange('impressions', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Engagement Rate</label>
                <Input 
                  type="text" 
                  value={`${engagement.engagementRate}%`}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculated as (Likes + Comments + Shares) / Impressions × 100
                </p>
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

      {/* Video Metrics Tracking Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">KOL Video Tracking</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddVideo}
              className="flex items-center gap-1"
            >
              <PlusIcon size={14} /> Add Video
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {videoMetrics.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No videos added yet. Click "Add Video" to start tracking KOL videos.
            </div>
          ) : (
            <div className="space-y-6">
              {videoMetrics.map((video, index) => (
                <div key={index} className="border rounded-md p-4 relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600" 
                    onClick={() => handleRemoveVideo(index)}
                  >
                    <TrashIcon size={16} />
                  </Button>
                  
                  <h4 className="font-medium mb-3">Video {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input 
                        type="text"
                        placeholder="Video title"
                        value={video.title}
                        onChange={(e) => handleVideoMetricChange(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Video URL</label>
                      <Input 
                        type="url"
                        placeholder="https://..."
                        value={video.url}
                        onChange={(e) => handleVideoMetricChange(index, 'url', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Likes</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={video.likes}
                        onChange={(e) => handleVideoMetricChange(index, 'likes', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Comments</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={video.comments}
                        onChange={(e) => handleVideoMetricChange(index, 'comments', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Shares</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={video.shares}
                        onChange={(e) => handleVideoMetricChange(index, 'shares', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Impressions</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={video.impressions}
                        onChange={(e) => handleVideoMetricChange(index, 'impressions', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Metrics Summary Card */}
      {videoMetrics.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Video Metrics Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Videos Tracked</span>
                <p className="text-xl font-bold">{videoMetrics.length}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Likes</span>
                <p className="text-xl font-bold">{videoMetrics.reduce((sum, video) => sum + (video.likes || 0), 0)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Comments</span>
                <p className="text-xl font-bold">{videoMetrics.reduce((sum, video) => sum + (video.comments || 0), 0)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Shares</span>
                <p className="text-xl font-bold">{videoMetrics.reduce((sum, video) => sum + (video.shares || 0), 0)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Impressions</span>
                <p className="text-xl font-bold">{videoMetrics.reduce((sum, video) => sum + (video.impressions || 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
