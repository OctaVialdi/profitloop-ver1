
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

  return (
    <div className="w-full relative">
      <div className="overflow-hidden border border-slate-200 rounded-md">
        <div className="overflow-x-auto" style={{ maxWidth: '100%', position: 'relative' }}>
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-20">
                <TableRow className="bg-slate-50">
                  {columnNames.map((columnName, index) => {
                    let content = null;
                    const isFixed = isColumnFixed(index);
                    const isInitVisible = isInitiallyVisible(index);
                    
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
                          backgroundColor: isInitVisible ? (isFixed ? '#f8fafc' : '#fff') : '#f1f5f9'
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
                        const isInitVisible = isInitiallyVisible(index);
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
                              backgroundColor: isInitVisible ? 'white' : '#f8fafc'
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
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {item.postDate || 'Select date'}
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
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Select content type" />
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
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Select PIC" />
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
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Select service" />
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
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Select sub-service" />
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
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                                <Input
                                  value={item.title || ""}
                                  onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                  placeholder="Enter title"
                                  className="w-full bg-white"
                                  maxLength={25}
                                />
                              </div>
                            )}
                            {columnName === "contentPillar" && (
                              <Select 
                                value={item.contentPillar} 
                                onValueChange={(value) => handleContentPillarChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white">
                                  <div className="flex items-center">
                                    <List className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Select pillar" />
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
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    className="text-left truncate w-full bg-white"
                                    onClick={() => openBriefDialog(item.id, item.brief!, "view")}
                                  >
                                    {displayBrief(item.brief)}
                                    {extractGoogleDocsLink(item.brief) && (
                                      <ExternalLink className="ml-2 h-3 w-3 inline" />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8" 
                                    onClick={() => openBriefDialog(item.id, item.brief!, "edit")}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  className="w-full justify-center"
                                  onClick={() => openBriefDialog(item.id, "", "edit")}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Click to add brief
                                </Button>
                              )
                            )}
                            {columnName === "status" && (
                              <Select 
                                value={item.status || "none"} 
                                onValueChange={(value) => handleStatusChange(item.id, value)}
                              >
                                <SelectTrigger className="w-full bg-white">
                                  <div className="flex items-center">
                                    <CircleDot className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="-" />
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
                              <div className="flex items-center justify-between">
                                <div className="bg-slate-100 px-3 py-1 rounded-md text-center min-w-[30px]">
                                  {item.revisionCount || 0}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => resetRevisionCounter(item.id)}
                                  title="Reset revision counter"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                            {columnName === "approved" && (
                              <div className="flex justify-center">
                                <Checkbox 
                                  checked={item.isApproved} 
                                  onCheckedChange={(checked) => toggleApproved(item.id, checked as boolean)}
                                  aria-label="Approve content"
                                />
                              </div>
                            )}
                            {columnName === "completionDate" && (
                              item.status === "review" && item.completionDate ? (
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs">
                                  {formatCompletionDate(item.completionDate)}
                                </div>
                              ) : null
                            )}
                            {columnName === "mirrorPostDate" && (
                              <div className="text-center text-sm text-slate-600">
                                {item.postDate || "-"}
                              </div>
                            )}
                            {columnName === "mirrorContentType" && (
                              <div className="text-center text-sm text-slate-600">
                                {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                              </div>
                            )}
                            {columnName === "mirrorTitle" && (
                              <div className="text-center text-sm text-slate-600">
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
      {columnNames.length > initialVisibleColumnsCount && (
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />
      )}
    </div>
  );
};
