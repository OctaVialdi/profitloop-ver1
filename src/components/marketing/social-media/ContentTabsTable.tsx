
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
  // Initially visible columns (from selectColumn to brief)
  const initialVisibleColumns = [
    "selectColumn", "postDate", "contentType", "pic", "service", "subService", "title", "contentPillar", "brief"
  ];

  // Define all columns for the single table
  const allColumns = [
    "selectColumn", "postDate", "contentType", "pic", "service", "subService", "title", 
    "contentPillar", "brief", "status", "revision", "approved", "completionDate", 
    "mirrorPostDate", "mirrorContentType", "mirrorTitle"
  ];

  // Define fixed widths for all columns - adjusted to be wider
  const columnWidths = {
    selectColumn: 60,
    postDate: 160,
    contentType: 180,
    pic: 150,
    service: 180,
    subService: 180,
    title: 240,
    contentPillar: 180,
    brief: 240,
    status: 150,
    revision: 120,
    approved: 120,
    completionDate: 180,
    mirrorPostDate: 160,
    mirrorContentType: 180,
    mirrorTitle: 240
  };

  return (
    <ContentTable
      {...props}
      visibleColumns={initialVisibleColumns}
      columnWidths={columnWidths}
    />
  );
};
