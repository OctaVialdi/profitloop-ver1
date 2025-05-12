
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ContentTabsTable } from "./ContentTabsTable";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";

interface ContentPlanTableProps {
  contentItems: ContentItem[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPlanners: any[];
  contentPillars: ContentPillar[];
  productionTeam: any[];
  isCalendarOpen: { [key: string]: boolean };
  toggleCalendar: (itemId: string, type: 'postDate' | 'completionDate' | 'productionCompletionDate' | 'productionApprovedDate' | 'actualPostDate') => void;
  handleDateChange: (itemId: string, date: Date | undefined, type: 'postDate' | 'completionDate' | 'productionCompletionDate' | 'productionApprovedDate' | 'actualPostDate') => void;
  handleTypeChange: (itemId: string, typeId: string) => void;
  handlePICChange: (itemId: string, picName: string) => void;
  handlePICProductionChange: (itemId: string, picName: string) => void;
  handleServiceChange: (itemId: string, serviceId: string) => void;
  handleSubServiceChange: (itemId: string, subServiceId: string) => void;
  handleTitleChange: (itemId: string, title: string) => void;
  handleContentPillarChange: (itemId: string, pillarId: string) => void;
  handleStatusChange: (itemId: string, status: string) => void;
  handleProductionStatusChange: (itemId: string, status: string) => void;
  handleContentStatusChange: (itemId: string, status: string) => void;
  toggleSelectItem: (itemId: string) => void;
  selectAllItems: (selected: boolean) => void;
  openBriefDialog: (itemId: string, brief: string, mode: "edit" | "view") => void;
  getFilteredSubServices: (serviceId: string) => SubService[];
  extractGoogleDocsLink: (text: string) => string | null;
  displayBrief: (brief: string) => string;
  resetRevisionCounter: (itemId: string) => void;
  resetProductionRevisionCounter: (itemId: string) => void;
  handleApprovalChange: (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => void;
  handleDoneStatusChange: (itemId: string, isDone: boolean) => void;
  openTitleDialog: (itemId: string, currentTitle: string) => void;
  openLinkDialog: (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => void;
  formatDisplayDate: (dateString: string | undefined, includeTime?: boolean) => string;
}

export const ContentPlanTable: React.FC<ContentPlanTableProps> = ({
  contentItems,
  contentTypes,
  services,
  subServices,
  contentPlanners,
  contentPillars,
  productionTeam,
  isCalendarOpen,
  toggleCalendar,
  handleDateChange,
  handleTypeChange,
  handlePICChange,
  handleServiceChange,
  handleSubServiceChange,
  handleTitleChange,
  handleContentPillarChange,
  handleStatusChange,
  toggleSelectItem,
  selectAllItems,
  openBriefDialog,
  getFilteredSubServices,
  extractGoogleDocsLink,
  displayBrief,
  resetRevisionCounter,
  handleApprovalChange,
  resetProductionRevisionCounter,
  handleProductionStatusChange,
  handleContentStatusChange,
  handleDoneStatusChange,
  openTitleDialog,
  openLinkDialog,
  formatDisplayDate,
  handlePICProductionChange
}) => {
  const selectAll = contentItems.length > 0 && contentItems.every(item => item.isSelected);
  
  const handleSelectAll = (checked: boolean) => {
    selectAllItems(checked);
  };

  const toggleApproved = (itemId: string, isApproved: boolean) => {
    handleApprovalChange(itemId, isApproved, "isApproved");
  };

  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <ContentTabsTable
        contentItems={contentItems}
        contentTypes={contentTypes}
        services={services}
        subServices={subServices}
        contentPlanners={contentPlanners}
        contentPillars={contentPillars}
        isCalendarOpen={isCalendarOpen}
        isUserManager={true} // You might want to pass this as a prop instead of hardcoding
        toggleCalendar={(itemId) => toggleCalendar(itemId, 'postDate')}
        handleDateChange={(itemId, date) => handleDateChange(itemId, date, 'postDate')}
        handleTypeChange={handleTypeChange}
        handlePICChange={handlePICChange}
        handleServiceChange={handleServiceChange}
        handleSubServiceChange={handleSubServiceChange}
        handleTitleChange={handleTitleChange}
        handleContentPillarChange={handleContentPillarChange}
        handleStatusChange={handleStatusChange}
        toggleSelectItem={toggleSelectItem}
        selectAll={selectAll}
        handleSelectAll={handleSelectAll}
        openBriefDialog={openBriefDialog}
        getFilteredSubServicesByServiceId={getFilteredSubServices}
        extractGoogleDocsLink={extractGoogleDocsLink}
        displayBrief={displayBrief}
        resetRevisionCounter={resetRevisionCounter}
        toggleApproved={toggleApproved}
      />
    </ScrollArea>
  );
};
