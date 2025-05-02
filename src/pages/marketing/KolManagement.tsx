
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart, Users, Plus, ChevronDown } from "lucide-react";
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

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeFilter, setTimeFilter] = useState("last-month");

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
    </div>
  );
};

export default KolManagement;
