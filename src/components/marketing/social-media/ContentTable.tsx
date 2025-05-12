
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ExternalLink, Edit, FileText, List, CircleDot, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";
import { format } from "date-fns";

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
  toggleApproved: (itemId: string, isApproved: boolean) => void;
  visibleColumns?: string[];
  fixedColumnsCount?: number;
  initialVisibleColumnsCount?: number;
  columnWidths?: {[key: string]: number};
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
  resetRevisionCounter,
  toggleApproved,
  visibleColumns = [],
  fixedColumnsCount = 1,
  initialVisibleColumnsCount = 10,
  columnWidths = {},
}) => {
  // Format completion date for display
  const formatCompletionDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy - HH:mm');
  };

  // Helper function to check if a column should be displayed
  const isColumnVisible = (columnName: string) => {
    return visibleColumns.length === 0 || visibleColumns.includes(columnName);
  };

  // Helper function to check if a column should be fixed
  const isColumnFixed = (columnIndex: number) => {
    return columnIndex < fixedColumnsCount;
  };

  // Helper function to check if a column is part of initially visible columns
  const isInitiallyVisible = (columnIndex: number) => {
    return columnIndex < initialVisibleColumnsCount;
  };

  // Get column width from columnWidths object or return default
  const getColumnWidth = (columnName: string) => {
    return columnWidths[columnName] || 150;
  };

  // Get visible column names
  const getVisibleColumnNames = () => {
    if (visibleColumns.length === 0) {
      return [
        "selectColumn", "postDate", "contentType", "pic", "service", "subService", "title", 
        "contentPillar", "brief", "status", "revision", "approved", "completionDate", 
        "mirrorPostDate", "mirrorContentType", "mirrorTitle"
      ];
    }
    return visibleColumns;
  };

  const columnNames = getVisibleColumnNames();

  // Calculate the total table width based on column widths
  const totalTableWidth = columnNames.reduce((total, columnName) => {
    return total + getColumnWidth(columnName);
  }, 0);

  return (
    <div className="w-full relative">
      <div className="border border-slate-200 rounded-md overflow-hidden">
        {/* Horizontal scrolling container with fixed width */}
        <div className="overflow-x-auto" style={{ 
          maxWidth: '100%', 
          position: 'relative', 
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}>
          <div style={{ width: `${totalTableWidth}px`, minWidth: '100%' }}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-20">
                <TableRow className="bg-slate-50">
                  {columnNames.map((columnName, index) => {
                    let content = null;
                    const isFixed = isColumnFixed(index);
                    const columnWidth = getColumnWidth(columnName);
                    
                    const cellClassName = `text-center font-medium whitespace-nowrap ${
                      isFixed ? "sticky left-0 bg-slate-50 shadow-[1px_0_0_0_#e5e7eb] z-30" : ""
                    }`;

                    switch (columnName) {
                      case "selectColumn":
                        content = (
                          <Checkbox 
                            checked={selectAll} 
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                            className="mt-1"
                          />
                        );
                        break;
                      case "postDate":
                        content = "Tanggal Posting";
                        break;
                      case "contentType":
                        content = "Tipe Content";
                        break;
                      case "pic":
                        content = "PIC";
                        break;
                      case "service":
                        content = "Layanan";
                        break;
                      case "subService":
                        content = "Sub Layanan";
                        break;
                      case "title":
                        content = "Judul Content";
                        break;
                      case "contentPillar":
                        content = "Content Pillar";
                        break;
                      case "brief":
                        content = "Brief";
                        break;
                      case "status":
                        content = "Status";
                        break;
                      case "revision":
                        content = "Revision";
                        break;
                      case "approved":
                        content = "Approved";
                        break;
                      case "completionDate":
                        content = "Tanggal Selesai";
                        break;
                      case "mirrorPostDate":
                        content = "Tanggal Upload";
                        break;
                      case "mirrorContentType":
                        content = "Tipe Content";
                        break;
                      case "mirrorTitle":
                        content = "Judul Content";
                        break;
                      default:
                        content = columnName;
                    }

                    return (
                      <TableHead 
                        key={columnName} 
                        className={cellClassName}
                        style={{
                          position: isFixed ? 'sticky' : 'static',
                          left: isFixed ? 0 : 'auto',
                          width: `${columnWidth}px`,
                          minWidth: `${columnWidth}px`,
                          maxWidth: `${columnWidth}px`,
                          backgroundColor: isFixed ? '#f8fafc' : '#f1f5f9',
                          boxSizing: 'border-box'
                        }}
                      >
                        {content}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.length > 0 ? (
                  contentItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60 relative">
                      {columnNames.map((columnName, index) => {
                        const isFixed = isColumnFixed(index);
                        const columnWidth = getColumnWidth(columnName);
                        const cellClassName = `p-2 whitespace-nowrap ${
                          isFixed ? "sticky left-0 bg-white shadow-[1px_0_0_0_#e5e7eb] z-10" : ""
                        }`;

                        return (
                          <TableCell 
                            key={`${item.id}-${columnName}`} 
                            className={cellClassName}
                            style={{
                              position: isFixed ? 'sticky' : 'static',
                              left: isFixed ? 0 : 'auto',
                              width: `${columnWidth}px`,
                              minWidth: `${columnWidth}px`,
                              maxWidth: `${columnWidth}px`,
                              backgroundColor: isFixed ? 'white' : 'white',
                              boxSizing: 'border-box',
                              overflow: 'hidden'
                            }}
                          >
                            {columnName === "selectColumn" && (
                              <Checkbox 
                                checked={item.isSelected} 
                                onCheckedChange={() => toggleSelectItem(item.id)}
                                aria-label="Select row"
                              />
                            )}
                            {columnName === "postDate" && (
                              <Popover 
                                open={isCalendarOpen[item.id]} 
                                onOpenChange={() => toggleCalendar(item.id)}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal truncate"
                                    style={{ maxWidth: `${columnWidth - 10}px` }}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{item.postDate || 'Select date'}</span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={item.postDate ? new Date(item.postDate) : undefined}
                                    onSelect={(date) => handleDateChange(item.id, date)}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                            {columnName === "contentType" && (
                              <Select 
                                value={item.contentType} 
                                onValueChange={(value) => handleTypeChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <SelectValue placeholder="Select content type" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {contentTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {columnName === "pic" && (
                              <Select 
                                value={item.pic} 
                                onValueChange={(value) => handlePICChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <SelectValue placeholder="Select PIC" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {contentPlanners.length > 0 ? (
                                    contentPlanners.map((planner) => (
                                      <SelectItem key={planner.id} value={planner.name}>
                                        {planner.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="no-pic-found" disabled>
                                      No content planners found
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                            {columnName === "service" && (
                              <Select 
                                value={item.service} 
                                onValueChange={(value) => handleServiceChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <SelectValue placeholder="Select service" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                      {service.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {columnName === "subService" && (
                              <Select 
                                value={item.subService} 
                                onValueChange={(value) => handleSubServiceChange(item.id, value)}
                                disabled={!item.service}
                              >
                                <SelectTrigger className="w-full bg-white" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <SelectValue placeholder="Select sub-service" className="truncate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.service ? (
                                    getFilteredSubServicesByServiceId(item.service).map((subService) => (
                                      <SelectItem key={subService.id} value={subService.id}>
                                        {subService.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="select-service-first" disabled>
                                      Select a service first
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                            {columnName === "title" && (
                              <div className="flex items-center" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                <FileText className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                                <Input
                                  value={item.title || ""}
                                  onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                  placeholder="Enter title"
                                  className="w-full bg-white"
                                  maxLength={25}
                                  style={{ maxWidth: `${columnWidth - 30}px` }}
                                />
                              </div>
                            )}
                            {columnName === "contentPillar" && (
                              <Select 
                                value={item.contentPillar} 
                                onValueChange={(value) => handleContentPillarChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <div className="flex items-center truncate">
                                    <List className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <SelectValue placeholder="Select pillar" className="truncate" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {contentPillars.map((pillar) => (
                                    <SelectItem key={pillar.id} value={pillar.id}>
                                      {pillar.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {columnName === "brief" && (
                              item.brief ? (
                                <div className="flex items-center space-x-2" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    className="text-left truncate bg-white"
                                    onClick={() => openBriefDialog(item.id, item.brief!, "view")}
                                    style={{ maxWidth: `${columnWidth - 40}px` }}
                                  >
                                    <span className="truncate">{displayBrief(item.brief)}</span>
                                    {extractGoogleDocsLink(item.brief) && (
                                      <ExternalLink className="ml-2 h-3 w-3 flex-shrink-0" />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 flex-shrink-0" 
                                    onClick={() => openBriefDialog(item.id, item.brief!, "edit")}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  className="w-full justify-center truncate"
                                  onClick={() => openBriefDialog(item.id, "", "edit")}
                                  style={{ maxWidth: `${columnWidth - 10}px` }}
                                >
                                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">Click to add brief</span>
                                </Button>
                              )
                            )}
                            {columnName === "status" && (
                              <Select 
                                value={item.status || "none"} 
                                onValueChange={(value) => handleStatusChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  <div className="flex items-center truncate">
                                    <CircleDot className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <SelectValue placeholder="-" className="truncate" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">-</SelectItem>
                                  <SelectItem value="review">Butuh Di Review</SelectItem>
                                  <SelectItem value="revisi">Request Revisi</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {columnName === "revision" && (
                              <div className="flex items-center justify-between" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                <div className="bg-slate-100 px-3 py-1 rounded-md text-center min-w-[30px]">
                                  {item.revisionCount || 0}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 flex-shrink-0"
                                  onClick={() => resetRevisionCounter(item.id)}
                                  title="Reset revision counter"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                            {columnName === "approved" && (
                              <div className="flex justify-center" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                <Checkbox 
                                  checked={item.isApproved} 
                                  onCheckedChange={(checked) => toggleApproved(item.id, checked as boolean)}
                                  aria-label="Approve content"
                                />
                              </div>
                            )}
                            {columnName === "completionDate" && (
                              item.status === "review" && item.completionDate ? (
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs truncate" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                  {formatCompletionDate(item.completionDate)}
                                </div>
                              ) : null
                            )}
                            {columnName === "mirrorPostDate" && (
                              <div className="text-center text-sm text-slate-600 truncate" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                {item.postDate || "-"}
                              </div>
                            )}
                            {columnName === "mirrorContentType" && (
                              <div className="text-center text-sm text-slate-600 truncate" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                              </div>
                            )}
                            {columnName === "mirrorTitle" && (
                              <div className="text-center text-sm text-slate-600 truncate" style={{ maxWidth: `${columnWidth - 10}px` }}>
                                {item.title || "-"}
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columnNames.length} className="h-24 text-center">
                      No content items. Click "Add Row" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Visual indicator that more content is available horizontally */}
      <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />
    </div>
  );
};
