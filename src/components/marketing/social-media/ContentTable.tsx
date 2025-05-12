
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { CalendarIcon, PlusCircle, Trash2, ExternalLink, Edit, FileText, List, CircleDot, RefreshCw, Clock, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";

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
  handleApprovalChange: (itemId: string, isApproved: boolean) => void;
  toggleSelectItem: (itemId: string) => void;
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  openBriefDialog: (itemId: string, brief: string, mode: "edit" | "view") => void;
  getFilteredSubServicesByServiceId: (serviceId: string) => SubService[];
  extractGoogleDocsLink: (text: string) => string | null;
  displayBrief: (brief: string) => string;
  resetRevisionCounter: (itemId: string) => void;
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
  handleApprovalChange,
  toggleSelectItem,
  selectAll,
  handleSelectAll,
  openBriefDialog,
  getFilteredSubServicesByServiceId,
  extractGoogleDocsLink,
  displayBrief,
  resetRevisionCounter
}) => {
  // Function to format date for "Tanggal Selesai" column
  const formatCompletionDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMM yyyy - HH:mm");
    } catch (error) {
      console.error("Error formatting completion date:", error);
      return "-";
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <ScrollArea className="h-[calc(100vh-220px)] w-full">
        <div className="min-w-max">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 bg-white z-20">
              <TableRow>
                <TableHead className="w-[60px] text-center sticky left-0 bg-white z-30 border-r">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[150px] text-center">Tanggal Posting</TableHead>
                <TableHead className="w-[150px] text-center">Tipe Content</TableHead>
                <TableHead className="w-[120px] text-center">PIC</TableHead>
                <TableHead className="w-[150px] text-center">Layanan</TableHead>
                <TableHead className="w-[150px] text-center">Sub Layanan</TableHead>
                <TableHead className="w-[180px] text-center">Judul Content</TableHead>
                <TableHead className="w-[150px] text-center">Content Pillar</TableHead>
                <TableHead className="w-[180px] text-center">Brief</TableHead>
                <TableHead className="w-[140px] text-center">Status</TableHead>
                <TableHead className="w-[100px] text-center">Revision</TableHead>
                <TableHead className="w-[100px] text-center">Approved</TableHead>
                <TableHead className="w-[150px] text-center">Tanggal Selesai</TableHead>
                <TableHead className="w-[150px] text-center">Tanggal Upload</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.length > 0 ? (
                contentItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center sticky left-0 bg-white z-10 border-r">
                      <Checkbox 
                        checked={item.isSelected} 
                        onCheckedChange={() => toggleSelectItem(item.id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    <TableCell className="p-2">
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
                    <TableCell className="p-2">
                      <Select 
                        value={item.contentType} 
                        onValueChange={(value) => handleTypeChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full">
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
                    <TableCell className="p-2">
                      <Select 
                        value={item.pic} 
                        onValueChange={(value) => handlePICChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full">
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
                    <TableCell className="p-2">
                      <Select 
                        value={item.service} 
                        onValueChange={(value) => handleServiceChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full">
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
                    <TableCell className="p-2">
                      <Select 
                        value={item.subService} 
                        onValueChange={(value) => handleSubServiceChange(item.id, value)}
                        disabled={!item.service}
                      >
                        <SelectTrigger className="w-full">
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
                    <TableCell className="p-2">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                        <Input
                          value={item.title || ""}
                          onChange={(e) => handleTitleChange(item.id, e.target.value)}
                          placeholder="Enter title"
                          className="w-full"
                          maxLength={25}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select 
                        value={item.contentPillar} 
                        onValueChange={(value) => handleContentPillarChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full">
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
                    <TableCell className="p-2">
                      {item.brief ? (
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-left truncate w-full"
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
                    <TableCell className="p-2">
                      <Select 
                        value={item.status} 
                        onValueChange={(value) => handleStatusChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full">
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
                    <TableCell className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-center w-full">
                          {item.revisionCount || 0}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => resetRevisionCounter(item.id)}
                          title="Reset revision counter"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="p-2 text-center">
                      <Checkbox
                        checked={item.isApproved}
                        onCheckedChange={(checked) => 
                          handleApprovalChange(item.id, checked === true)
                        }
                        disabled={!isUserManager}
                        aria-label="Approve content"
                        className="mx-auto"
                      />
                    </TableCell>

                    <TableCell className="p-2">
                      <div className="flex items-center">
                        {item.status === "review" && (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{formatCompletionDate(item.completionDate)}</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="p-2">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{item.postDate || "-"}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={14} className="h-24 text-center">
                    No content items. Click "Add Row" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

