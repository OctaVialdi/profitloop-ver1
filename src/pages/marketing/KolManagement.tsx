
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");

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
              <div className="text-muted-foreground">
                <p>Engagement analysis content will go here. This tab shows data about how audiences are engaging with your Key Opinion Leaders' content.</p>
              </div>
            </TabsContent>

            <TabsContent value="roi" className="mt-0 p-4 md:p-6">
              <div className="text-muted-foreground">
                <p>ROI & Revenue content will go here. This tab shows return on investment and revenue generation from your KOL marketing campaigns.</p>
              </div>
            </TabsContent>

            <TabsContent value="conversion" className="mt-0 p-4 md:p-6">
              <div className="text-muted-foreground">
                <p>Conversion Metrics content will go here. This tab shows how many users are converting after interacting with your KOL content.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KolManagement;
