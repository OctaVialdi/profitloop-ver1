
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { EngagementAnalysisTab } from "./KolAnalyticsTabs/EngagementAnalysisTab";
import { RoiRevenueTab } from "./KolAnalyticsTabs/RoiRevenueTab";
import { ConversionMetricsTab } from "./KolAnalyticsTabs/ConversionMetricsTab";
import { useIsMobile } from "@/hooks/use-mobile";

export const KolAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("last-month");
  const [activeTab, setActiveTab] = useState("engagement");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} items-start md:items-center gap-4 mb-2`}>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
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
        <TabsList className="w-full grid grid-cols-3 bg-transparent">
          <TabsTrigger 
            value="engagement" 
            className="py-2 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:rounded-none data-[state=active]:shadow-none rounded-none"
          >
            Engagement Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="roi" 
            className="py-2 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:rounded-none data-[state=active]:shadow-none rounded-none"
          >
            ROI & Revenue
          </TabsTrigger>
          <TabsTrigger 
            value="conversion" 
            className="py-2 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:rounded-none data-[state=active]:shadow-none rounded-none"
          >
            Conversion Metrics
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="engagement" className="mt-0">
            <EngagementAnalysisTab />
          </TabsContent>
          
          <TabsContent value="roi" className="mt-0">
            <RoiRevenueTab />
          </TabsContent>
          
          <TabsContent value="conversion" className="mt-0">
            <ConversionMetricsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
