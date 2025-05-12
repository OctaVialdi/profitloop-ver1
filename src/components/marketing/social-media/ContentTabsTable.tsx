
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
  // Define visible columns (only up to "status")
  const fixedColumns = ["selectColumn"];
  const initialVisibleColumns = ["postDate", "contentType", "pic", "service", "subService", "title", "contentPillar", "brief", "status"];
  
  // Additional columns that require horizontal scrolling to view
  const scrollableColumns = ["revision", "approved", "completionDate", "mirrorPostDate", "mirrorContentType", "mirrorTitle"];
  
  // All columns combined
  const allColumns = [...fixedColumns, ...initialVisibleColumns, ...scrollableColumns];

  return (
    <ContentTable
      {...props}
      visibleColumns={allColumns}
      fixedColumnsCount={fixedColumns.length}
      initialVisibleColumnsCount={fixedColumns.length + initialVisibleColumns.length}
    />
  );
};
