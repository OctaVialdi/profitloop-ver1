
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
import { CalendarIcon, ExternalLink, Edit, FileText, List, CircleDot, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";
import { format } from "date-fns";
import { ContentTableProps } from "./types";

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
  activeTab = "primary",
}) => {
  // Format completion date for display
  const formatCompletionDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy - HH:mm');
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
    <div className="w-full h-full">
      <div className="relative w-full">
        <ScrollArea className="h-[calc(100vh-220px)] w-full">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-20">
                <TableRow className="bg-slate-50">
                  {isColumnVisible("selectColumn") && (
                    <TableHead className="w-[5%] text-center sticky left-0 bg-slate-50 z-30 border-r">
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        className="mt-1"
                      />
                    </TableHead>
                  )}
                  {isColumnVisible("postDate") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Tanggal Posting</TableHead>
                  )}
                  {isColumnVisible("contentType") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Tipe Content</TableHead>
                  )}
                  {isColumnVisible("pic") && (
                    <TableHead className="w-[7%] text-center font-medium whitespace-nowrap">PIC</TableHead>
                  )}
                  {isColumnVisible("service") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Layanan</TableHead>
                  )}
                  {isColumnVisible("subService") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Sub Layanan</TableHead>
                  )}
                  {isColumnVisible("title") && (
                    <TableHead className="w-[10%] text-center font-medium whitespace-nowrap">Judul Content</TableHead>
                  )}
                  {isColumnVisible("contentPillar") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Content Pillar</TableHead>
                  )}
                  {isColumnVisible("brief") && (
                    <TableHead className="w-[10%] text-center font-medium whitespace-nowrap">Brief</TableHead>
                  )}
                  {isColumnVisible("status") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Status</TableHead>
                  )}
                  {isColumnVisible("revision") && (
                    <TableHead className="w-[6%] text-center font-medium whitespace-nowrap">Revision</TableHead>
                  )}
                  {isColumnVisible("approved") && (
                    <TableHead className="w-[6%] text-center font-medium whitespace-nowrap">Approved</TableHead>
                  )}
                  {isColumnVisible("completionDate") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Tanggal Selesai</TableHead>
                  )}
                  {isColumnVisible("mirrorPostDate") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Tanggal Upload</TableHead>
                  )}
                  {isColumnVisible("mirrorContentType") && (
                    <TableHead className="w-[8%] text-center font-medium whitespace-nowrap">Tipe Content</TableHead>
                  )}
                  {isColumnVisible("mirrorTitle") && (
                    <TableHead className="w-[10%] text-center font-medium whitespace-nowrap">Judul Content</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.length > 0 ? (
                  contentItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60">
                      {isColumnVisible("selectColumn") && (
                        <TableCell className="text-center sticky left-0 bg-white z-10 border-r">
                          <Checkbox 
                            checked={item.isSelected} 
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}
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
                        </TableCell>
                      )}
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
                        <TableCell className="p-2 whitespace-nowrap">
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
                        </TableCell>
                      )}
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
                      {isColumnVisible("approved") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          <Checkbox 
                            checked={item.isApproved} 
                            onCheckedChange={(checked) => toggleApproved(item.id, checked as boolean)}
                            aria-label="Approve content"
                          />
                        </TableCell>
                      )}
                      {isColumnVisible("completionDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.status === "review" && item.completionDate && (
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md">
                              {formatCompletionDate(item.completionDate)}
                            </div>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible("mirrorPostDate") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {item.postDate || "-"}
                        </TableCell>
                      )}
                      {isColumnVisible("mirrorContentType") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
                          {contentTypes.find(type => type.id === item.contentType)?.name || "-"}
                        </TableCell>
                      )}
                      {isColumnVisible("mirrorTitle") && (
                        <TableCell className="p-2 text-center whitespace-nowrap">
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
