
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContentTable } from "./ContentTable";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";

interface ContentTabsTableProps {
  contentItems: ContentItem[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPlanners: any[];
  contentPillars: ContentPillar[];
  isCalendarOpen: { [key: string]: boolean };
  isUserManager: boolean;
  toggleCalendar: (itemId: string) => void;
  handleDateChange: (itemId: string, date: Date | undefined) => void;
  handleTypeChange: (itemId: string, typeId: string) => void;
  handlePICChange: (itemId: string, picName: string) => void;
  handleServiceChange: (itemId: string, serviceId: string) => void;
  handleSubServiceChange: (itemId: string, subServiceId: string) => void;
  handleTitleChange: (itemId: string, title: string) => void;
  handleContentPillarChange: (itemId: string, pillarId: string) => void;
  handleStatusChange: (itemId: string, status: string) => void;
  toggleSelectItem: (itemId: string) => void;
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  openBriefDialog: (itemId: string, brief: string, mode: "edit" | "view") => void;
  getFilteredSubServicesByServiceId: (serviceId: string) => SubService[];
  extractGoogleDocsLink: (text: string) => string | null;
  displayBrief: (brief: string) => string;
  resetRevisionCounter: (itemId: string) => void;
  toggleApproved: (itemId: string, isApproved: boolean) => void;
  updateContentItem: (itemId: string, updates: Partial<ContentItem>) => void;
}

export const ContentTabsTable: React.FC<ContentTabsTableProps> = (props) => {
  const [activeTab, setActiveTab] = useState("primary");
  
  // Define column sets for each tab
  const primaryColumns = ["selectColumn", "postDate", "contentType", "pic", "service", "subService", "title"];
  const detailsColumns = ["selectColumn", "contentPillar", "brief", "status", "revision", "approved"];
  const publishingColumns = ["selectColumn", "completionDate", "mirrorPostDate", "mirrorContentType", "mirrorTitle"];
  const productionColumns = ["selectColumn", "picProduction", "googleDriveLink", "productionStatus", "productionRevision", "productionCompletionDate", "productionApproved", "productionApprovedDate"];
  const postingColumns = ["selectColumn", "downloadLink", "postLink", "isDone", "actualPostDate", "onTimeStatus", "contentStatus"];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4 bg-white">
        <TabsTrigger value="primary" className="px-6">Primary Info</TabsTrigger>
        <TabsTrigger value="details" className="px-6">Content Details</TabsTrigger>
        <TabsTrigger value="publishing" className="px-6">Publishing Info</TabsTrigger>
        <TabsTrigger value="production" className="px-6">Production</TabsTrigger>
        <TabsTrigger value="posting" className="px-6">Posting</TabsTrigger>
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

      <TabsContent value="production" className="mt-0">
        <ContentTable
          {...props}
          visibleColumns={productionColumns}
          activeTab="production"
        />
      </TabsContent>

      <TabsContent value="posting" className="mt-0">
        <ContentTable
          {...props}
          visibleColumns={postingColumns}
          activeTab="posting"
        />
      </TabsContent>
    </Tabs>
  );
};
