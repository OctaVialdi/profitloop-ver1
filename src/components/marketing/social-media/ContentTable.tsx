
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
import { CalendarIcon, PlusCircle, Trash2, ExternalLink, Edit, FileText, List, CircleDot } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ContentItem, ContentType, ContentPillar, Service, SubService } from "@/hooks/useContentManagement";

interface ContentTableProps {
  contentItems: ContentItem[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPlanners: any[];
  contentPillars: ContentPillar[];
  isCalendarOpen: { [key: string]: boolean };
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
}

export const ContentTable: React.FC<ContentTableProps> = ({
  contentItems,
  contentTypes,
  services,
  subServices,
  contentPlanners,
  contentPillars,
  isCalendarOpen,
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
  displayBrief
}) => {
  return (
    <div className="relative w-full">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="min-w-max">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center sticky left-0 bg-white z-10 border-r">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[140px] text-center">Tanggal Posting</TableHead>
                <TableHead className="w-[140px] text-center">Tipe Content</TableHead>
                <TableHead className="w-[140px] text-center">PIC</TableHead>
                <TableHead className="w-[140px] text-center">Layanan</TableHead>
                <TableHead className="w-[140px] text-center">Sub Layanan</TableHead>
                <TableHead className="w-[140px] text-center">Judul Content</TableHead>
                <TableHead className="w-[140px] text-center">Content Pillar</TableHead>
                <TableHead className="w-[180px] text-center">Brief</TableHead>
                <TableHead className="w-[140px] text-center">Status</TableHead>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No content items. Click "Add Row" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
