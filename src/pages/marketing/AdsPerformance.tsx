import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { ArrowUp, ArrowDown, Settings, ChevronDown, Check, Upload } from "lucide-react";

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

  // Mock data for the dashboard
  const metricsData = [
    { 
      title: "Impressions", 
      value: "2,500,000", 
      trend: "+12%", 
      trendUp: true 
    },
    { 
      title: "Click-Through Rate (CTR)", 
      value: "2.8%", 
      trend: "-5%", 
      trendUp: false 
    },
    { 
      title: "Return on Ad Spend (ROAS)", 
      value: "3.20", 
      trend: "+8%", 
      trendUp: true 
    },
    { 
      title: "Cost Per Click (CPC)", 
      value: "$0.53", 
      trend: "-3%", 
      trendUp: false 
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
        return "bg-blue-600 text-white";
      case "Paused":
        return "bg-yellow-500 text-white";
      case "Completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
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

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 px-0">
      <h1 className="text-3xl font-bold mb-6">Ads Performance</h1>
      
      {/* Filter and View Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Agency Filter</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-md cursor-pointer"
                onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
              >
                <span>{selectedAgencies.length} Agency Selected</span>
              </div>
              
              {agencyDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-96 bg-white border rounded-md shadow-lg z-30">
                  {agencies.map((agency) => (
                    <div 
                      key={agency.name}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleAgencySelection(agency.name)}
                    >
                      {selectedAgencies.includes(agency.name) ? (
                        <div className="w-5 h-5 flex items-center justify-center">✓</div>
                      ) : (
                        <div className="w-5 h-5"></div>
                      )}
                      <div className={`w-4 h-4 rounded-full ${agency.color}`}></div>
                      <span>{agency.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>Compare Mode</span>
              <Switch 
                checked={compareMode}
                onCheckedChange={setCompareMode}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">View Mode</p>
          <div className="relative">
            <div 
              className="flex items-center justify-between gap-2 px-4 py-2 bg-purple-50 rounded-md min-w-[200px] cursor-pointer"
              onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
            >
              <span>{viewMode}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            
            {viewDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-full bg-white border rounded-md shadow-lg z-30">
                <div 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setViewMode("Campaigns View");
                    setViewDropdownOpen(false);
                  }}
                >
                  Campaigns View
                </div>
                <div 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setViewMode("Agency Comparison");
                    setViewDropdownOpen(false);
                  }}
                >
                  Agency Comparison
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Tab Selection */}
      <div className="flex overflow-x-auto mb-6 bg-purple-50 rounded-md p-1">
        {platforms.map(platform => (
          <button
            key={platform.id}
            className={`flex items-center justify-center px-6 py-3 whitespace-nowrap ${
              activeTab === platform.id
                ? 'bg-white shadow-sm rounded-md'
                : 'hover:bg-purple-100'
            }`}
            onClick={() => setActiveTab(platform.id)}
          >
            <span className="mr-2">{platform.icon}</span>
            <span>{platform.name}</span>
          </button>
        ))}
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricsData.map((metric, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{metric.value}</p>
                <div className={`flex items-center ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trendUp ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  <span>{metric.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Tables */}
        <div className="col-span-2 space-y-6">
          {/* Spending Trends Graph */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Real-time Spending Trends</CardTitle>
              <CardDescription>Ad spend across platforms over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">Chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns Table */}
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Campaigns</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setInputDataDialogOpen(true)}
                >
                  <Upload className="h-4 w-4" />
                  <span>Input Data</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setColumnsDialogOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Columns</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
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
                      <TableRow key={index}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {agencies.find(a => a.name === campaign.agency) && (
                              <div className={`w-3 h-3 rounded-full ${agencies.find(a => a.name === campaign.agency).color}`}></div>
                            )}
                            {campaign.agency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </TableCell>
                        <TableCell>{campaign.budget}</TableCell>
                        <TableCell>{campaign.spent}</TableCell>
                        <TableCell>{campaign.impressions}</TableCell>
                        <TableCell>{campaign.ctr}</TableCell>
                        <TableCell>{campaign.cpc}</TableCell>
                        <TableCell>{campaign.conversions}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Delete</span>
                              🗑️
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Edit</span>
                              ✏️
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
          </Card>
        </div>

        {/* Right Column - Budget and Tips */}
        <div className="space-y-6">
          {/* Budget Summary Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Budget:</span>
                <span className="font-semibold">$25,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spent:</span>
                <span className="font-semibold">$18,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-semibold">$6,500</span>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <div className="mt-1">⚠️</div>
                  <div>
                    <p className="font-semibold">Budget Utilization: 74%</p>
                    <p className="text-sm text-green-700">Budget utilization is on track</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Optimization Tips */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>AI Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <p>{tip}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Target Management Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Target Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex">
                <button 
                  className={`px-4 py-2 ${targetManagementTab === 'active-targets' ? 'bg-purple-50 text-purple-800' : 'bg-gray-100'} rounded-l-md`}
                  onClick={() => setTargetManagementTab('active-targets')}
                >
                  Active Targets
                </button>
                <button 
                  className={`px-4 py-2 ${targetManagementTab === 'configure-kpi' ? 'bg-purple-50 text-purple-800' : 'bg-gray-100'} rounded-r-md`}
                  onClick={() => setTargetManagementTab('configure-kpi')}
                >
                  Configure KPI
                </button>
              </div>

              {targetManagementTab === 'active-targets' ? (
                <div className="space-y-4">
                  {targets.map((target, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold">{target.name}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-md ${getTargetStatusClass(target.status)}`}>
                          {target.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1 text-sm mb-2">
                        <span className="text-gray-500">Platform: {target.platform}</span>
                        <span className="text-gray-500">Metric: {target.metric}</span>
                        <span className="text-gray-500">Current: {target.current}</span>
                        <span className="text-gray-500">Target: {target.target}</span>
                        <span className="text-gray-500">Progress: {target.progress}%</span>
                        <span className="text-gray-500">0 days remaining</span>
                      </div>
                      <Progress value={target.progress} className={getProgressBarColor(target.status)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <h3 className="text-xl font-medium">KPI Configuration Tool</h3>
                  <p className="text-gray-500">Set up new KPIs and targets for your campaigns.</p>
                  <Button className="bg-blue-500 hover:bg-blue-600">Create New KPI</Button>
                </div>
              )}
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
            <div className="flex rounded-md overflow-hidden bg-gray-100 mb-6">
              <button 
                className={`flex-1 px-6 py-3 text-center ${activeColumnsTab === 'select-columns' ? 'bg-white' : ''}`}
                onClick={() => setActiveColumnsTab('select-columns')}
              >
                Select Columns
              </button>
              <button 
                className={`flex-1 px-6 py-3 text-center ${activeColumnsTab === 'column-order' ? 'bg-white' : ''}`}
                onClick={() => setActiveColumnsTab('column-order')}
              >
                Column Order
              </button>
              <button 
                className={`flex-1 px-6 py-3 text-center ${activeColumnsTab === 'presets' ? 'bg-white' : ''}`}
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
            <Button className="bg-purple-500 hover:bg-purple-600">
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
                  className="w-full border rounded-md px-4 py-2 flex items-center justify-between cursor-pointer"
                  onClick={() => setShowAgencyDropdown(!showAgencyDropdown)}
                >
                  <span>{selectedAgency || "Select an agency"}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                
                {showAgencyDropdown && (
                  <div className="absolute w-full mt-1 border rounded-md bg-white shadow-lg z-40">
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
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Upload
                </Button>
              </div>
              <p className="text-sm text-gray-500">Supported formats: CSV, Excel (.xlsx, .xls)</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-700 mb-2">Required Columns</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Campaign Name</li>
                <li>• Start Date</li>
                <li>• End Date</li>
                <li>• Budget</li>
                <li>• Impressions</li>
                <li>• Clicks</li>
                <li>• Conversions (optional)</li>
                <li>• Spend</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdsPerformance;
