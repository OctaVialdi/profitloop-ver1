
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentTypesTab } from "./settings/ContentTypesTab";
import { TeamMembersTab } from "./settings/TeamMembersTab";
import { ServicesTab } from "./settings/ServicesTab";
import { SubServicesTab } from "./settings/SubServicesTab";
import { ContentPillarsTab } from "./settings/ContentPillarsTab";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("content-types");

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Marketing Settings</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="content-types">Content Types</TabsTrigger>
            <TabsTrigger value="team-members">Team Members</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="sub-services">Sub Services</TabsTrigger>
            <TabsTrigger value="content-pillars">Content Pillars</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content-types">
            <ContentTypesTab />
          </TabsContent>
          
          <TabsContent value="team-members">
            <TeamMembersTab />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          
          <TabsContent value="sub-services">
            <SubServicesTab />
          </TabsContent>
          
          <TabsContent value="content-pillars">
            <ContentPillarsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
