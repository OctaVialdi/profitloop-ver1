
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContentTable } from "./ContentTable";
import { ContentType, ContentPillar, Service, SubService } from "@/types/contentManagement";

interface ContentTabsTableProps {
  contentItems: any[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPlanners: any[];
  contentPillars: ContentPillar[];
  productionTeam: any[];
  isCalendarOpen: { [key: string]: boolean };
  isUserManager: boolean;
  toggleCalendar: (itemId: string, type: string) => void;
  handleDateChange: (itemId: string, date: Date | undefined, type: string) => void;
  handleTypeChange: (itemId: string, typeId: string) => void;
  handlePICChange: (itemId: string, picName: string) => void;
  handleServiceChange: (itemId: string, serviceId: string) => void;
  handleSubServiceChange: (itemId: string, subServiceId: string) => void;
  handleTitleChange: (itemId: string, title: string) => void;
  handleContentPillarChange: (itemId: string, pillarId: string) => void;
  handleStatusChange: (itemId: string, status: string) => void;
  handleProductionStatusChange: (itemId: string, status: string) => void;
  handleContentStatusChange: (itemId: string, status: string) => void;
  toggleSelectItem: (itemId: string) => void;
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  openBriefDialog: (itemId: string, brief: string, mode: "edit" | "view") => void;
  getFilteredSubServicesByServiceId: (serviceId: string) => SubService[];
  extractGoogleDocsLink: (text: string) => string | null;
  displayBrief: (brief: string) => string;
  resetRevisionCounter: (itemId: string) => void;
  resetProductionRevisionCounter: (itemId: string) => void;
  toggleApproved: (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => void;
  openTitleDialog: (itemId: string, currentTitle: string) => void;
  openLinkDialog: (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => void;
  handlePICProductionChange: (itemId: string, picName: string) => void;
  handleDoneStatusChange: (itemId: string, isDone: boolean) => void;
}

export const ContentTabsTable: React.FC<ContentTabsTableProps> = (props) => {
  const [activeTab, setActiveTab] = useState("primary");
  
  // Define column sets for each tab
  const primaryColumns = ["selectColumn", "postDate", "contentType", "pic", "service", "subService", "title"];
  const detailsColumns = ["selectColumn", "contentPillar", "brief", "status", "revision", "approved", "completionDate"];
  const publishingColumns = [
    "selectColumn", "mirrorPostDate", "mirrorContentType", "mirrorTitle", 
    "picProduction", "googleDriveLink", "productionStatus", "productionRevision", 
    "productionCompletionDate", "productionApproved", "productionApprovedDate", 
    "downloadLink", "postLink", "isDone", "actualPostDate", "onTimeStatus", "contentStatus"
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4 bg-white">
        <TabsTrigger value="primary" className="px-6">Primary Info</TabsTrigger>
        <TabsTrigger value="details" className="px-6">Content Details</TabsTrigger>
        <TabsTrigger value="publishing" className="px-6">Publishing Info</TabsTrigger>
      </TabsList>

      <TabsContent value="primary" className="mt-0">
        <ContentTable
          {...props}
          visibleColumns={primaryColumns}
          activeTab="primary"
        />
      </TabsContent>

      <TabsContent value="details" className="mt-0">
        <ContentTable
          {...props}
          visibleColumns={detailsColumns}
          activeTab="details"
        />
      </TabsContent>

      <TabsContent value="publishing" className="mt-0">
        <ContentTable
          {...props}
          visibleColumns={publishingColumns}
          activeTab="publishing"
        />
      </TabsContent>
    </Tabs>
  );
};
