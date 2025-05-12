
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentTypesTab from "@/components/marketing/settings/ContentTypesTab";
import ServicesTab from "@/components/marketing/settings/ServicesTab";
import SubServicesTab from "@/components/marketing/settings/SubServicesTab";
import ContentPillarsTab from "@/components/marketing/settings/ContentPillarsTab";
import TeamMembersTab from "@/components/marketing/settings/TeamMembersTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("content-types");

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-6">Marketing Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="content-types">Content Types</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="sub-services">Sub Services</TabsTrigger>
            <TabsTrigger value="content-pillars">Content Pillars</TabsTrigger>
            <TabsTrigger value="team-members">Team Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content-types">
            <ContentTypesTab />
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
          
          <TabsContent value="team-members">
            <TeamMembersTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Settings;
