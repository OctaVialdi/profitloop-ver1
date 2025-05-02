
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, Upload } from "lucide-react";

const AgencyComparison = () => {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedAgencies, setSelectedAgencies] = useState(["Digital Boost Agency"]);
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("meta");
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState("Agency Comparison");
  const [inputDataDialogOpen, setInputDataDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);

  // Mock data for the comparison
  const agencyData = [
    { 
      name: "Digital Boost Agency", 
      color: "bg-purple-400",
      totalSpend: "$33782.54",
      impressions: "2283000",
      avgCtr: "1.01%",
      roas: "4.30",
      vsAvg: "-20.1%",
      isPositive: false
    }
    // Add more agencies as needed
  ];

  const platforms = [
    { id: "meta", name: "Meta", icon: "🔤" },
    { id: "google", name: "Google", icon: "🔍" },
    { id: "tiktok", name: "TikTok", icon: "📱" },
    { id: "tokopedia", name: "Tokopedia", icon: "🛒" },
    { id: "shopee", name: "Shopee", icon: "🛍️" }
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

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 px-0">
      <h1 className="text-3xl font-bold mb-6">Agency Performance</h1>
      
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
                  {agencyData.map((agency) => (
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
          <div className="flex items-center gap-4">
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
      
      {/* Agency Performance Comparison Table */}
      <Card className="w-full mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agency Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">AGENCY</TableHead>
                  <TableHead>TOTAL SPEND</TableHead>
                  <TableHead>IMPRESSIONS</TableHead>
                  <TableHead>AVG. CTR</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>VS. AVG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agencyData.map((agency, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${agency.color}`}></div>
                        {agency.name}
                      </div>
                    </TableCell>
                    <TableCell>{agency.totalSpend}</TableCell>
                    <TableCell>{agency.impressions}</TableCell>
                    <TableCell>{agency.avgCtr}</TableCell>
                    <TableCell>{agency.roas}</TableCell>
                    <TableCell>
                      <Badge className={`${agency.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {agency.vsAvg}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Active Campaigns Section */}
      <Card className="w-full mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Campaigns</CardTitle>
          <Button 
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
            onClick={() => setInputDataDialogOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Input Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-gray-500">Active campaigns would be displayed here</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Add more relevant content for agency comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>ROAS Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">ROAS comparison chart would appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Spend Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Spend efficiency visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    {agencyData.map((agency) => (
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

export default AgencyComparison;
