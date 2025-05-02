
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
      <div className="mb-6">
        <Tabs defaultValue="activities" className="w-full" onValueChange={value => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="okr">OKR System</TabsTrigger>
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
