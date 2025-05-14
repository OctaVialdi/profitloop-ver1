
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const SocialMediaTab: React.FC = () => {
  const [platform, setPlatform] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [followers, setFollowers] = useState<string>("");
  const [engagement, setEngagement] = useState<string>("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  const handleAddPlatform = () => {
    if (platform) {
      setPlatforms([...platforms, platform]);
      // Reset form
      setPlatform("");
      setHandle("");
      setProfileUrl("");
      setFollowers("");
      setEngagement("");
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
          disabled={!platform}
        >
          Add Platform
        </Button>
      </div>
      
      {platforms.length > 0 ? (
        <div className="border rounded-md p-6">
          <h5 className="font-medium mb-4">Added Platforms</h5>
          {platforms.map((platform, index) => (
            <div key={index} className="border-b py-3 last:border-0">
              <div className="font-medium">{platform}</div>
              {handle && <div className="text-sm text-gray-500">@{handle}</div>}
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
