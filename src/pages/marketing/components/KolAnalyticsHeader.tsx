
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KolAnalyticsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  timeFilter: string;
  children: React.ReactNode;
}

export const KolAnalyticsHeader: React.FC<KolAnalyticsHeaderProps> = ({ 
  activeTab, 
  setActiveTab,
  timeFilter,
  children
}) => {
  return (
    <Card className="w-full bg-white shadow-sm border">
      <CardHeader className="hidden">
        <CardTitle>Key Opinion Leaders Management</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="engagement" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b bg-gray-50/50">
            <TabsList className="bg-transparent w-full justify-start rounded-none px-2 py-0 h-auto">
              <TabsTrigger 
                value="engagement" 
                className="py-1.5 px-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Engagement Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="roi" 
                className="py-1.5 px-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                ROI & Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="conversion" 
                className="py-1.5 px-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Conversion Metrics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="engagement" className="mt-0 p-3">
            {activeTab === "engagement" && children}
          </TabsContent>

          <TabsContent value="roi" className="mt-0 p-3">
            {activeTab === "roi" && children}
          </TabsContent>

          <TabsContent value="conversion" className="mt-0 p-3">
            {activeTab === "conversion" && children}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
