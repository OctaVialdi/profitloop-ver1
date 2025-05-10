import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  ArrowDown,
  Settings,
  ChevronDown,
  Check,
  Upload,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Download,
  Calendar,
  Info
} from "lucide-react";

const AdsPerformance = () => {
  // States for managing UI interactions
  const [compareMode, setCompareMode] = useState(false);
  const [selectedAgencies, setSelectedAgencies] = useState(["Digital Boost Agency"]);
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState("Campaigns View");
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("meta");
  const [columnsDialogOpen, setColumnsDialogOpen] = useState(false);
  const [activeColumnsTab, setActiveColumnsTab] = useState("select-columns");
  const [targetManagementTab, setTargetManagementTab] = useState("active-targets");
  const [inputDataDialogOpen, setInputDataDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for the dashboard
  const metricsData = [
    { 
      title: "Impressions", 
      value: "2,500,000", 
      trend: "+12%", 
      trendUp: true,
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />
    },
    { 
      title: "Click-Through Rate (CTR)", 
      value: "2.8%", 
      trend: "-5%", 
      trendUp: false,
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    },
    { 
      title: "Return on Ad Spend (ROAS)", 
      value: "3.20", 
      trend: "+8%", 
      trendUp: true,
      icon: <ArrowUp className="h-5 w-5 text-green-500" />
    },
    { 
      title: "Cost Per Click (CPC)", 
      value: "$0.53", 
      trend: "-3%", 
      trendUp: false,
      icon: <ArrowDown className="h-5 w-5 text-red-500" />
    }
  ];

  const campaignData = [
    { 
      name: "Summer Sale 2024", 
      agency: "Digital Boost Agency", 
      status: "Active", 
      budget: "$5,000", 
      spent: "$3,200", 
      impressions: "1,500,000", 
      ctr: "3.2%", 
      cpc: "$0.48", 
      conversions: "520" 
    },
    { 
      name: "Brand Awareness Q1", 
      agency: "Digital Boost Agency", 
      status: "Active", 
      budget: "$3,000", 
      spent: "$1,800", 
      impressions: "900,000", 
      ctr: "2.8%", 
      cpc: "$0.52", 
      conversions: "320" 
    },
    { 
      name: "Product Launch", 
      agency: "In-House Team", 
      status: "Active", 
      budget: "$4,000", 
      spent: "$2,500", 
      impressions: "1,100,000", 
      ctr: "3.5%", 
      cpc: "$0.47", 
      conversions: "380" 
    },
    { 
      name: "Holiday Special", 
      agency: "SocialWave", 
      status: "Active", 
      budget: "$6,000", 
      spent: "$4,100", 
      impressions: "1,800,000", 
      ctr: "2.9%", 
      cpc: "$0.51", 
      conversions: "580" 
    }
  ];

  const agencies = [
    { name: "Digital Boost Agency", color: "bg-purple-400" },
    { name: "SocialAds Pro", color: "bg-blue-400" },
    { name: "E-Commerce Experts", color: "bg-orange-400" },
    { name: "Brand Growth Partners", color: "bg-purple-500" },
    { name: "Local Marketing Solutions", color: "bg-pink-400" }
  ];

  const platforms = [
    { id: "meta", name: "Meta", icon: "🔤" },
    { id: "google", name: "Google", icon: "🔍" },
    { id: "tiktok", name: "TikTok", icon: "📱" },
    { id: "tokopedia", name: "Tokopedia", icon: "🛒" },
    { id: "shopee", name: "Shopee", icon: "🛍️" }
  ];

  const targets = [
    { 
      name: "Q1 Meta Conversions", 
      platform: "meta", 
      metric: "conversions",
      current: 750,
      target: 1000,
      progress: 75,
      status: "On Track"
    },
    { 
      name: "Google ROAS Target", 
      platform: "google", 
      metric: "roas",
      current: 2.8,
      target: 3.5,
      progress: 80,
      status: "At Risk"
    },
    { 
      name: "TikTok Impressions", 
      platform: "tiktok", 
      metric: "impressions",
      current: 200000,
      target: 500000,
      progress: 40,
      status: "Missed"
    }
  ];

  const tips = [
    "Increase budget for Meta campaigns with ROAS > 3.0",
    "Pause underperforming Google ads with high CPCs",
    "Test new creative variations on TikTok campaigns",
    "Optimize ad scheduling to focus on peak conversion times"
  ];

  const toggleAgencySelection = (agency) => {
    if (selectedAgencies.includes(agency)) {
      if (selectedAgencies.length > 1) {
        setSelectedAgencies(selectedAgencies.filter(a => a !== agency));
      }
    } else {
      setSelectedAgencies([...selectedAgencies, agency]);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Paused":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTargetStatusClass = (status) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800";
      case "At Risk":
        return "bg-yellow-100 text-yellow-800";
      case "Missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "On Track":
        return "bg-green-500";
      case "At Risk":
        return "bg-yellow-500";
      case "Missed":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  // Time range options for filtering
  const timeRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last-7-days", label: "Last 7 days" },
    { value: "last-30-days", label: "Last 30 days" },
    { value: "this-month", label: "This month" },
    { value: "last-month", label: "Last month" },
    { value: "custom", label: "Custom range" },
  ];

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ads Performance</h1>
            <p className="text-gray-500 mt-1">Analyze and optimize your ad campaigns across platforms</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="bg-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            
            <Button variant="outline" className="bg-white flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Filter and View Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Agency Filter */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Agency Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-md cursor-pointer border border-gray-200"
                    onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                  >
                    <span>{selectedAgencies.length} Agency Selected</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </div>
                  
                  {agencyDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg z-30">
                      {agencies.map((agency) => (
                        <div 
                          key={agency.name}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleAgencySelection(agency.name)}
                        >
                          {selectedAgencies.includes(agency.name) ? (
                            <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center text-white">
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border rounded"></div>
                          )}
                          <div className={`w-3 h-3 rounded-full ${agency.color}`}></div>
                          <span>{agency.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Compare Mode</span>
                  <Switch 
                    checked={compareMode}
                    onCheckedChange={setCompareMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Mode */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">View Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div 
                  className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-md cursor-pointer border border-gray-200"
                  onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                >
                  <span>{viewMode}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                
                {viewDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-lg z-30">
                    <div 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        setViewMode("Campaigns View");
                        setViewDropdownOpen(false);
                      }}
                    >
                      <Check className={`h-4 w-4 ${viewMode === "Campaigns View" ? "opacity-100 text-purple-500" : "opacity-0"}`} />
                      <span>Campaigns View</span>
                    </div>
                    <div 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        setViewMode("Agency Comparison");
                        setViewDropdownOpen(false);
                      }}
                    >
                      <Check className={`h-4 w-4 ${viewMode === "Agency Comparison" ? "opacity-100 text-purple-500" : "opacity-0"}`} />
                      <span>Agency Comparison</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Search */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Search Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="h-4 w-4 absolute top-2.5 left-3 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Tab Selection */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-1">
            <div className="flex overflow-x-auto">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  className={`flex items-center justify-center px-6 py-3 whitespace-nowrap transition-colors ${
                    activeTab === platform.id
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500 font-medium'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                  onClick={() => setActiveTab(platform.id)}
                >
                  <span className="mr-2">{platform.icon}</span>
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric, index) => (
            <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {metric.icon}
                  </div>
                  <div className={`flex items-center ${metric.trendUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} rounded-full px-2 py-1 text-xs`}>
                    {metric.trendUp ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{metric.trend}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Tables */}
          <div className="col-span-2 space-y-6">
            {/* Spending Trends Graph */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Real-time Spending Trends</CardTitle>
                    <CardDescription>Ad spend across platforms over time</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Campaigns Table */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Campaigns</CardTitle>
                    <CardDescription>Manage and monitor all your active ad campaigns</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-white"
                      onClick={() => setInputDataDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Input Data</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 bg-white"
                      onClick={() => setColumnsDialogOpen(true)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Columns</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Agency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Impressions</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>CPC</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignData.map((campaign, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {agencies.find(a => a.name === campaign.agency) && (
                                <div className={`w-2 h-2 rounded-full ${agencies.find(a => a.name === campaign.agency).color}`}></div>
                              )}
                              {campaign.agency}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.budget}</TableCell>
                          <TableCell>{campaign.spent}</TableCell>
                          <TableCell>{campaign.impressions}</TableCell>
                          <TableCell>{campaign.ctr}</TableCell>
                          <TableCell>{campaign.cpc}</TableCell>
                          <TableCell>{campaign.conversions}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 text-gray-500 hover:text-red-600">
                                <span className="sr-only">Delete</span>
                                🗑️
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                <span className="sr-only">Edit</span>
                                ✏️
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                <span className="sr-only">Copy</span>
                                📋
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t flex justify-between py-2 px-4">
                <div className="text-sm text-gray-500">Showing 4 of 4 campaigns</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled className="bg-white">Previous</Button>
                  <Button variant="outline" size="sm" disabled className="bg-white">Next</Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Budget and Tips */}
          <div className="space-y-6">
            {/* Budget Summary Card */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Budget Summary</CardTitle>
                  <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1 text-gray-500">
                    <Info className="h-3 w-3" />
                    Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-semibold text-lg">$25,000</span>
                </div>
                <Separator className="my-2" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-semibold text-purple-700">$18,500</span>
                  </div>
                  <Progress value={74} className="h-2 bg-gray-100" indicatorColor="bg-purple-500" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>74% Used</span>
                    <span>26% Remaining</span>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-semibold text-green-600">$6,500</span>
                </div>
                <div className="bg-green-50 p-4 rounded-md mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full text-green-600 mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Budget Utilization: 74%</p>
                      <p className="text-sm text-green-700">Budget utilization is on track</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Management Card */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle>Target Management</CardTitle>
                <CardDescription>Track and manage your KPI targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-md p-1 flex">
                  <button 
                    className={`flex-1 px-4 py-2 text-center rounded-md transition-colors ${targetManagementTab === 'active-targets' ? 'bg-white shadow-sm text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
                    onClick={() => setTargetManagementTab('active-targets')}
                  >
                    Active Targets
                  </button>
                  <button 
                    className={`flex-1 px-4 py-2 text-center rounded-md transition-colors ${targetManagementTab === 'configure-kpi' ? 'bg-white shadow-sm text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
                    onClick={() => setTargetManagementTab('configure-kpi')}
                  >
                    Configure KPI
                  </button>
                </div>

                {targetManagementTab === 'active-targets' ? (
                  <div className="space-y-4">
                    {targets.map((target, index) => (
                      <div key={index} className="border rounded-md p-4 hover:border-purple-200 transition-colors bg-white">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-semibold">{target.name}</h4>
                          <Badge className={getTargetStatusClass(target.status)}>
                            {target.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-y-1 text-sm mb-3">
                          <span className="text-gray-500">Platform: {platforms.find(p => p.id === target.platform)?.name || target.platform}</span>
                          <span className="text-gray-500">Metric: {target.metric}</span>
                          <span className="text-gray-500">Current: {target.current}</span>
                          <span className="text-gray-500">Target: {target.target}</span>
                        </div>
                        <div className="mb-1 flex justify-between text-xs text-gray-500">
                          <span>Progress: {target.progress}%</span>
                          <span>0 days remaining</span>
                        </div>
                        <Progress value={target.progress} className={`h-2 bg-gray-100 ${getProgressBarColor(target.status)}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 space-y-4 bg-gray-50 rounded-md border border-dashed border-gray-200">
                    <h3 className="text-xl font-medium">KPI Configuration Tool</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Set up new KPIs and targets for your campaigns to track progress towards your marketing goals.</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">Create New KPI</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Pro Tips Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="p-1 bg-purple-100 rounded-full text-purple-600 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Column Customization Dialog */}
        <Dialog open={columnsDialogOpen} onOpenChange={setColumnsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Customize Table Columns</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-gray-50 rounded-md p-1 flex mb-6">
                <button 
                  className={`flex-1 px-4 py-3 text-center rounded-md transition-colors ${activeColumnsTab === 'select-columns' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setActiveColumnsTab('select-columns')}
                >
                  Select Columns
                </button>
                <button 
                  className={`flex-1 px-4 py-3 text-center rounded-md transition-colors ${activeColumnsTab === 'column-order' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setActiveColumnsTab('column-order')}
                >
                  Column Order
                </button>
                <button 
                  className={`flex-1 px-4 py-3 text-center rounded-md transition-colors ${activeColumnsTab === 'presets' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setActiveColumnsTab('presets')}
                >
                  Presets
                </button>
              </div>

              {activeColumnsTab === 'select-columns' && (
                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="Search columns..."
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Basic</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-campaign" className="rounded" defaultChecked />
                          <label htmlFor="col-campaign">Campaign</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-agency" className="rounded" defaultChecked />
                          <label htmlFor="col-agency">Agency</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-status" className="rounded" defaultChecked />
                          <label htmlFor="col-status">Status</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Financial</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-budget" className="rounded" defaultChecked />
                          <label htmlFor="col-budget">Budget</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-spent" className="rounded" defaultChecked />
                          <label htmlFor="col-spent">Spent</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Performance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-impressions" className="rounded" defaultChecked />
                          <label htmlFor="col-impressions">Impressions</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-ctr" className="rounded" defaultChecked />
                          <label htmlFor="col-ctr">CTR</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-cpc" className="rounded" defaultChecked />
                          <label htmlFor="col-cpc">CPC</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-conversions" className="rounded" defaultChecked />
                          <label htmlFor="col-conversions">Conversions</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">UI</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="col-actions" className="rounded" defaultChecked />
                          <label htmlFor="col-actions">Actions</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeColumnsTab === 'column-order' && (
                <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No columns selected</p>
                </div>
              )}

              {activeColumnsTab === 'presets' && (
                <div className="space-y-6">
                  <h4 className="font-medium">Available Presets</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <span>default</span>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded">
                          <Check className="h-4 w-4" />
                          <span>Apply</span>
                        </button>
                        <button className="text-red-500">🗑️</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <span>compact</span>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded">
                          <Check className="h-4 w-4" />
                          <span>Apply</span>
                        </button>
                        <button className="text-red-500">🗑️</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium">Save Current Configuration</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Preset name"
                        className="flex-1 px-4 py-2 border rounded-md"
                      />
                      <Button className="bg-purple-500 hover:bg-purple-600">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setColumnsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Apply Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Input Data Dialog */}
        <Dialog open={inputDataDialogOpen} onOpenChange={setInputDataDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Upload Campaign Data</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <p className="text-gray-600">Select an agency and upload campaign data in Excel or CSV format</p>
              
              <div className="space-y-2">
                <label className="font-medium">Select Agency</label>
                <div className="relative">
                  <div 
                    className="w-full border rounded-md px-4 py-2 flex items-center justify-between cursor-pointer bg-white"
                    onClick={() => setShowAgencyDropdown(!showAgencyDropdown)}
                  >
                    <span>{selectedAgency || "Select an agency"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  
                  {showAgencyDropdown && (
                    <div className="absolute w-full mt-1 border rounded-md bg-white shadow-lg z-40 max-h-48 overflow-auto">
                      {agencies.map((agency) => (
                        <div 
                          key={agency.name}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedAgency(agency.name);
                            setShowAgencyDropdown(false);
                          }}
                        >
                          {agency.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">Campaign data will only be visible when this agency is selected in the dashboard</p>
              </div>

              <div className="space-y-2">
                <label className="font-medium">Upload File (Excel/CSV)</label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <Input
                      type="file"
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      accept=".csv,.xlsx,.xls"
                    />
                    <div className="flex items-center justify-between w-full border rounded-md px-4 py-2 bg-white">
                      <span className="text-gray-500">Choose file...</span>
                      <Upload className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Upload
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Supported formats: CSV, Excel (.xlsx, .xls)</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Required Columns
                </h3>
                <ul className="text-sm text-blue-600 space-y-1 grid grid-cols-2">
                  <li className="flex items-center gap-1">• Campaign Name</li>
                  <li className="flex items-center gap-1">• Start Date</li>
                  <li className="flex items-center gap-1">• End Date</li>
                  <li className="flex items-center gap-1">• Budget</li>
                  <li className="flex items-center gap-1">• Impressions</li>
                  <li className="flex items-center gap-1">• Clicks</li>
                  <li className="flex items-center gap-1">• Conversions (optional)</li>
                  <li className="flex items-center gap-1">• Spend</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdsPerformance;
