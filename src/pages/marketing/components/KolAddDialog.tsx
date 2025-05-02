
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface KolAddDialogProps {
  onClose: () => void;
}

const categories = [
  "Beauty", "Fashion", "Lifestyle", "Food", "Travel", 
  "Fitness", "Tech", "Gaming", "Entertainment", 
  "Business", "Education"
];

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" }
];

const KolAddDialog = ({ onClose }: KolAddDialogProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [category, setCategory] = useState("Beauty");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">Add New KOL</DialogTitle>
              <DialogDescription>
                Create a new Key Opinion Leader (KOL) profile
              </DialogDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={onClose}>Add KOL</Button>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center bg-muted">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V8M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Upload a square photo of the KOL</p>
                    <p className="text-sm text-muted-foreground">Recommended size 500×500px.</p>
                    <Input type="text" placeholder="https://i.pravatar.cc/150?img=1" className="mt-2" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter KOL's full name" />
                <p className="text-xs text-muted-foreground">This will be displayed across the platform.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      role="combobox"
                      className="w-full justify-between"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    >
                      {category}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                    
                    {categoryDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                              cat === category ? "bg-muted" : ""
                            }`}
                            onClick={() => {
                              setCategory(cat);
                              setCategoryDropdownOpen(false);
                            }}
                          >
                            {category === cat && (
                              <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline mr-2"
                              >
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Primary content category for the KOL.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="followers">Total Followers</Label>
                  <Input id="followers" type="number" placeholder="0" />
                  <p className="text-xs text-muted-foreground">Combined followers across all platforms.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="activeStatus" defaultChecked />
                <Label htmlFor="activeStatus">Active Status</Label>
                <span className="text-xs text-muted-foreground ml-2">Currently active for campaigns</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Media Platforms</h3>
                <p className="text-sm text-muted-foreground">Manage the KOL's social media platforms and performance metrics</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Add New Platform</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <select
                      id="platform"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select platform</option>
                      {platformOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="handle">Handle/Username</Label>
                    <Input id="handle" placeholder="@username" />
                  </div>
                  
                  <div>
                    <Label htmlFor="profileUrl">Profile URL</Label>
                    <Input id="profileUrl" placeholder="https://" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platformFollowers">Followers</Label>
                    <Input id="platformFollowers" placeholder="Number of followers" />
                  </div>
                  
                  <div>
                    <Label htmlFor="platformEngagement">Engagement Rate (%)</Label>
                    <Input id="platformEngagement" placeholder="Average engagement rate" />
                  </div>
                </div>
                
                <Button variant="secondary" className="mt-2">Add Platform</Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <h4 className="text-md font-medium">Connected Platforms</h4>
                <p className="text-sm text-muted-foreground">No platforms connected yet</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rates" className="mt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Rate Cards</h3>
                <p className="text-sm text-muted-foreground">Manage the KOL's pricing for different platforms and content types</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Add New Rate Card</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ratePlatform">Platform</Label>
                    <select
                      id="ratePlatform"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select platform</option>
                      {platformOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="IDR">IDR</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minRate">Minimum Rate</Label>
                    <Input id="minRate" placeholder="Minimum rate" />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxRate">Maximum Rate</Label>
                    <Input id="maxRate" placeholder="Maximum rate" />
                  </div>
                </div>
                
                <Button variant="secondary" className="mt-2">Add Rate Card</Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <h4 className="text-md font-medium">Existing Rates</h4>
                <p className="text-sm text-muted-foreground">No rates added yet</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">Track and update key performance metrics for this KOL</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="text-sm text-purple-800 font-medium mb-1">Engagement Rate</h3>
                  <p className="text-2xl font-bold text-purple-700">N/A%</p>
                  <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm text-blue-800 font-medium mb-1">ROI</h3>
                  <p className="text-2xl font-bold text-blue-700">N/A%</p>
                  <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-sm text-green-800 font-medium mb-1">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-green-700">N/A%</p>
                  <p className="text-xs text-green-600 mt-1">Purchases / Clicks * 100</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <h4 className="text-md font-medium">Engagement Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="likes">Likes</Label>
                    <Input id="likes" placeholder="0" />
                  </div>
                  
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Input id="comments" placeholder="0" />
                  </div>
                  
                  <div>
                    <Label htmlFor="shares">Shares</Label>
                    <Input id="shares" placeholder="0" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Conversion Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clicks">Clicks</Label>
                    <Input id="clicks" placeholder="0" />
                  </div>
                  
                  <div>
                    <Label htmlFor="purchases">Purchases</Label>
                    <Input id="purchases" placeholder="0" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Financial Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue">Revenue (IDR)</Label>
                    <Input id="revenue" placeholder="0" />
                    <p className="text-xs text-muted-foreground mt-1">Current value: Rp 0</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="cost">Cost (IDR)</Label>
                    <Input id="cost" placeholder="0" />
                    <p className="text-xs text-muted-foreground mt-1">Current value: Rp 0</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default KolAddDialog;
