
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
import { CalendarIcon, ExternalLink, Edit, FileText, List, CircleDot, RefreshCw, Download, Link } from "lucide-react";
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
  activeTab?: string;
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
  activeTab = "primary",
}) => {
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
    // Always show the select column across all tabs
    if (columnName === "selectColumn" && !visibleColumns.includes("selectColumn")) {
      return true;
    }
    return visibleColumns.length === 0 || visibleColumns.includes(columnName);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-20">
                <TableRow className="bg-slate-50">
                  {/* Column 1: Action (Checkbox) */}
                  {isColumnVisible("selectColumn") && (
                    <TableHead className="w-[50px] text-center sticky left-0 bg-slate-50 z-30 border-r">
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className="mt-1"
                      />
                    </TableHead>
                  )}
                  
                  {/* Column 2: Tanggal Posting */}
                  {isColumnVisible("postDate") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Tanggal Posting</TableHead>
                  )}
                  
                  {/* Column 3: Tipe Content */}
                  {isColumnVisible("contentType") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Tipe Content</TableHead>
                  )}
                  
                  {/* Column 4: PIC */}
                  {isColumnVisible("pic") && (
                    <TableHead className="w-[100px] text-center font-medium whitespace-nowrap">PIC</TableHead>
                  )}
                  
                  {/* Column 5: Layanan */}
                  {isColumnVisible("service") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Layanan</TableHead>
                  )}
                  
                  {/* Column 6: Sub Layanan */}
                  {isColumnVisible("subService") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Sub Layanan</TableHead>
                  )}
                  
                  {/* Column 7: Judul Content */}
                  {isColumnVisible("title") && (
                    <TableHead className="w-[180px] text-center font-medium whitespace-nowrap">Judul Content</TableHead>
                  )}
                  
                  {/* Column 8: Content Pillar */}
                  {isColumnVisible("contentPillar") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Content Pillar</TableHead>
                  )}
                  
                  {/* Column 9: Brief */}
                  {isColumnVisible("brief") && (
                    <TableHead className="w-[180px] text-center font-medium whitespace-nowrap">Brief</TableHead>
                  )}
                  
                  {/* Column 10: Status */}
                  {isColumnVisible("status") && (
                    <TableHead className="w-[100px] text-center font-medium whitespace-nowrap">Status</TableHead>
                  )}
                  
                  {/* Column 11: Revision */}
                  {isColumnVisible("revision") && (
                    <TableHead className="w-[100px] text-center font-medium whitespace-nowrap">Revision</TableHead>
                  )}
                  
                  {/* Column 12: Approved */}
                  {isColumnVisible("approved") && (
                    <TableHead className="w-[100px] text-center font-medium whitespace-nowrap">Approved</TableHead>
                  )}
                  
                  {/* Column 13: Tanggal Selesai */}
                  {isColumnVisible("completionDate") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Tanggal Selesai</TableHead>
                  )}
                  
                  {/* Column 14: Tanggal Upload (Mirror of Tanggal Posting) */}
                  {isColumnVisible("mirrorPostDate") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Tanggal Upload</TableHead>
                  )}
                  
                  {/* Column 15: Tipe Content (Mirror) */}
                  {isColumnVisible("mirrorContentType") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Tipe Content</TableHead>
                  )}
                  
                  {/* Column 16: Judul Content (Mirror) */}
                  {isColumnVisible("mirrorTitle") && (
                    <TableHead className="w-[180px] text-center font-medium whitespace-nowrap">Judul Content</TableHead>
                  )}
                  
                  {/* Column 17: PIC Produksi */}
                  {isColumnVisible("picProduction") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">PIC Produksi</TableHead>
                  )}
                  
                  {/* Column 18: Link Google Drive */}
                  {isColumnVisible("googleDriveLink") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Link Google Drive</TableHead>
                  )}
                  
                  {/* Column 19: Status Produksi */}
                  {isColumnVisible("productionStatus") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Status Produksi</TableHead>
                  )}
                  
                  {/* Column 20: Revisi Counter (Production) */}
                  {isColumnVisible("productionRevision") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Revisi Counter</TableHead>
                  )}
                  
                  {/* Column 21: Tanggal Selesai Produksi */}
                  {isColumnVisible("productionCompletionDate") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Tanggal Selesai Produksi</TableHead>
                  )}
                  
                  {/* Column 22: Approved (Production) */}
                  {isColumnVisible("productionApproved") && (
                    <TableHead className="w-[100px] text-center font-medium whitespace-nowrap">Approved</TableHead>
                  )}
                  
                  {/* Column 23: Tanggal Approved (Production) */}
                  {isColumnVisible("productionApprovedDate") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Tanggal Approved</TableHead>
                  )}
                  
                  {/* Column 24: Download Link File */}
                  {isColumnVisible("downloadLink") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Download Link File</TableHead>
                  )}
                  
                  {/* Column 25: Link Post */}
                  {isColumnVisible("postLink") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Link Post</TableHead>
                  )}
                  
                  {/* Column 26: Done */}
                  {isColumnVisible("isDone") && (
                    <TableHead className="w-[80px] text-center font-medium whitespace-nowrap">Done</TableHead>
                  )}
                  
                  {/* Column 27: Actual Post */}
                  {isColumnVisible("actualPostDate") && (
                    <TableHead className="w-[150px] text-center font-medium whitespace-nowrap">Actual Post</TableHead>
                  )}
                  
                  {/* Column 28: On Time Status */}
                  {isColumnVisible("onTimeStatus") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">On Time Status</TableHead>
                  )}
                  
                  {/* Column 29: Status Content */}
                  {isColumnVisible("contentStatus") && (
                    <TableHead className="w-[120px] text-center font-medium whitespace-nowrap">Status Content</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.length > 0 ? (
                  contentItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60">
                      {/* Column 1: Action (Checkbox) */}
                      {isColumnVisible("selectColumn") && (
                        <TableCell className="text-center sticky left-0 bg-white z-10 border-r">
                          <Checkbox 
                            checked={item.isSelected} 
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}
                      
                      {/* Column 2: Tanggal Posting */}
                      {isColumnVisible("postDate") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 3: Tipe Content */}
                      {isColumnVisible("contentType") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 4: PIC */}
                      {isColumnVisible("pic") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 5: Layanan */}
                      {isColumnVisible("service") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 6: Sub Layanan */}
                      {isColumnVisible("subService") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 7: Judul Content */}
                      {isColumnVisible("title") && (
                        <TableCell className="p-2">
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
                      
                      {/* Column 8: Content Pillar */}
                      {isColumnVisible("contentPillar") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                              <SelectItem value="">-</SelectItem>
                              {contentPillars.map((pillar) => (
                                <SelectItem key={pillar.id} value={pillar.id}>
                                  {pillar.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      
                      {/* Column 9: Brief */}
                      {isColumnVisible("brief") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 10: Status */}
                      {isColumnVisible("status") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 11: Revision */}
                      {isColumnVisible("revision") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 12: Approved */}
                      {isColumnVisible("approved") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          <Checkbox 
                            checked={item.isApproved} 
                            onCheckedChange={(checked) => toggleApproved(item.id, checked as boolean)}
                            aria-label="Approve content"
                          />
                        </TableCell>
                      )}
                      
                      {/* Column 13: Tanggal Selesai */}
                      {isColumnVisible("completionDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.status === "review" && item.completionDate && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.completionDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Column 14: Tanggal Upload (Mirror of Tanggal Posting) */}
                      {isColumnVisible("mirrorPostDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {formatDateOnly(item.postDate)}
                        </TableCell>
                      )}
                      
                      {/* Column 15: Tipe Content (Mirror) */}
                      {isColumnVisible("mirrorContentType") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                        </TableCell>
                      )}
                      
                      {/* Column 16: Judul Content (Mirror) */}
                      {isColumnVisible("mirrorTitle") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.title || "-"}
                        </TableCell>
                      )}
                      
                      {/* Column 17: PIC Produksi */}
                      {isColumnVisible("picProduction") && (
                        <TableCell className="p-2 whitespace-nowrap">
                          <Select 
                            value={item.picProduction} 
                            onValueChange={(value) => updateContentItem(item.id, { picProduction: value })}
                          >
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select Production PIC" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              {/* This would need to be populated with actual production staff */}
                              <SelectItem value="production-1">Production Staff 1</SelectItem>
                              <SelectItem value="production-2">Production Staff 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      
                      {/* Column 18: Link Google Drive */}
                      {isColumnVisible("googleDriveLink") && (
                        <TableCell className="p-2">
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
                      
                      {/* Column 19: Status Produksi */}
                      {isColumnVisible("productionStatus") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 20: Revisi Counter (Production) */}
                      {isColumnVisible("productionRevision") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                      
                      {/* Column 21: Tanggal Selesai Produksi */}
                      {isColumnVisible("productionCompletionDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.productionStatus === "review" && item.productionCompletionDate && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.productionCompletionDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Column 22: Approved (Production) */}
                      {isColumnVisible("productionApproved") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          <Checkbox 
                            checked={item.productionApproved} 
                            onCheckedChange={(checked) => updateContentItem(item.id, { productionApproved: checked as boolean })}
                            aria-label="Approve production"
                            disabled={!isUserManager}
                          />
                        </TableCell>
                      )}
                      
                      {/* Column 23: Tanggal Approved (Production) */}
                      {isColumnVisible("productionApprovedDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.productionApproved && item.productionApprovedDate && (
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.productionApprovedDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Column 24: Download Link File */}
                      {isColumnVisible("downloadLink") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
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
                      
                      {/* Column 25: Link Post */}
                      {isColumnVisible("postLink") && (
                        <TableCell className="p-2">
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
                      
                      {/* Column 26: Done */}
                      {isColumnVisible("isDone") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          <Checkbox 
                            checked={item.isDone} 
                            onCheckedChange={(checked) => updateContentItem(item.id, { isDone: checked as boolean })}
                            aria-label="Mark as done"
                          />
                        </TableCell>
                      )}
                      
                      {/* Column 27: Actual Post */}
                      {isColumnVisible("actualPostDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.actualPostDate && (
                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md">
                              {formatDateWithTime(item.actualPostDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      
                      {/* Column 28: On Time Status */}
                      {isColumnVisible("onTimeStatus") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.postDate && item.actualPostDate && (
                            getOnTimeStatus(item.postDate, item.actualPostDate)
                          )}
                        </TableCell>
                      )}
                      
                      {/* Column 29: Status Content */}
                      {isColumnVisible("contentStatus") && (
                        <TableCell className="p-2 whitespace-nowrap">
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
                    <TableCell colSpan={Object.keys(visibleColumns || []).length + 1} className="h-24 text-center">
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
