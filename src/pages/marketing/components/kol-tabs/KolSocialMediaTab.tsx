
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface KolSocialMediaTabProps {
  selectedKol: any;
  formatNumber: (num: number) => string;
}

export const KolSocialMediaTab: React.FC<KolSocialMediaTabProps> = ({ selectedKol, formatNumber }) => {
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
            <Select>
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
            <Input placeholder="@username" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile URL</label>
            <Input placeholder="https://" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Followers</label>
            <Input type="number" placeholder="Number of followers" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
            <Input type="number" placeholder="Average engagement rate" />
          </div>
        </div>
        
        <Button size="sm" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
          Add Platform
        </Button>
      </div>
      
      <div className="border rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="font-medium">Platforms</h5>
            <p className="text-sm text-gray-500">Connected social media accounts</p>
          </div>
        </div>
        
        {selectedKol.platforms.map((platform, index) => (
          <div key={index} className="border-b py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-md">
                {platform === "Instagram" ? 
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
                <div className="font-medium">{platform}</div>
                <div className="text-sm text-gray-500">@{selectedKol.name.toLowerCase().replace(' ', '')}</div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{formatNumber(selectedKol.followers / selectedKol.platforms.length)} followers</Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{selectedKol.engagement}% engagement</Badge>
              <Button variant="ghost" className="text-gray-500 p-2 h-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0zM11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0zM18 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0z"/>
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
