
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { EngagementAnalysisTab } from "./KolAnalyticsTabs/EngagementAnalysisTab";
import { RoiRevenueTab } from "./KolAnalyticsTabs/RoiRevenueTab";
import { ConversionMetricsTab } from "./KolAnalyticsTabs/ConversionMetricsTab";

export const KolAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("last-month");
  const [activeTab, setActiveTab] = useState("engagement");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">KOL Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">Last Week</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3 bg-gray-50 p-1 rounded-lg">
          <TabsTrigger 
            value="engagement" 
            className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Engagement Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="roi" 
            className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            ROI & Revenue
          </TabsTrigger>
          <TabsTrigger 
            value="conversion" 
            className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Conversion Metrics
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="engagement">
            <EngagementAnalysisTab />
          </TabsContent>
          
          <TabsContent value="roi">
            <RoiRevenueTab />
          </TabsContent>
          
          <TabsContent value="conversion">
            <ConversionMetricsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
