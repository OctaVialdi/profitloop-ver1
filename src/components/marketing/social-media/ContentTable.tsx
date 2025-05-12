
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ContentTableHeader } from "./content/ContentTableHeader";
import { ContentBasicInfoSection } from "./content/ContentBasicInfoSection";
import { ContentDetailsSection } from "./content/ContentDetailsSection";
import { ContentProductionSection } from "./content/ContentProductionSection";
import { ContentPublishingSection } from "./content/ContentPublishingSection";
import { ContentItem, ContentType, Service, SubService, ContentPillar } from "@/types/contentManagement";

interface ContentTableProps {
  contentItems: ContentItem[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPlanners: any[];
  contentPillars: ContentPillar[];
  productionTeam: any[];
  isCalendarOpen: { [key: string]: boolean };
  toggleCalendar: (itemId: string, type: string) => void;
  handleDateChange: (itemId: string, date: Date | undefined, type: string) => void;
  handleTypeChange: (itemId: string, typeId: string) => void;
  handlePICChange: (itemId: string, picName: string) => void;
  handleServiceChange: (itemId: string, serviceId: string) => void;
  handleSubServiceChange: (itemId: string, subServiceId: string) => void;
  handleContentPillarChange: (itemId: string, pillarId: string) => void;
  handleStatusChange: (itemId: string, status: string) => void;
  handleProductionStatusChange: (itemId: string, status: string) => void;
  handleContentStatusChange: (itemId: string, status: string) => void;
  toggleSelectItem: (itemId: string) => void;
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  openBriefDialog: (itemId: string, brief: string, mode: "edit" | "view") => void;
  getFilteredSubServicesByServiceId: (serviceId: string) => SubService[];
  displayBrief: (brief: string) => string;
  resetRevisionCounter: (itemId: string) => void;
  resetProductionRevisionCounter: (itemId: string) => void;
  toggleApproval: (itemId: string, isApproved: boolean, field: "isApproved" | "productionApproved") => void;
  openTitleDialog: (itemId: string, currentTitle: string) => void;
  openLinkDialog: (itemId: string, type: "googleDrive" | "postLink", currentValue: string) => void;
  handlePICProductionChange: (itemId: string, picName: string) => void;
  handleDoneStatusChange: (itemId: string, isDone: boolean) => void;
  visibleColumns: string[];
  activeTab: string;
}

export const ContentTable: React.FC<ContentTableProps> = (props) => {
  const {
    contentItems,
    toggleSelectItem,
    selectAll,
    handleSelectAll,
    visibleColumns,
    activeTab,
  } = props;

  // Format date for display
  const formatDisplayDate = (dateString: string | undefined, includeTime: boolean = true) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return includeTime 
        ? format(date, "dd MMM yyyy - HH:mm")
        : format(date, "dd MMM yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return (
    <Table>
      <ContentTableHeader 
        selectAll={selectAll} 
        handleSelectAll={handleSelectAll} 
        visibleColumns={visibleColumns}
      />
      <TableBody>
        {contentItems.length > 0 ? (
          contentItems.map(item => (
            <TableRow key={item.id} className="hover:bg-slate-50/60">
              <TableCell className="text-center sticky left-0 bg-white z-10">
                <Checkbox 
                  checked={item.isSelected} 
                  onCheckedChange={() => toggleSelectItem(item.id)}
                  aria-label="Select row"
                />
              </TableCell>

              {/* Render different sections based on the active tab */}
              {activeTab === "primary" && (
                <ContentBasicInfoSection
                  item={item}
                  contentTypes={props.contentTypes}
                  services={props.services}
                  contentPlanners={props.contentPlanners}
                  isCalendarOpen={props.isCalendarOpen}
                  toggleCalendar={props.toggleCalendar}
                  handleDateChange={props.handleDateChange}
                  handleTypeChange={props.handleTypeChange}
                  handlePICChange={props.handlePICChange}
                  handleServiceChange={props.handleServiceChange}
                  handleSubServiceChange={props.handleSubServiceChange}
                  getFilteredSubServices={props.getFilteredSubServicesByServiceId}
                  openTitleDialog={props.openTitleDialog}
                />
              )}

              {activeTab === "details" && (
                <ContentDetailsSection
                  item={item}
                  contentPillars={props.contentPillars}
                  openBriefDialog={props.openBriefDialog}
                  handleContentPillarChange={props.handleContentPillarChange}
                  handleStatusChange={props.handleStatusChange}
                  resetRevisionCounter={props.resetRevisionCounter}
                  toggleApproval={props.toggleApproval}
                  displayBrief={props.displayBrief}
                  formatDisplayDate={formatDisplayDate}
                />
              )}

              {activeTab === "publishing" && (
                <>
                  {/* Mirror columns */}
                  <TableCell className="p-2">
                    {item.postDate ? formatDisplayDate(item.postDate, false) : "-"}
                  </TableCell>
                  <TableCell className="p-2">
                    {props.contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                  </TableCell>
                  <TableCell className="p-2">
                    {item.title ? 
                      (item.title.length > 25 ? 
                        `${item.title.substring(0, 25)}...` : 
                        item.title) : 
                      '-'}
                  </TableCell>

                  {/* Production section */}
                  <ContentProductionSection
                    item={item}
                    productionTeam={props.productionTeam}
                    isCalendarOpen={props.isCalendarOpen}
                    toggleCalendar={props.toggleCalendar}
                    handleDateChange={props.handleDateChange}
                    handlePICProductionChange={props.handlePICProductionChange}
                    openLinkDialog={props.openLinkDialog}
                    handleProductionStatusChange={props.handleProductionStatusChange}
                    resetProductionRevisionCounter={props.resetProductionRevisionCounter}
                    toggleApproval={props.toggleApproval}
                    formatDisplayDate={formatDisplayDate}
                  />

                  {/* Publishing section */}
                  <ContentPublishingSection
                    item={item}
                    openLinkDialog={props.openLinkDialog}
                    handleDoneStatusChange={props.handleDoneStatusChange}
                    handleContentStatusChange={props.handleContentStatusChange}
                    formatDisplayDate={formatDisplayDate}
                  />
                </>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
              No content items. Click "Add Row" to create one.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
