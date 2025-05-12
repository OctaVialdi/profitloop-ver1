
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";
import { ContentTableHeader } from "./table/ContentTableHeader";
import { ContentTableRow } from "./table/ContentTableRow";
import { EmptyContentRow } from "./table/EmptyContentRow";

interface ContentTableProps {
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
}

export const ContentTable: React.FC<ContentTableProps> = ({
  contentItems,
  contentTypes,
  services,
  subServices,
  contentPlanners,
  contentPillars,
  isCalendarOpen,
  isUserManager,
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
  selectAll,
  handleSelectAll,
  openBriefDialog,
  getFilteredSubServicesByServiceId,
  extractGoogleDocsLink,
  displayBrief,
  resetRevisionCounter
}) => {
  return (
    <div className="w-full overflow-hidden">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <Table className="w-full min-w-max table-fixed">
          <ContentTableHeader
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
          />
          <TableBody>
            {contentItems.length > 0 ? (
              contentItems.map(item => (
                <ContentTableRow
                  key={item.id}
                  item={item}
                  contentTypes={contentTypes}
                  services={services}
                  subServices={subServices}
                  contentPlanners={contentPlanners}
                  contentPillars={contentPillars}
                  isCalendarOpen={isCalendarOpen}
                  toggleCalendar={toggleCalendar}
                  handleDateChange={handleDateChange}
                  handleTypeChange={handleTypeChange}
                  handlePICChange={handlePICChange}
                  handleServiceChange={handleServiceChange}
                  handleSubServiceChange={handleSubServiceChange}
                  handleTitleChange={handleTitleChange}
                  handleContentPillarChange={handleContentPillarChange}
                  handleStatusChange={handleStatusChange}
                  toggleSelectItem={toggleSelectItem}
                  openBriefDialog={openBriefDialog}
                  getFilteredSubServicesByServiceId={getFilteredSubServicesByServiceId}
                  extractGoogleDocsLink={extractGoogleDocsLink}
                  displayBrief={displayBrief}
                  resetRevisionCounter={resetRevisionCounter}
                />
              ))
            ) : (
              <EmptyContentRow />
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
