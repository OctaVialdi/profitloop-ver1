
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KolDetailViewProps {
  selectedKol: any;
  setCurrentView: (view: string) => void;
  formatNumber: (num: number) => string;
}

export const KolDetailView: React.FC<KolDetailViewProps> = ({ 
  selectedKol, 
  setCurrentView, 
  formatNumber 
}) => {
  if (!selectedKol) return null;
  
  // Categories for KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];
  
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-transparent p-0"
              onClick={() => setCurrentView("list")}
            >
              <ArrowLeftCircle size={20} className="mr-2 text-gray-500" />
            </Button>
            Edit KOL: {selectedKol.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Update KOL
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-100/50 rounded-md">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">General</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white">Social Media</TabsTrigger>
          <TabsTrigger value="rates" className="data-[state=active]:bg-white">Rates</TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-1">Profile Photo</h4>
              <p className="text-sm text-gray-500 mb-4">Upload a profile photo for this KOL</p>
              
              <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full relative mx-auto md:mx-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={selectedKol.avatar} alt={selectedKol.name} className="object-cover" />
                  <AvatarFallback className="text-5xl font-light text-gray-400">
                    {selectedKol.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-2 -bottom-2 bg-white rounded-full p-2 shadow-sm border">
                  <Upload size={16} className="text-gray-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center md:text-left">Upload a square photo of the KOL. Recommended size 500×500px.</p>
            </div>
            
            <div className="col-span-2 space-y-6">
              <h4 className="font-semibold mb-2">Basic Information</h4>
              <p className="text-sm text-gray-500 mb-4">KOL profile information</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input placeholder="Enter KOL name" defaultValue={selectedKol.name} />
                  <p className="text-xs text-gray-500 mt-1">This will be displayed across the platform.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select defaultValue={selectedKol.category.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Primary content category for the KOL.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Followers</label>
                    <Input type="number" placeholder="0" defaultValue={selectedKol.followers} />
                    <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
                    <Input type="number" placeholder="0" defaultValue={selectedKol.engagement} />
                    <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="active" defaultChecked={selectedKol.status === "Active"} />
                  <label htmlFor="active" className="text-sm font-medium">
                    Active Status
                  </label>
                  <span className="text-xs text-gray-500 ml-2">
                    {selectedKol.status === "Active" ? "Active - available for campaigns" : "Inactive - not available for campaigns"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-1">Rate Cards</h4>
              <p className="text-sm text-gray-500 mb-6">Manage the KOL's pricing for different platforms and content types</p>
            </div>
            
            <div className="border rounded-md p-6">
              <h5 className="font-medium mb-4">Add New Rate Card</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="idr">IDR</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Rate</label>
                  <Input placeholder="Minimum rate" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Maximum Rate</label>
                  <Input placeholder="Maximum rate" />
                </div>
              </div>
              
              <Button size="sm" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                Add Rate Card
              </Button>
            </div>
            
            <div className="border rounded-md p-6 flex items-center justify-center flex-col py-12">
              <p className="text-gray-500 mb-1">No rate cards defined yet</p>
              <p className="text-xs text-gray-400">Add rates using the form above</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <div>
            <h4 className="font-semibold mb-1">Performance Metrics</h4>
            <p className="text-sm text-gray-500 mb-6">Track and update key performance metrics for this KOL</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-purple-800 text-lg font-bold">{selectedKol.engagement}%</p>
                <p className="text-sm text-purple-700">Engagement Rate</p>
                <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-800 text-lg font-bold">212%</p>
                <p className="text-sm text-blue-700">ROI</p>
                <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-green-800 text-lg font-bold">3.8%</p>
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
                    <Input type="number" placeholder="0" defaultValue="12500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Comments</label>
                    <Input type="number" placeholder="0" defaultValue="1840" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Shares</label>
                    <Input type="number" placeholder="0" defaultValue="726" />
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-4">Conversion Metrics</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Clicks</label>
                    <Input type="number" placeholder="0" defaultValue="8745" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchases</label>
                    <Input type="number" placeholder="0" defaultValue="332" />
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-4">Financial Metrics</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Revenue (IDR)</label>
                    <Input type="number" placeholder="0" defaultValue="45000000" />
                    <p className="text-xs text-gray-500 mt-1">Current value: Rp 45,000,000</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost (IDR)</label>
                    <Input type="number" placeholder="0" defaultValue="15000000" />
                    <p className="text-xs text-gray-500 mt-1">Current value: Rp 15,000,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
