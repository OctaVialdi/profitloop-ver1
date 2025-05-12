import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { 
  CalendarIcon, ExternalLink, Edit, FileText, List, 
  CircleDot, RefreshCw, Download, Link, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";
import { format, differenceInDays } from "date-fns";

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
  updateContentItem: (itemId: string, updates: Partial<ContentItem>) => void;
  visibleColumns?: string[];
}

// Column group definitions for styling
interface ColumnGroup {
  id: string;
  title: string;
  bgColor: string;
  columns: string[];
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
  updateContentItem,
  visibleColumns = [],
}) => {
  // Define column groups for styling and navigation
  const columnGroups: ColumnGroup[] = [
    { 
      id: "primary", 
      title: "Primary Info", 
      bgColor: "bg-white", 
      columns: ["postDate", "contentType", "pic", "service", "subService", "title"] 
    },
    { 
      id: "details", 
      title: "Content Details", 
      bgColor: "bg-slate-50", 
      columns: ["contentPillar", "brief", "status", "revision", "approved", "completionDate"] 
    },
    { 
      id: "publishing", 
      title: "Publishing Info", 
      bgColor: "bg-blue-50/50", 
      columns: ["mirrorPostDate", "mirrorContentType", "mirrorTitle"] 
    },
    { 
      id: "production", 
      title: "Production", 
      bgColor: "bg-green-50/50", 
      columns: ["picProduction", "googleDriveLink", "productionStatus", "productionRevision", 
                "productionCompletionDate", "productionApproved", "productionApprovedDate"] 
    },
    { 
      id: "posting", 
      title: "Posting", 
      bgColor: "bg-amber-50/50", 
      columns: ["downloadLink", "postLink", "isDone", "actualPostDate", "onTimeStatus", "contentStatus"] 
    }
  ];

  // Scrolling related state
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  // Format date for display
  const formatDateWithTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy - HH:mm');
  };

  const formatDateOnly = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  // Calculate on-time status
  const getOnTimeStatus = (postDate: string | undefined, actualDate: string | undefined) => {
    if (!postDate || !actualDate) return '';
    
    const plannedDate = new Date(postDate);
    const actualPostDate = new Date(actualDate);
    
    if (actualPostDate <= plannedDate) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
          On Time
        </span>
      );
    } else {
      const daysLate = differenceInDays(actualPostDate, plannedDate);
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
          Late [{daysLate}] Day{daysLate !== 1 ? 's' : ''}
        </span>
      );
    }
  };

  // Helper function to check if a column should be displayed
  const isColumnVisible = (columnName: string) => {
    // If visibleColumns is empty, show all columns
    return visibleColumns.length === 0 || visibleColumns.includes(columnName);
  };

  // Handle scroll navigation
  const scrollToGroup = (groupId: string) => {
    if (!scrollContainer) return;
    
    // Find the first column element of the group
    const groupColumns = columnGroups.find(g => g.id === groupId)?.columns || [];
    if (groupColumns.length === 0) return;
    
    const columnEl = document.querySelector(`[data-column="${groupColumns[0]}"]`) as HTMLElement;
    if (columnEl) {
      // Account for the fixed selection column width (50px)
      const targetScrollLeft = columnEl.offsetLeft - 50;
      scrollContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }
  };

  // Helper function to scroll horizontally
  const scrollHorizontal = (direction: 'left' | 'right') => {
    if (!scrollContainer) return;
    const scrollAmount = 300; // Adjust scroll amount as needed
    const newScrollLeft = direction === 'left' 
      ? Math.max(0, scrollContainer.scrollLeft - scrollAmount)
      : scrollContainer.scrollLeft + scrollAmount;
    
    scrollContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  // Get background color for a column based on its group
  const getColumnBgColor = (columnName: string): string => {
    for (const group of columnGroups) {
      if (group.columns.includes(columnName)) {
        return group.bgColor;
      }
    }
    return "bg-white";
  };

  return (
    <div className="w-full">
      {/* Group navigation buttons */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-1">
          {columnGroups.map(group => (
            <Button 
              key={group.id}
              size="sm"
              variant="outline"
              onClick={() => scrollToGroup(group.id)}
              className="text-xs px-2 py-1 h-8"
            >
              {group.title}
            </Button>
          ))}
        </div>
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => scrollHorizontal('left')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => scrollHorizontal('right')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full border rounded-md relative" style={{ height: "calc(100vh - 220px)" }}>
        {/* Left shadow indicator */}
        <div className="absolute left-[50px] top-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent z-20 pointer-events-none" />
        
        {/* Right shadow indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent z-20 pointer-events-none" />
        
        {/* Main ScrollArea with fixed height */}
        <ScrollArea className="h-full">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-max">
              <TableHeader className="sticky top-0 bg-white z-20">
                {/* Column groups row */}
                <TableRow className="bg-slate-100 z-10">
                  {/* Empty cell for the checkbox column */}
                  <TableHead className="w-[50px] text-center sticky left-0 bg-slate-100 z-30 border-r">
                    &nbsp;
                  </TableHead>
                  
                  {/* Group headers */}
                  {columnGroups.map((group) => (
                    <TableHead 
                      key={group.id}
                      className={`text-center font-medium ${group.bgColor}`}
                      colSpan={group.columns.filter(isColumnVisible).length}
                    >
                      {group.title}
                    </TableHead>
                  ))}
                </TableRow>
                
                <TableRow className="bg-slate-50">
                  {/* Checkbox column header */}
                  <TableHead className="w-[50px] text-center sticky left-0 bg-slate-50 z-30 border-r">
                    <Checkbox 
                      checked={selectAll} 
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className="mt-1"
                    />
                  </TableHead>
                  
                  {/* Primary Group */}
                  {isColumnVisible("postDate") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-white" 
                      data-column="postDate"
                    >
                      Tanggal Posting
                    </TableHead>
                  )}
                  
                  {isColumnVisible("contentType") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-white"
                      data-column="contentType"
                    >
                      Tipe Content
                    </TableHead>
                  )}
                  
                  {isColumnVisible("pic") && (
                    <TableHead 
                      className="w-[100px] text-center font-medium whitespace-nowrap bg-white"
                      data-column="pic"
                    >
                      PIC
                    </TableHead>
                  )}
                  
                  {isColumnVisible("service") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-white"
                      data-column="service"
                    >
                      Layanan
                    </TableHead>
                  )}
                  
                  {isColumnVisible("subService") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-white"
                      data-column="subService"
                    >
                      Sub Layanan
                    </TableHead>
                  )}
                  
                  {isColumnVisible("title") && (
                    <TableHead 
                      className="w-[180px] text-center font-medium whitespace-nowrap bg-white"
                      data-column="title"
                    >
                      Judul Content
                    </TableHead>
                  )}
                  
                  {/* Details Group */}
                  {isColumnVisible("contentPillar") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-slate-50"
                      data-column="contentPillar"
                    >
                      Content Pillar
                    </TableHead>
                  )}
                  
                  {isColumnVisible("brief") && (
                    <TableHead 
                      className="w-[180px] text-center font-medium whitespace-nowrap bg-slate-50"
                      data-column="brief"
                    >
                      Brief
                    </TableHead>
                  )}
                  
                  {isColumnVisible("status") && (
                    <TableHead 
                      className="w-[100px] text-center font-medium whitespace-nowrap bg-slate-50"
                      data-column="status"
                    >
                      Status
                    </TableHead>
                  )}
                  
                  {isColumnVisible("revision") && (
                    <TableHead 
                      className="w-[100px] text-center font-medium whitespace-nowrap bg-slate-50"
                      data-column="revision"
                    >
                      Revision
                    </TableHead>
                  )}
                  
                  {isColumnVisible("approved") && (
                    <TableHead 
                      className="w-[100px] text-center font-medium whitespace-nowrap bg-slate-50"
                      data-column="approved"
                    >
                      Approved
                    </TableHead>
                  )}
                  
                  {isColumnVisible("completionDate") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-slate-50"
                      data-column="completionDate"
                    >
                      Tanggal Selesai
                    </TableHead>
                  )}
                  
                  {/* Publishing Group */}
                  {isColumnVisible("mirrorPostDate") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-blue-50/50"
                      data-column="mirrorPostDate"
                    >
                      Tanggal Upload
                    </TableHead>
                  )}
                  
                  {isColumnVisible("mirrorContentType") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-blue-50/50"
                      data-column="mirrorContentType"
                    >
                      Tipe Content
                    </TableHead>
                  )}
                  
                  {isColumnVisible("mirrorTitle") && (
                    <TableHead 
                      className="w-[180px] text-center font-medium whitespace-nowrap bg-blue-50/50"
                      data-column="mirrorTitle"
                    >
                      Judul Content
                    </TableHead>
                  )}
                  
                  {/* Production Group */}
                  {isColumnVisible("picProduction") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="picProduction"
                    >
                      PIC Produksi
                    </TableHead>
                  )}
                  
                  {isColumnVisible("googleDriveLink") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="googleDriveLink"
                    >
                      Link Google Drive
                    </TableHead>
                  )}
                  
                  {isColumnVisible("productionStatus") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="productionStatus"
                    >
                      Status Produksi
                    </TableHead>
                  )}
                  
                  {isColumnVisible("productionRevision") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="productionRevision"
                    >
                      Revisi Counter
                    </TableHead>
                  )}
                  
                  {isColumnVisible("productionCompletionDate") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="productionCompletionDate"
                    >
                      Tanggal Selesai Produksi
                    </TableHead>
                  )}
                  
                  {isColumnVisible("productionApproved") && (
                    <TableHead 
                      className="w-[100px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="productionApproved"
                    >
                      Approved
                    </TableHead>
                  )}
                  
                  {isColumnVisible("productionApprovedDate") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-green-50/50"
                      data-column="productionApprovedDate"
                    >
                      Tanggal Approved
                    </TableHead>
                  )}
                  
                  {/* Posting Group */}
                  {isColumnVisible("downloadLink") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-amber-50/50"
                      data-column="downloadLink"
                    >
                      Download Link File
                    </TableHead>
                  )}
                  
                  {isColumnVisible("postLink") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-amber-50/50"
                      data-column="postLink"
                    >
                      Link Post
                    </TableHead>
                  )}
                  
                  {isColumnVisible("isDone") && (
                    <TableHead 
                      className="w-[80px] text-center font-medium whitespace-nowrap bg-amber-50/50"
                      data-column="isDone"
                    >
                      Done
                    </TableHead>
                  )}
                  
                  {isColumnVisible("actualPostDate") && (
                    <TableHead 
                      className="w-[150px] text-center font-medium whitespace-nowrap bg-amber-50/50"
                      data-column="actualPostDate"
                    >
                      Actual Post
                    </TableHead>
                  )}
                  
                  {isColumnVisible("onTimeStatus") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-amber-50/50"
                      data-column="onTimeStatus"
                    >
                      On Time Status
                    </TableHead>
                  )}
                  
                  {isColumnVisible("contentStatus") && (
                    <TableHead 
                      className="w-[120px] text-center font-medium whitespace-nowrap bg-amber-50/50"
                      data-column="contentStatus"
                    >
                      Status Content
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.length > 0 ? (
                  contentItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60">
                      {/* Checkbox column - sticky */}
                      <TableCell className="text-center sticky left-0 bg-white z-10 border-r">
                        <Checkbox 
                          checked={item.isSelected} 
                          onCheckedChange={() => toggleSelectItem(item.id)}
                          aria-label="Select row"
                        />
                      </TableCell>
                      
                      {/* Primary Group */}
                      {isColumnVisible("postDate") && (
                        <TableCell className="p-2 whitespace-nowrap bg-white">
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
                                {item.postDate ? formatDateOnly(item.postDate) : 'Select date'}
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
                        </TableCell>
                      )}
                      
                      {isColumnVisible("contentType") && (
                        <TableCell className="p-2 whitespace-nowrap bg-white">
                          <Select 
                            value={item.contentType} 
                            onValueChange={(value) => handleTypeChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {contentTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("pic") && (
                        <TableCell className="p-2 whitespace-nowrap bg-white">
                          <Select 
                            value={item.pic} 
                            onValueChange={(value) => handlePICChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select PIC" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
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
                        </TableCell>
                      )}
                      
                      {isColumnVisible("service") && (
                        <TableCell className="p-2 whitespace-nowrap bg-white">
                          <Select 
                            value={item.service} 
                            onValueChange={(value) => handleServiceChange(item.id, value)}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("subService") && (
                        <TableCell className="p-2 whitespace-nowrap bg-white">
                          <Select 
                            value={item.subService} 
                            onValueChange={(value) => handleSubServiceChange(item.id, value)}
                            disabled={!item.service}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select sub-service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
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
                        </TableCell>
                      )}
                      
                      {isColumnVisible("title") && (
                        <TableCell className="p-2 bg-white">
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
                        </TableCell>
                      )}
                      
                      {/* Details Group */}
                      {isColumnVisible("contentPillar") && (
                        <TableCell className="p-2 whitespace-nowrap bg-slate-50">
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
                              <SelectItem value="none">-</SelectItem>
                              {contentPillars.map((pillar) => (
                                <SelectItem key={pillar.id} value={pillar.id}>
                                  {pillar.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("brief") && (
                        <TableCell className="p-2 whitespace-nowrap bg-slate-50">
                          {item.brief ? (
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-left truncate w-full bg-white"
                                onClick={() => openBriefDialog(item.id, item.brief, "view")}
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
                                onClick={() => openBriefDialog(item.id, item.brief, "edit")}
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
                          )}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("status") && (
                        <TableCell className="p-2 whitespace-nowrap bg-slate-50">
                          <Select 
                            value={item.status} 
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
                        </TableCell>
                      )}
                      
                      {isColumnVisible("revision") && (
                        <TableCell className="p-2 whitespace-nowrap bg-slate-50">
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
                        </TableCell>
                      )}
                      
                      {isColumnVisible("approved") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-slate-50">
                          <Checkbox 
                            checked={item.isApproved} 
                            onCheckedChange={(checked) => toggleApproved(item.id, checked as boolean)}
                            aria-label="Approve content"
                          />
                        </TableCell>
                      )}
                      
                      {isColumnVisible("completionDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-slate-50">
                          {item.status === "review" && item.completionDate && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.completionDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Publishing Group */}
                      {isColumnVisible("mirrorPostDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-blue-50/50">
                          {formatDateOnly(item.postDate)}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("mirrorContentType") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-blue-50/50">
                          {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("mirrorTitle") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-blue-50/50">
                          {item.title || "-"}
                        </TableCell>
                      )}
                      
                      {/* Production Group */}
                      {isColumnVisible("picProduction") && (
                        <TableCell className="p-2 whitespace-nowrap bg-green-50/50">
                          <Select 
                            value={item.picProduction} 
                            onValueChange={(value) => updateContentItem(item.id, { picProduction: value })}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select Production PIC" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              {/* This would need to be populated with actual production staff */}
                              <SelectItem value="production-1">Production Staff 1</SelectItem>
                              <SelectItem value="production-2">Production Staff 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("googleDriveLink") && (
                        <TableCell className="p-2 bg-green-50/50">
                          <div className="flex items-center">
                            <Link className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                            <Input
                              value={item.googleDriveLink || ""}
                              onChange={(e) => updateContentItem(item.id, { googleDriveLink: e.target.value })}
                              placeholder="Enter Google Drive link"
                              className="w-full bg-white"
                            />
                          </div>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("productionStatus") && (
                        <TableCell className="p-2 whitespace-nowrap bg-green-50/50">
                          <Select 
                            value={item.productionStatus || "none"} 
                            onValueChange={(value) => updateContentItem(item.id, { productionStatus: value })}
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
                        </TableCell>
                      )}
                      
                      {isColumnVisible("productionRevision") && (
                        <TableCell className="p-2 whitespace-nowrap bg-green-50/50">
                          <div className="flex items-center justify-between">
                            <div className="bg-slate-100 px-3 py-1 rounded-md text-center min-w-[30px]">
                              {item.productionRevisionCount || 0}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateContentItem(item.id, { productionRevisionCount: 0 })}
                              title="Reset revision counter"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("productionCompletionDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-green-50/50">
                          {item.productionStatus === "review" && item.productionCompletionDate && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.productionCompletionDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("productionApproved") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-green-50/50">
                          <Checkbox 
                            checked={item.productionApproved} 
                            onCheckedChange={(checked) => updateContentItem(item.id, { productionApproved: checked as boolean })}
                            aria-label="Approve production"
                            disabled={!isUserManager}
                          />
                        </TableCell>
                      )}
                      
                      {isColumnVisible("productionApprovedDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-green-50/50">
                          {item.productionApproved && item.productionApprovedDate && (
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.productionApprovedDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Posting Group */}
                      {isColumnVisible("downloadLink") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-amber-50/50">
                          {item.productionApproved && item.googleDriveLink && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white"
                              onClick={() => window.open(item.googleDriveLink, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("postLink") && (
                        <TableCell className="p-2 bg-amber-50/50">
                          <div className="flex items-center">
                            <Link className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                            <Input
                              value={item.postLink || ""}
                              onChange={(e) => updateContentItem(item.id, { postLink: e.target.value })}
                              placeholder="Enter post link"
                              className="w-full bg-white"
                            />
                          </div>
                        </TableCell>
                      )}
                      
                      {isColumnVisible("isDone") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-amber-50/50">
                          <Checkbox 
                            checked={item.isDone} 
                            onCheckedChange={(checked) => updateContentItem(item.id, { isDone: checked as boolean })}
                            aria-label="Mark as done"
                          />
                        </TableCell>
                      )}
                      
                      {isColumnVisible("actualPostDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-amber-50/50">
                          {item.actualPostDate && (
                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.actualPostDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("onTimeStatus") && (
                        <TableCell className="p-2 text-center whitespace-nowrap bg-amber-50/50">
                          {item.postDate && item.actualPostDate && (
                            getOnTimeStatus(item.postDate, item.actualPostDate)
                          )}
                        </TableCell>
                      )}
                      
                      {isColumnVisible("contentStatus") && (
                        <TableCell className="p-2 whitespace-nowrap bg-amber-50/50">
                          <Select 
                            value={item.contentStatus || "none"} 
                            onValueChange={(value) => updateContentItem(item.id, { contentStatus: value })}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-</SelectItem>
                              <SelectItem value="recommended">Recomended For Ads</SelectItem>
                              <SelectItem value="cancel">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={30} className="h-24 text-center">
                      No content items. Click "Add Row" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
