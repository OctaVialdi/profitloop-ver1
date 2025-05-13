
import React from "react";
import ContentPlan from "./components/ContentPlan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EngagementAnalysis } from "./components/EngagementAnalysis";
import { ConversionMetrics } from "./components/ConversionMetrics";
import { RoiAnalysis } from "./components/RoiAnalysis";

export default function SocialMediaManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Media Management</h1>
        <p className="text-muted-foreground mt-2">
          Plan, track, and analyze your social media content and performance.
        </p>
      </div>
      
      <Tabs defaultValue="content-plan">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content-plan">Content Plan</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content-plan" className="mt-4">
          <ContentPlan />
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-4">
          <EngagementAnalysis timeFilter="month" />
        </TabsContent>
        
        <TabsContent value="conversion" className="mt-4">
          <ConversionMetrics timeFilter="month" />
        </TabsContent>
        
        <TabsContent value="roi" className="mt-4">
          <RoiAnalysis timeFilter="month" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
