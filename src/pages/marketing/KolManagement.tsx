
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart, Users, Plus, ChevronDown, Search, SlidersHorizontal, LineChart, Wallet, BarChart3, ArrowLeft, Upload } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EngagementAnalysis } from "./components/EngagementAnalysis";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { ConversionMetrics } from "./components/ConversionMetrics";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeFilter, setTimeFilter] = useState("last-month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list"); // "list" or "add"

  // KOL data
  const kolData = [{
    id: 1,
    name: "Sarah Johnson",
    platforms: ["Instagram", "TikTok"],
    category: "Beauty",
    followers: 500000,
    engagement: 3.2,
    score: 78,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 2,
    name: "Alex Chen",
    platforms: ["Instagram", "TikTok"],
    category: "Tech",
    followers: 350000,
    engagement: 2.8,
    score: 72,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 3,
    name: "Maria Rodriguez",
    platforms: ["Instagram", "TikTok"],
    category: "Fitness",
    followers: 620000,
    engagement: 4.5,
    score: 86,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 4,
    name: "David Kim",
    platforms: ["Instagram"],
    category: "Fashion",
    followers: 280000,
    engagement: 2.2,
    score: 65,
    status: "Inactive",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 5,
    name: "Emma Wilson",
    platforms: ["Instagram", "TikTok"],
    category: "Food",
    followers: 420000,
    engagement: 3.8,
    score: 81,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }];

  // Filter KOLs based on search query
  const filteredKols = kolData.filter(kol => kol.name.toLowerCase().includes(searchQuery.toLowerCase()) || kol.category.toLowerCase().includes(searchQuery.toLowerCase()));

  // Format number with commas
  const formatNumber = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get badge color based on score
  const getScoreBadgeColor = score => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  // Get status badge color
  const getStatusBadgeColor = status => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  // Categories for new KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];

  return <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 px-0">
      <Card className="w-full bg-white shadow-sm border">
        <CardHeader className="hidden">
          <CardTitle>Key Opinion Leaders Management</CardTitle>
          <CardDescription>
            Manage and track your KOL partnerships and campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="engagement" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-gray-50/50">
              <TabsList className="bg-transparent w-full justify-start rounded-none px-4 py-0">
                <TabsTrigger value="engagement" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Engagement Analysis
                </TabsTrigger>
                <TabsTrigger value="roi" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  ROI & Revenue
                </TabsTrigger>
                <TabsTrigger value="conversion" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Conversion Metrics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="engagement" className="mt-0 p-4 md:p-6">
              <EngagementAnalysis timeFilter={timeFilter} />
            </TabsContent>

            <TabsContent value="roi" className="mt-0 p-4 md:p-6">
              <RoiAnalysis timeFilter={timeFilter} />
            </TabsContent>

            <TabsContent value="conversion" className="mt-0 p-4 md:p-6">
              <ConversionMetrics timeFilter={timeFilter} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Separator between sections */}
      <Separator className="my-8" />
      
      {/* New Section with KOL Performance Deep Dive */}
      <div className="w-full">
        <div className="px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">KOL Management</h2>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button 
                variant="outline" 
                className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] border-0 gap-2"
                onClick={() => setCurrentView("list")}
              >
                <Users size={16} />
                <span>KOL List</span>
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#1A1F2C] text-white hover:bg-gray-800 border-0 gap-2"
                onClick={() => setCurrentView("add")}
              >
                <Plus size={16} />
                <span>Add KOL</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total KOLs */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="flex items-center p-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Total KOLs</p>
                  <h3 className="text-3xl font-bold mt-1">5</h3>
                  <p className="text-xs text-gray-500 mt-1">4 active KOLs</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-500" size={20} />
                </div>
              </CardContent>
            </Card>
            
            {/* Active Projects */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="flex items-center p-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Active Projects</p>
                  <h3 className="text-3xl font-bold mt-1">13</h3>
                  <p className="text-xs text-gray-500 mt-1">Live campaigns</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LineChart className="text-blue-500" size={20} />
                </div>
              </CardContent>
            </Card>
            
            {/* Avg. Engagement */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="flex items-center p-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Avg. Engagement</p>
                  <h3 className="text-3xl font-bold mt-1">330%</h3>
                  <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-green-500" size={20} />
                </div>
              </CardContent>
            </Card>
            
            {/* Total Revenue */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="flex items-center p-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-3xl font-bold mt-1">Rp 234.500.000</h3>
                  <p className="text-xs text-gray-500 mt-1">From all KOL campaigns</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Wallet className="text-amber-500" size={20} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6"></div>
          
          {currentView === "list" ? (
            <Card className="w-full bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        placeholder="Search KOLs by name or category..." 
                        className="pl-10" 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      <span>Filters</span>
                    </Button>
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[250px]">NAME</TableHead>
                          <TableHead>CATEGORY</TableHead>
                          <TableHead>FOLLOWERS</TableHead>
                          <TableHead>ENGAGEMENT</TableHead>
                          <TableHead>SCORE</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredKols.map(kol => <TableRow key={kol.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                <img src={kol.avatar} alt={kol.name} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <div>{kol.name}</div>
                                <div className="text-xs text-gray-500">
                                  {kol.platforms.join(", ")}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                              {kol.category}
                            </span>
                          </TableCell>
                          <TableCell>{formatNumber(kol.followers)}</TableCell>
                          <TableCell>{kol.engagement}%</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getScoreBadgeColor(kol.score)}`}>
                              {kol.score}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(kol.status)}`}>
                              {kol.status}
                            </span>
                          </TableCell>
                        </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full bg-white shadow-sm border">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">Add New KOL</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setCurrentView("list")}>
                        Cancel
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Create KOL
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full grid grid-cols-4 bg-gray-100/50 rounded-md">
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
                            <div className="text-5xl font-light text-gray-400">K</div>
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
                              <Input placeholder="Enter KOL name" />
                              <p className="text-xs text-gray-500 mt-1">This will be displayed across the platform.</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <Select>
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
                                <Input type="number" placeholder="0" />
                                <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
                                <Input type="number" placeholder="0" />
                                <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-2">
                              <Switch id="active" />
                              <label htmlFor="active" className="text-sm font-medium">
                                Active Status
                              </label>
                              <span className="text-xs text-gray-500 ml-2">Inactive - not available for campaigns</span>
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
                        
                        <div className="border rounded-md p-6 flex items-center justify-center flex-col py-12">
                          <p className="text-gray-500 mb-1">No social media platforms connected yet</p>
                          <p className="text-xs text-gray-400">Add platforms using the form above</p>
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
                            <p className="text-purple-800 text-lg font-bold">N/A%</p>
                            <p className="text-sm text-purple-700">Engagement Rate</p>
                            <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
                          </div>
                          
                          <div className="bg-blue-50 p-6 rounded-lg">
                            <p className="text-blue-800 text-lg font-bold">N/A%</p>
                            <p className="text-sm text-blue-700">ROI</p>
                            <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
                          </div>
                          
                          <div className="bg-green-50 p-6 rounded-lg">
                            <p className="text-green-800 text-lg font-bold">N/A%</p>
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
                                <Input type="number" placeholder="0" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Comments</label>
                                <Input type="number" placeholder="0" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Shares</label>
                                <Input type="number" placeholder="0" />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-4">Conversion Metrics</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Clicks</label>
                                <Input type="number" placeholder="0" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Purchases</label>
                                <Input type="number" placeholder="0" />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-4">Financial Metrics</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Revenue (IDR)</label>
                                <Input type="number" placeholder="0" />
                                <p className="text-xs text-gray-500 mt-1">Current value: Rp 0</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Cost (IDR)</label>
                                <Input type="number" placeholder="0" />
                                <p className="text-xs text-gray-500 mt-1">Current value: Rp 0</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>;
};

export default KolManagement;
