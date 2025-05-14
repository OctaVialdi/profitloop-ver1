
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SocialMediaTabProps {
  formData: {
    tempSocialMedia?: any[];
    [key: string]: any;
  };
  handleChange: (field: string, value: any) => void;
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ formData, handleChange }) => {
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [followers, setFollowers] = useState<number>(0);
  const [engagementRate, setEngagementRate] = useState<number>(0);

  // Initialize tempSocialMedia if it doesn't exist
  const socialMedia = formData.tempSocialMedia || [];

  const handleAddPlatform = () => {
    if (!platform) {
      alert("Please select a platform");
      return;
    }
    
    const newPlatform = {
      platform,
      handle,
      profile_url: profileUrl,
      followers: Number(followers),
      engagement_rate: Number(engagementRate)
    };
    
    const updatedSocialMedia = [...socialMedia, newPlatform];
    handleChange("tempSocialMedia", updatedSocialMedia);
    
    // Reset form fields
    setPlatform("");
    setHandle("");
    setProfileUrl("");
    setFollowers(0);
    setEngagementRate(0);
  };

  const handleRemovePlatform = (index: number) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia.splice(index, 1);
    handleChange("tempSocialMedia", updatedSocialMedia);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Media Platforms</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add the KOL's social media accounts and statistics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Username/Handle</label>
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
        
        <div>
          <label className="block text-sm font-medium mb-1">Followers</label>
          <Input 
            type="number" 
            placeholder="0" 
            value={followers.toString()}
            onChange={(e) => setFollowers(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
          <div className="flex items-center space-x-2">
            <Input 
              type="number" 
              step="0.01"
              placeholder="0" 
              value={engagementRate.toString()}
              onChange={(e) => setEngagementRate(parseFloat(e.target.value) || 0)}
            />
            <Button 
              type="button" 
              onClick={handleAddPlatform}
              size="icon"
              className="mt-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* List of added platforms */}
      {socialMedia.length > 0 && (
        <div className="border rounded-md p-4 mt-4">
          <h4 className="font-medium mb-2">Added Platforms</h4>
          <div className="space-y-2">
            {socialMedia.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <span className="font-medium">{item.platform}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>{item.handle}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>{item.followers.toLocaleString()} followers</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>{item.engagement_rate}% engagement</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemovePlatform(index)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
