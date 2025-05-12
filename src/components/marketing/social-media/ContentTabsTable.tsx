
import React from "react";
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
}

export const ContentTabsTable: React.FC<ContentTabsTableProps> = (props) => {
  // Define all columns for the single table
  const allColumns = [
    "selectColumn", "postDate", "contentType", "pic", "service", "subService", "title", 
    "contentPillar", "brief", "status", "revision", "approved", "completionDate", 
    "mirrorPostDate", "mirrorContentType", "mirrorTitle"
  ];

  // Define fixed widths for all columns
  const columnWidths = {
    selectColumn: 50,
    postDate: 120,
    contentType: 120,
    pic: 100,
    service: 120,
    subService: 120,
    title: 180,
    contentPillar: 120,
    brief: 180,
    status: 100,
    revision: 100,
    approved: 100,
    completionDate: 150,
    mirrorPostDate: 120,
    mirrorContentType: 120,
    mirrorTitle: 180
  };

  return (
    <ContentTable
      {...props}
      visibleColumns={allColumns}
      columnWidths={columnWidths}
    />
  );
};
