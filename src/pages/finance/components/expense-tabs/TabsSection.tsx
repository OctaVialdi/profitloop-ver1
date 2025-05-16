
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabType } from "../hooks/expenses/useTabManagement";

interface TabsSectionProps {
  activeTab: TabType;
  onTabChange: (value: string) => void;
  overviewContent: React.ReactNode;
  complianceContent?: React.ReactNode;
  approvalsContent?: React.ReactNode;
  settingsContent?: React.ReactNode;
}

export function TabsSection({
  activeTab,
  onTabChange,
  overviewContent,
  complianceContent,
  approvalsContent,
  settingsContent,
}: TabsSectionProps) {
  
  // Event listener for switching to settings tab
  useEffect(() => {
    const handleSwitchToSettings = (event: Event) => {
      if ((event as CustomEvent).detail?.activeTab === 'settings') {
        onTabChange('settings');
      }
    };
    
    document.addEventListener('switch-to-settings-tab', handleSwitchToSettings);
    
    return () => {
      document.removeEventListener('switch-to-settings-tab', handleSwitchToSettings);
    };
  }, [onTabChange]);
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        {complianceContent && (
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        )}
        {approvalsContent && (
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        )}
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {overviewContent}
      </TabsContent>

      {complianceContent && (
        <TabsContent value="compliance" className="space-y-6">
          {complianceContent}
        </TabsContent>
      )}

      {approvalsContent && (
        <TabsContent value="approvals" className="space-y-6">
          {approvalsContent}
        </TabsContent>
      )}

      <TabsContent value="settings" className="space-y-6">
        {settingsContent}
      </TabsContent>
    </Tabs>
  );
}
