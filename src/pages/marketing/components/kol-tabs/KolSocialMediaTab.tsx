
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, Plus } from "lucide-react";
import { useKols } from "@/hooks/useKols";

interface KolSocialMediaTabProps {
  selectedKol: any;
  formatNumber: (num: number) => string;
}

export const KolSocialMediaTab: React.FC<KolSocialMediaTabProps> = ({ selectedKol, formatNumber }) => {
  const [platform, setPlatform] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [followers, setFollowers] = useState<string>("");
  const [engagement, setEngagement] = useState<string>("");
  
  const { addPlatform, isUpdating } = useKols();

  // Get social media from the selectedKol object
  const socialMedia = selectedKol?.social_media || [];
  console.log("Social Media data:", socialMedia);

  const handleAddPlatform = async () => {
    if (!platform) {
      return;
    }
    
    try {
      await addPlatform(selectedKol.id, {
        platform,
        handle,
        profile_url: profileUrl,
        followers: Number(followers) || 0,
        engagement: Number(engagement) || 0
      });
      
      // Reset form
      setPlatform("");
      setHandle("");
      setProfileUrl("");
      setFollowers("");
      setEngagement("");
    } catch (error) {
      console.error("Error adding platform:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-1">Social Media Platforms</h4>
        <p className="text-sm text-gray-500 mb-6">Manage the KOL's social media platforms and performance metrics</p>
      </div>
      
      <div className="border rounded-md p-6">
        <h5 className="font-medium mb-4">Add New Platform</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Handle/Username</label>
            <Input 
              placeholder="@username" 
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile URL</label>
            <Input 
              placeholder="https://" 
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Followers</label>
            <Input 
              type="number" 
              placeholder="Number of followers"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
            <Input 
              type="number" 
              placeholder="Average engagement rate"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          onClick={handleAddPlatform}
          disabled={!platform || isUpdating}
        >
          <Link size={16} className="mr-1.5" />
          Add Platform
        </Button>
      </div>
      
      {socialMedia && socialMedia.length > 0 ? (
        <div className="border rounded-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h5 className="font-medium">Platforms</h5>
              <p className="text-sm text-gray-500">Connected social media accounts</p>
            </div>
          </div>
          
          {socialMedia.map((platform: any, index: number) => (
            <div key={index} className="border-b py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-md">
                  {platform.platform === "instagram" ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700">
                      <path d="M9 12 11 14 15 10"/>
                      <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z"/>
                    </svg>
                  }
                </div>
                <div>
                  <div className="font-medium capitalize">{platform.platform}</div>
                  <div className="text-sm text-gray-500">@{platform.handle || 'username'}</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {formatNumber(platform.followers || 0)} followers
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {platform.engagement_rate || 0}% engagement
                </Badge>
                <Button variant="ghost" className="text-gray-500 p-2 h-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0zM11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0zM18 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0z"/>
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-6 flex items-center justify-center flex-col py-12">
          <p className="text-gray-500 mb-1">No social media platforms connected yet</p>
          <p className="text-xs text-gray-400">Add platforms using the form above</p>
        </div>
      )}
    </div>
  );
};
