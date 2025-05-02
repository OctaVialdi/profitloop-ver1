
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart, Users, Plus, ChevronDown, Search, SlidersHorizontal, LineChart, Wallet, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EngagementAnalysis } from "./components/EngagementAnalysis";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { ConversionMetrics } from "./components/ConversionMetrics";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeFilter, setTimeFilter] = useState("last-month");
  const [searchQuery, setSearchQuery] = useState("");

  // KOL data
  const kolData = [
    {
      id: 1,
      name: "Sarah Johnson",
      platforms: ["Instagram", "TikTok"],
      category: "Beauty",
      followers: 500000,
      engagement: 3.2,
      score: 78,
      status: "Active",
      avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png",
    },
    {
      id: 2,
      name: "Alex Chen",
      platforms: ["Instagram", "TikTok"],
      category: "Tech",
      followers: 350000,
      engagement: 2.8,
      score: 72,
      status: "Active",
      avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      platforms: ["Instagram", "TikTok"],
      category: "Fitness",
      followers: 620000,
      engagement: 4.5,
      score: 86,
      status: "Active",
      avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png",
    },
    {
      id: 4,
      name: "David Kim",
      platforms: ["Instagram"],
      category: "Fashion",
      followers: 280000,
      engagement: 2.2,
      score: 65,
      status: "Inactive",
      avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png",
    },
    {
      id: 5,
      name: "Emma Wilson",
      platforms: ["Instagram", "TikTok"],
      category: "Food",
      followers: 420000,
      engagement: 3.8,
      score: 81,
      status: "Active",
      avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png",
    },
  ];

  // Filter KOLs based on search query
  const filteredKols = kolData.filter((kol) => 
    kol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kol.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get badge color based on score
  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 px-0">
      <Card className="w-full bg-white shadow-sm border">
        <CardHeader className="hidden">
          <CardTitle>Key Opinion Leaders Management</CardTitle>
          <CardDescription>
            Manage and track your KOL partnerships and campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs 
            defaultValue="engagement" 
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <div className="border-b bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-4">
                <div className="flex space-x-2 mb-4 md:mb-0">
                  <Button 
                    variant="outline" 
                    className={`bg-[#9b87f5] text-white hover:bg-[#7E69AB] border-0 rounded-md flex items-center gap-2`}
                  >
                    <BarChart size={16} />
                    <span>Analytics</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="bg-white text-black border border-gray-200 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <Users size={16} />
                    <span>KOL List</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="bg-[#1A1F2C] text-white hover:bg-gray-800 border-0 rounded-md flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add KOL</span>
                  </Button>
                </div>
                
                <div className="w-full md:w-56">
                  <Select
                    value={timeFilter}
                    onValueChange={setTimeFilter}
                  >
                    <SelectTrigger className="w-full border rounded-md bg-white">
                      <SelectValue placeholder="Time Period">
                        {timeFilter === "last-week" && "Last Week"}
                        {timeFilter === "last-month" && "Last Month"}
                        {timeFilter === "last-quarter" && "Last Quarter"}
                        {timeFilter === "last-year" && "Last Year"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsList className="bg-transparent w-full justify-start rounded-none px-4 py-0">
                <TabsTrigger 
                  value="engagement" 
                  className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Engagement Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="roi" 
                  className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  ROI & Revenue
                </TabsTrigger>
                <TabsTrigger 
                  value="conversion" 
                  className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
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
      
      {/* New Section with header based on the image */}
      <div className="mt-8 w-full">
        <div className="px-4 md:px-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">KOL Management</h2>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button variant="outline" className="bg-white gap-2">
                <BarChart size={16} />
                <span>Analytics</span>
              </Button>
              <Button variant="outline" className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] border-0 gap-2">
                <Users size={16} />
                <span>KOL List</span>
              </Button>
              <Button variant="outline" className="bg-[#1A1F2C] text-white hover:bg-gray-800 border-0 gap-2">
                <Plus size={16} />
                <span>Add KOL</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>
        
        <Separator className="mb-6" />
        <div className="px-4 md:px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">KOL Performance Deep Dive</h2>
            <p className="text-muted-foreground mt-1">
              Detailed analysis and insights about your KOL campaign performance
            </p>
          </div>
          
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
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                      {filteredKols.map((kol) => (
                        <TableRow key={kol.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                <img 
                                  src={kol.avatar} 
                                  alt={kol.name}
                                  className="h-full w-full object-cover"
                                />
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
                        </TableRow>
                      ))}
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
        </div>
      </div>
    </div>
  );
};

export default KolManagement;
