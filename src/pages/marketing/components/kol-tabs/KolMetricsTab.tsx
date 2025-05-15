import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, PlusIcon, TrashIcon, LinkIcon, Film } from "lucide-react";
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
  // Only maintain financial metrics in state, video metrics are the primary data
  const [metrics, setMetrics] = useState({
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0,
  });
  
  const [videoMetrics, setVideoMetrics] = useState<VideoMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { updateMetrics, isUpdating } = useKols();

  // Initialize form with existing data when component mounts or when selectedKol changes
  useEffect(() => {
    if (selectedKol?.metrics) {
      setMetrics({
        clicks: selectedKol.metrics.clicks || 0,
        purchases: selectedKol.metrics.purchases || 0,
        revenue: selectedKol.metrics.revenue || 0,
        cost: selectedKol.metrics.cost || 0,
      });

      if (selectedKol.metrics.video_data) {
        try {
          const parsedVideoData = typeof selectedKol.metrics.video_data === 'string' 
            ? JSON.parse(selectedKol.metrics.video_data) 
            : selectedKol.metrics.video_data;
          setVideoMetrics(Array.isArray(parsedVideoData) ? parsedVideoData : []);
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
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalImpressions = 0;
    
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
      
      // Convert videoMetrics to a JSON string to store in the database
      const videoDataString = JSON.stringify(videoMetrics);
      console.log("Saving video data:", videoDataString);
      
      // Prepare data to be stored
      const updatedMetrics = await updateMetrics(selectedKol.id, {
        clicks: metrics.clicks,
        purchases: metrics.purchases,
        revenue: metrics.revenue,
        cost: metrics.cost,
        likes: engagement.totalLikes,
        comments: engagement.totalComments,
        shares: engagement.totalShares,
        impressions: engagement.totalImpressions,
        video_data: videoDataString,
        total_engagement_rate: Number(engagement.engagementRate)
      });
      
      if (updatedMetrics) {
        toast.success("Metrics saved successfully");
      } else {
        throw new Error("Failed to save metrics");
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast.error("Failed to save metrics");
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

  // Function to extract video ID from various video platforms
  const getVideoId = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) return { platform: 'youtube', id: youtubeMatch[1] };
    
    // TikTok
    const tiktokRegex = /tiktok\.com\/.+\/video\/(\d+)/;
    const tiktokMatch = url.match(tiktokRegex);
    if (tiktokMatch) return { platform: 'tiktok', id: tiktokMatch[1] };
    
    // Instagram - note that Instagram doesn't easily allow embedding, so we just return the URL
    if (url.includes('instagram.com')) {
      return { platform: 'instagram', id: url };
    }
    
    return null;
  };

  const getVideoThumbnail = (url: string) => {
    const videoInfo = getVideoId(url);
    if (!videoInfo) return null;
    
    if (videoInfo.platform === 'youtube') {
      return `https://img.youtube.com/vi/${videoInfo.id}/mqdefault.jpg`;
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-1">Performance Metrics</h4>
        <p className="text-sm text-gray-500 mb-6">Track KOL campaign performance based on video content metrics</p>
      </div>

      {/* Modern Metrics Dashboard */}
      <div className="grid grid-cols-1 gap-6">
        {/* Metrics Overview Card - Modern Design */}
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-violet-50 to-indigo-50">
          <CardHeader className="border-b bg-white/80 pb-3">
            <CardTitle className="text-lg font-medium text-gray-800">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500">Total Videos</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-900">{videoMetrics.length}</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500">Engagement Rate</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-900">{engagement.engagementRate}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (Interactions / Impressions)
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-900">{conversionRate}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (Purchases / Clicks)
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-500">ROI</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-900">{roi}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (Revenue - Cost) / Cost
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Likes</div>
                    <div className="text-xl font-semibold text-gray-900 mt-1">{engagement.totalLikes}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Comments</div>
                    <div className="text-xl font-semibold text-gray-900 mt-1">{engagement.totalComments}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Shares</div>
                    <div className="text-xl font-semibold text-gray-900 mt-1">{engagement.totalShares}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Impressions</div>
                    <div className="text-xl font-semibold text-gray-900 mt-1">{engagement.totalImpressions}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion & Financial Metrics - Modern Design */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg font-medium text-gray-800">Conversion & Financial Data</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Clicks</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={metrics.clicks}
                  onChange={(e) => handleInputChange('clicks', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchases</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={metrics.purchases}
                  onChange={(e) => handleInputChange('purchases', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Generated</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={metrics.revenue}
                  onChange={(e) => handleInputChange('revenue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Cost</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={metrics.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Metrics Tracking Section - Modern Design */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-gray-800">KOL Video Tracking</CardTitle>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleAddVideo}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <PlusIcon size={14} /> Add Video
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {videoMetrics.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Film size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 font-medium">No videos added yet</p>
                <p className="text-gray-400 text-sm mt-1">Click "Add Video" to start tracking KOL performance</p>
              </div>
            ) : (
              <div className="space-y-6">
                {videoMetrics.map((video, index) => (
                  <div key={index} className="border rounded-lg p-5 relative bg-white hover:shadow-md transition-shadow">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 hover:bg-red-50" 
                      onClick={() => handleRemoveVideo(index)}
                    >
                      <TrashIcon size={16} />
                    </Button>
                    
                    <h4 className="font-medium mb-4 text-gray-800">Video {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <Input 
                          type="text"
                          placeholder="Video title"
                          value={video.title}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          onChange={(e) => handleVideoMetricChange(index, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                        <div className="relative">
                          <Input 
                            type="url"
                            placeholder="https://..."
                            value={video.url}
                            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            onChange={(e) => handleVideoMetricChange(index, 'url', e.target.value)}
                          />
                          {video.url && (
                            <a 
                              href={video.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                            >
                              <LinkIcon size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Video thumbnail preview */}
                    {video.url && getVideoThumbnail(video.url) && (
                      <div className="mb-5 flex items-center">
                        <div className="relative rounded-md overflow-hidden w-32 h-20 mr-3 border">
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                            <img 
                              src={getVideoThumbnail(video.url)} 
                              alt="Video thumbnail" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <Film size={24} className="text-white" />
                            </div>
                          </a>
                        </div>
                        <span className="text-sm text-gray-600">Click thumbnail to view video</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Likes</label>
                        <Input 
                          type="number"
                          placeholder="0"
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={video.likes}
                          onChange={(e) => handleVideoMetricChange(index, 'likes', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <Input 
                          type="number"
                          placeholder="0"
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={video.comments}
                          onChange={(e) => handleVideoMetricChange(index, 'comments', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                        <Input 
                          type="number"
                          placeholder="0"
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          value={video.shares}
                          onChange={(e) => handleVideoMetricChange(index, 'shares', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Impressions</label>
                        <Input 
                          type="number"
                          placeholder="0"
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
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
      </div>

      <div className="flex justify-end">
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
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
