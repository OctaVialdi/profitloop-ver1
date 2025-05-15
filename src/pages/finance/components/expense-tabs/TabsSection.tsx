
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface TabsSectionProps {
  activeTab: "overview" | "compliance" | "approvals" | "settings";
  onTabChange: (value: string) => void;
  overviewContent: ReactNode;
  settingsContent?: ReactNode;
}

export function TabsSection({ 
  activeTab, 
  onTabChange, 
  overviewContent, 
  settingsContent 
}: TabsSectionProps) {
  return (
    <Tabs defaultValue="overview" value={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="bg-card rounded-xl p-1 border overflow-auto">
        <TabsTrigger 
          value="overview" 
          className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="compliance" 
          className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Compliance
        </TabsTrigger>
        <TabsTrigger 
          value="approvals" 
          className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Approvals
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          Settings
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab Content */}
      <TabsContent value="overview" className="mt-6 space-y-10">
        {overviewContent}
      </TabsContent>
      
      {/* Compliance Tab Content */}
      <TabsContent value="compliance" className="mt-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Compliance functionality will be available soon.</p>
        </div>
      </TabsContent>
      
      {/* Approvals Tab Content */}
      <TabsContent value="approvals" className="mt-6">
        <div className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">Approvals functionality will be available soon.</p>
        </div>
      </TabsContent>
      
      {/* Settings Tab Content */}
      <TabsContent value="settings" className="mt-6">
        {settingsContent || (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
