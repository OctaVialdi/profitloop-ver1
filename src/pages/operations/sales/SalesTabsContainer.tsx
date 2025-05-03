
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitiesTab } from "./tabs/ActivitiesTab";
import { PipelineTab } from "./tabs/PipelineTab";
import { DashboardTab } from "./tabs/DashboardTab";
import { GamificationTab } from "./tabs/GamificationTab";
import { OkrSystemTab } from "./tabs/OkrSystemTab";

export const SalesTabsContainer = () => {
  const [activeTab, setActiveTab] = useState("activities");
  
  return (
    <div>
      <div className="mb-4">
        <Tabs defaultValue="activities" className="w-full" onValueChange={value => setActiveTab(value)}>
          <TabsList className="h-8">
            <TabsTrigger value="activities" className="text-xs h-7">Activities</TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs h-7">Pipeline</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs h-7">Dashboard</TabsTrigger>
            <TabsTrigger value="gamification" className="text-xs h-7">Gamification</TabsTrigger>
            <TabsTrigger value="okr" className="text-xs h-7">OKR System</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "activities" && <ActivitiesTab />}
      {activeTab === "pipeline" && <PipelineTab />}
      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "gamification" && <GamificationTab />}
      {activeTab === "okr" && <OkrSystemTab />}
    </div>
  );
};
