
import React from "react";
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
import { CalendarIcon, ExternalLink, Edit, FileText, List, CircleDot, RefreshCw, ChevronRight } from "lucide-react";
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
  columnWidths = {}
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

  // Get column width or default
  const getColumnWidth = (columnName: string) => {
    return columnWidths[columnName] || 150; // Default width if not specified
  };

  // Calculate total table width based on visible columns
  const calculateTableWidth = () => {
    let total = 0;
    visibleColumns.forEach(column => {
      total += getColumnWidth(column);
    });
    return total;
  };

  // Calculate visible width to know if scroll indicator is needed
  const visibleTableWidth = calculateTableWidth();
  
  // Add scroll indicator if needed
  const showScrollIndicator = visibleColumns.length > 0 && Object.keys(columnWidths).length > visibleColumns.length;

  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        {showScrollIndicator && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-l-md z-30 shadow-md">
            <ChevronRight className="h-5 w-5 text-muted-foreground animate-pulse" />
          </div>
        )}
        
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="overflow-x-auto" style={{ minWidth: "100%" }}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-20">
                <TableRow className="bg-slate-50">
                  {isColumnVisible("selectColumn") && (
                    <TableHead 
                      className="text-center sticky left-0 bg-slate-50 z-30 border-r" 
                      style={{ width: `${getColumnWidth("selectColumn")}px`, minWidth: `${getColumnWidth("selectColumn")}px` }}
                    >
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className="mt-1"
                      />
                    </TableHead>
                  )}
                  {isColumnVisible("postDate") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("postDate")}px`, minWidth: `${getColumnWidth("postDate")}px` }}
                    >
                      Tanggal Posting
                    </TableHead>
                  )}
                  {isColumnVisible("contentType") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("contentType")}px`, minWidth: `${getColumnWidth("contentType")}px` }}
                    >
                      Tipe Content
                    </TableHead>
                  )}
                  {isColumnVisible("pic") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("pic")}px`, minWidth: `${getColumnWidth("pic")}px` }}
                    >
                      PIC
                    </TableHead>
                  )}
                  {isColumnVisible("service") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("service")}px`, minWidth: `${getColumnWidth("service")}px` }}
                    >
                      Layanan
                    </TableHead>
                  )}
                  {isColumnVisible("subService") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("subService")}px`, minWidth: `${getColumnWidth("subService")}px` }}
                    >
                      Sub Layanan
                    </TableHead>
                  )}
                  {isColumnVisible("title") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("title")}px`, minWidth: `${getColumnWidth("title")}px` }}
                    >
                      Judul Content
                    </TableHead>
                  )}
                  {isColumnVisible("contentPillar") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("contentPillar")}px`, minWidth: `${getColumnWidth("contentPillar")}px` }}
                    >
                      Content Pillar
                    </TableHead>
                  )}
                  {isColumnVisible("brief") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("brief")}px`, minWidth: `${getColumnWidth("brief")}px` }}
                    >
                      Brief
                    </TableHead>
                  )}
                  {isColumnVisible("status") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("status")}px`, minWidth: `${getColumnWidth("status")}px` }}
                    >
                      Status
                    </TableHead>
                  )}
                  {isColumnVisible("revision") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("revision")}px`, minWidth: `${getColumnWidth("revision")}px` }}
                    >
                      Revision
                    </TableHead>
                  )}
                  {isColumnVisible("approved") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("approved")}px`, minWidth: `${getColumnWidth("approved")}px` }}
                    >
                      Approved
                    </TableHead>
                  )}
                  {isColumnVisible("completionDate") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("completionDate")}px`, minWidth: `${getColumnWidth("completionDate")}px` }}
                    >
                      Tanggal Selesai
                    </TableHead>
                  )}
                  {isColumnVisible("mirrorPostDate") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("mirrorPostDate")}px`, minWidth: `${getColumnWidth("mirrorPostDate")}px` }}
                    >
                      Tanggal Upload
                    </TableHead>
                  )}
                  {isColumnVisible("mirrorContentType") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("mirrorContentType")}px`, minWidth: `${getColumnWidth("mirrorContentType")}px` }}
                    >
                      Tipe Content
                    </TableHead>
                  )}
                  {isColumnVisible("mirrorTitle") && (
                    <TableHead 
                      className="text-center font-medium whitespace-nowrap"
                      style={{ width: `${getColumnWidth("mirrorTitle")}px`, minWidth: `${getColumnWidth("mirrorTitle")}px` }}
                    >
                      Judul Content
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.length > 0 ? (
                  contentItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60">
                      {isColumnVisible("selectColumn") && (
                        <TableCell 
                          className="text-center sticky left-0 bg-white z-10 border-r"
                          style={{ width: `${getColumnWidth("selectColumn")}px`, minWidth: `${getColumnWidth("selectColumn")}px` }}
                        >
                          <Checkbox 
                            checked={item.isSelected} 
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}
                      {isColumnVisible("postDate") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("postDate")}px`, minWidth: `${getColumnWidth("postDate")}px` }}
                        >
                          <Popover 
                            open={isCalendarOpen[item.id]} 
                            onOpenChange={() => toggleCalendar(item.id)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                style={{ maxWidth: `${getColumnWidth("postDate") - 16}px` }}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
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
                        </TableCell>
                      )}
                      {isColumnVisible("contentType") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("contentType")}px`, minWidth: `${getColumnWidth("contentType")}px` }}
                        >
                          <Select 
                            value={item.contentType} 
                            onValueChange={(value) => handleTypeChange(item.id, value)}
                          >
                            <SelectTrigger 
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("contentType") - 16}px` }}
                            >
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
                        </TableCell>
                      )}
                      {isColumnVisible("pic") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("pic")}px`, minWidth: `${getColumnWidth("pic")}px` }}
                        >
                          <Select 
                            value={item.pic} 
                            onValueChange={(value) => handlePICChange(item.id, value)}
                          >
                            <SelectTrigger 
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("pic") - 16}px` }}
                            >
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
                        </TableCell>
                      )}
                      {isColumnVisible("service") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("service")}px`, minWidth: `${getColumnWidth("service")}px` }}
                        >
                          <Select 
                            value={item.service} 
                            onValueChange={(value) => handleServiceChange(item.id, value)}
                          >
                            <SelectTrigger 
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("service") - 16}px` }}
                            >
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
                        </TableCell>
                      )}
                      {isColumnVisible("subService") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("subService")}px`, minWidth: `${getColumnWidth("subService")}px` }}
                        >
                          <Select 
                            value={item.subService} 
                            onValueChange={(value) => handleSubServiceChange(item.id, value)}
                            disabled={!item.service}
                          >
                            <SelectTrigger 
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("subService") - 16}px` }}
                            >
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
                        </TableCell>
                      )}
                      {isColumnVisible("title") && (
                        <TableCell 
                          className="p-2"
                          style={{ width: `${getColumnWidth("title")}px`, minWidth: `${getColumnWidth("title")}px` }}
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                            <Input
                              value={item.title || ""}
                              onChange={(e) => handleTitleChange(item.id, e.target.value)}
                              placeholder="Enter title"
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("title") - 36}px` }}
                              maxLength={35}
                            />
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible("contentPillar") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("contentPillar")}px`, minWidth: `${getColumnWidth("contentPillar")}px` }}
                        >
                          <Select 
                            value={item.contentPillar} 
                            onValueChange={(value) => handleContentPillarChange(item.id, value)}
                          >
                            <SelectTrigger 
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("contentPillar") - 16}px` }}
                            >
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
                        </TableCell>
                      )}
                      {isColumnVisible("brief") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("brief")}px`, minWidth: `${getColumnWidth("brief")}px` }}
                        >
                          {item.brief ? (
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-left truncate bg-white"
                                style={{ maxWidth: `${getColumnWidth("brief") - 50}px` }}
                                onClick={() => openBriefDialog(item.id, item.brief!, "view")}
                              >
                                <span className="truncate">{displayBrief(item.brief)}</span>
                                {extractGoogleDocsLink(item.brief) && (
                                  <ExternalLink className="ml-2 h-3 w-3 inline flex-shrink-0" />
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
                              className="w-full justify-center"
                              style={{ maxWidth: `${getColumnWidth("brief") - 16}px` }}
                              onClick={() => openBriefDialog(item.id, "", "edit")}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="truncate">Click to add brief</span>
                            </Button>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("status") && (
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("status")}px`, minWidth: `${getColumnWidth("status")}px` }}
                        >
                          <Select 
                            value={item.status || "none"} 
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger 
                              className="w-full bg-white"
                              style={{ maxWidth: `${getColumnWidth("status") - 16}px` }}
                            >
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
                        <TableCell 
                          className="p-2 whitespace-nowrap"
                          style={{ width: `${getColumnWidth("revision")}px`, minWidth: `${getColumnWidth("revision")}px` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="bg-slate-100 px-3 py-1 rounded-md text-center min-w-[40px]">
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
                        <TableCell 
                          className="p-2 text-center whitespace-nowrap"
                          style={{ width: `${getColumnWidth("approved")}px`, minWidth: `${getColumnWidth("approved")}px` }}
                        >
                          <Checkbox 
                            checked={item.isApproved} 
                            onCheckedChange={(checked) => toggleApproved(item.id, checked as boolean)}
                            aria-label="Approve content"
                          />
                        </TableCell>
                      )}
                      {isColumnVisible("completionDate") && (
                        <TableCell 
                          className="p-2 text-center whitespace-nowrap"
                          style={{ width: `${getColumnWidth("completionDate")}px`, minWidth: `${getColumnWidth("completionDate")}px` }}
                        >
                          {item.status === "review" && item.completionDate && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md truncate">
                              {formatCompletionDate(item.completionDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("mirrorPostDate") && (
                        <TableCell 
                          className="p-2 text-center whitespace-nowrap truncate"
                          style={{ width: `${getColumnWidth("mirrorPostDate")}px`, minWidth: `${getColumnWidth("mirrorPostDate")}px` }}
                        >
                          {item.postDate || "-"}
                        </TableCell>
                      )}
                      {isColumnVisible("mirrorContentType") && (
                        <TableCell 
                          className="p-2 text-center whitespace-nowrap truncate"
                          style={{ width: `${getColumnWidth("mirrorContentType")}px`, minWidth: `${getColumnWidth("mirrorContentType")}px` }}
                        >
                          {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                        </TableCell>
                      )}
                      {isColumnVisible("mirrorTitle") && (
                        <TableCell 
                          className="p-2 text-center whitespace-nowrap truncate"
                          style={{ width: `${getColumnWidth("mirrorTitle")}px`, minWidth: `${getColumnWidth("mirrorTitle")}px` }}
                        >
                          {item.title || "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={16} className="h-24 text-center">
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
