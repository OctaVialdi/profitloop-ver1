
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
            {activeTab === "engagement" && children}
          </TabsContent>

          <TabsContent value="roi" className="mt-0 p-4 md:p-6">
            {activeTab === "roi" && children}
          </TabsContent>

          <TabsContent value="conversion" className="mt-0 p-4 md:p-6">
            {activeTab === "conversion" && children}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
