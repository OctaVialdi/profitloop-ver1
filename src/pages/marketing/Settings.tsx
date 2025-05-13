
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ServicesTab } from "./settings/ServicesTab";
import { SubServicesTab } from "./settings/SubServicesTab";
import { TeamMembersTab } from "./settings/TeamMembersTab";
import { ContentTypesTab } from "./settings/ContentTypesTab";
import { ContentPillarsTab } from "./settings/ContentPillarsTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("team-members");

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Marketing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-5 gap-2">
              <TabsTrigger value="team-members">Team Members</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="sub-services">Sub Services</TabsTrigger>
              <TabsTrigger value="content-types">Content Types</TabsTrigger>
              <TabsTrigger value="content-pillars">Content Pillars</TabsTrigger>
            </TabsList>
            
            <TabsContent value="team-members">
              <TeamMembersTab />
            </TabsContent>
            
            <TabsContent value="services">
              <ServicesTab />
            </TabsContent>
            
            <TabsContent value="sub-services">
              <SubServicesTab />
            </TabsContent>
            
            <TabsContent value="content-types">
              <ContentTypesTab />
            </TabsContent>
            
            <TabsContent value="content-pillars">
              <ContentPillarsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
