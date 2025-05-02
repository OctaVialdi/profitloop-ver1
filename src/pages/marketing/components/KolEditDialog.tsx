
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

interface KolEditDialogProps {
  kol: any;
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

const currencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "IDR", label: "IDR" },
];

const KolEditDialog = ({ kol, onClose }: KolEditDialogProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [category, setCategory] = useState(kol.category);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState(kol.status === "Active");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">Edit KOL: {kol.name}</DialogTitle>
              <DialogDescription>
                Manage KOL details, social media platforms, and rates
              </DialogDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={onClose}>Update KOL</Button>
              <Button variant="destructive" onClick={onClose}>Delete</Button>
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
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border flex items-center justify-center relative">
                    <img src={kol.avatar} alt={kol.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center border">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.862 4.487L18.549 2.799C18.9429 2.40503 19.4645 2.18268 20.0095 2.18268C20.5546 2.18268 21.0762 2.40503 21.47 2.799C21.864 3.19297 22.0865 3.71465 22.0865 4.25975C22.0865 4.80485 21.864 5.32653 21.47 5.7205L10.58 16.611C10.0533 17.1381 9.40137 17.5204 8.686 17.72L6 18.5L6.78 15.814C6.97956 15.0987 7.36191 14.4467 7.889 13.92L16.862 4.487Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Upload a square photo of the KOL</p>
                    <p className="text-sm text-muted-foreground">Recommended size 500×500px.</p>
                    <Input type="text" value={kol.avatar} className="mt-2" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={kol.name} />
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
                  <Input id="followers" type="number" defaultValue={kol.followers} />
                  <p className="text-xs text-muted-foreground">Combined followers across all platforms.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="activeStatus" 
                  checked={activeStatus} 
                  onCheckedChange={setActiveStatus} 
                />
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
                
                {kol.platforms && kol.platforms.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Platform</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Handle</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Followers</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Engagement</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {kol.platforms.map((platform: string) => (
                          <tr key={platform}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {platform === "Instagram" && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {platform === "TikTok" && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {platform}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-blue-500">@{kol.name.toLowerCase().replace(' ', '')}</td>
                            <td className="px-4 py-3">{Math.round(kol.followers * (platform === "Instagram" ? 0.7 : 0.3)).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              {platform === "Instagram" ? "3.5" : "4.2"}%
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No platforms connected yet</p>
                )}
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
                      {currencies.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
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
                
                {kol.platforms && kol.platforms.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Platform</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Min Rate</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Max Rate</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Currency</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {kol.platforms.map((platform: string) => (
                          <tr key={`rate-${platform}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {platform === "Instagram" && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {platform === "TikTok" && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {platform}
                              </div>
                            </td>
                            <td className="px-4 py-3">{platform === "Instagram" ? "1500" : "1000"}</td>
                            <td className="px-4 py-3">{platform === "Instagram" ? "3000" : "2000"}</td>
                            <td className="px-4 py-3">USD</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No rates added yet</p>
                )}
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
                  <p className="text-2xl font-bold text-purple-700">
                    {kol.engagement.replace('%', '')}%
                  </p>
                  <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm text-blue-800 font-medium mb-1">ROI</h3>
                  <p className="text-2xl font-bold text-blue-700">256%</p>
                  <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-sm text-green-800 font-medium mb-1">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-green-700">14.7%</p>
                  <p className="text-xs text-green-600 mt-1">Purchases / Clicks * 100</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <h4 className="text-md font-medium">Engagement Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="likes">Likes</Label>
                    <Input id="likes" defaultValue="15000" />
                  </div>
                  
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Input id="comments" defaultValue="2500" />
                  </div>
                  
                  <div>
                    <Label htmlFor="shares">Shares</Label>
                    <Input id="shares" defaultValue="3200" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Conversion Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clicks">Clicks</Label>
                    <Input id="clicks" defaultValue="7300" />
                  </div>
                  
                  <div>
                    <Label htmlFor="purchases">Purchases</Label>
                    <Input id="purchases" defaultValue="1070" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Financial Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue">Revenue (IDR)</Label>
                    <Input id="revenue" defaultValue="53500000" />
                    <p className="text-xs text-muted-foreground mt-1">Current value: Rp 53,500,000</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="cost">Cost (IDR)</Label>
                    <Input id="cost" defaultValue="15000000" />
                    <p className="text-xs text-muted-foreground mt-1">Current value: Rp 15,000,000</p>
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

export default KolEditDialog;
