
import React from "react";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  RefreshCw, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from "@/hooks/content-plan";
import { truncateText } from "./utils/tableUtils";

interface ContentPlanTableRowProps {
  item: ContentPlanItem;
  contentTypes: ContentType[];
  services: Service[];
  contentPillars: ContentPillar[];
  contentPlanners: TeamMember[];
  creativeTeamMembers: TeamMember[];
  selectedItems: string[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  handleSelectItem: (id: string, checked: boolean) => void;
  handleDateChange: (id: string, date: Date | undefined) => void;
  handleFieldChange: (id: string, field: string, value: any) => void;
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  extractLink: (text: string | null) => string | null;
  openBriefDialog: (id: string, brief: string | null) => void;
  openTitleDialog: (id: string, title: string | null) => void;
}

export default function ContentPlanTableRow({
  item,
  contentTypes,
  services,
  contentPillars,
  contentPlanners,
  creativeTeamMembers,
  selectedItems,
  getFilteredSubServices,
  handleSelectItem,
  handleDateChange,
  handleFieldChange,
  resetRevisionCounter,
  formatDisplayDate,
  extractLink,
  openBriefDialog,
  openTitleDialog
}: ContentPlanTableRowProps) {
  // Helper function to safely get the name of a content type
  const getContentTypeName = () => {
    if (!item.content_type) return "-";
    if (typeof item.content_type === "string") return item.content_type;
    return item.content_type.name || "-";
  };

  return (
    <TableRow key={item.id}>
      {/* 1. Action (Checkbox) */}
      <TableCell className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px] border-r">
        <div className="flex justify-center">
          <Checkbox 
            checked={selectedItems.includes(item.id)} 
            onCheckedChange={checked => handleSelectItem(item.id, !!checked)} 
          />
        </div>
      </TableCell>

      {/* 2. Tanggal Posting */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full h-8">
              {item.post_date ? formatDisplayDate(item.post_date) : "Select date"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar 
              mode="single" 
              selected={item.post_date ? new Date(item.post_date) : undefined} 
              onSelect={date => handleDateChange(item.id, date)} 
              initialFocus 
            />
          </PopoverContent>
        </Popover>
      </TableCell>

      {/* 3. Tipe Content */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.content_type_id || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'content_type_id', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            {contentTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* 4. PIC - Content Planners */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.pic_id || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'pic_id', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            {contentPlanners.map(member => (
              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* 5. Layanan */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.service_id || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'service_id', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            {services.map(service => (
              <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* 6. Sub Layanan */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.sub_service_id || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'sub_service_id', value === "none" ? "" : value)} 
          disabled={!item.service_id}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            {item.service_id && getFilteredSubServices(item.service_id).map(subService => (
              <SelectItem key={subService.id} value={subService.id}>{subService.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* 7. Judul Content */}
      <TableCell className="p-1 w-[220px] border-r">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => openTitleDialog(item.id, item.title)} 
          className="w-full h-8 flex items-center justify-start px-3 hover:bg-gray-50 truncate text-left" 
          title={item.title || ""}
        >
          {item.title ? truncateText(item.title) : "Click to add title"}
        </Button>
      </TableCell>

      {/* 8. Content Pillar */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.content_pillar_id || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'content_pillar_id', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            {contentPillars.map(pillar => (
              <SelectItem key={pillar.id} value={pillar.id}>{pillar.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* 9. Brief */}
      <TableCell className="p-1 w-[220px] border-r">
        <Button 
          variant="ghost" 
          className="w-full h-8 flex items-center justify-between px-3 hover:bg-gray-50 text-left" 
          onClick={() => openBriefDialog(item.id, item.brief)}
        >
          <span className="truncate flex-grow text-left">
            {item.brief ? truncateText(item.brief) : "Add brief"}
          </span>
          {extractLink(item.brief) && <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />}
        </Button>
      </TableCell>

      {/* 10. Status */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.status || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'status', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
            <SelectItem value="Request Revisi">Request Revisi</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* 11. Revision */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="flex items-center justify-center gap-1">
          <span>{item.revision_count || 0}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => resetRevisionCounter(item.id, 'revision_count')}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>

      {/* 12. Approved */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="flex justify-center">
          <Checkbox 
            checked={item.approved} 
            onCheckedChange={checked => handleFieldChange(item.id, 'approved', !!checked)} 
          />
        </div>
      </TableCell>

      {/* 13. Tanggal Selesai */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        {item.status === "Butuh Di Review" && item.completion_date && (
          <div className="text-center">
            {formatDisplayDate(item.completion_date, true)}
          </div>
        )}
      </TableCell>

      {/* 14. Tanggal Upload */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        {formatDisplayDate(item.post_date)}
      </TableCell>

      {/* 15. Tipe Content (Mirror) */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="truncate" title={getContentTypeName()}>
          {getContentTypeName()}
        </div>
      </TableCell>

      {/* 16. Judul Content (Mirror) */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <div className="truncate max-w-full" title={item.title || ""}>
          {truncateText(item.title)}
        </div>
      </TableCell>

      {/* 17. PIC Produksi */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.pic_production_id || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'pic_production_id', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            {creativeTeamMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* 18. Link Google Drive */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <div className="flex items-center gap-1">
          <Input 
            value={item.google_drive_link || ""} 
            onChange={e => handleFieldChange(item.id, 'google_drive_link', e.target.value)} 
            placeholder="Enter link" 
            className="w-full h-8 text-xs" 
          />
          {item.google_drive_link && (
            <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" asChild>
              <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </TableCell>

      {/* 19. Status Produksi */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        <Select 
          value={item.production_status || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'production_status', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            <SelectItem value="Butuh Di Review">Butuh Di Review</SelectItem>
            <SelectItem value="Request Revisi">Request Revisi</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* 20. Revisi Counter (Production) */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="flex items-center justify-center gap-1">
          <span>{item.production_revision_count || 0}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => resetRevisionCounter(item.id, 'production_revision_count')}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>

      {/* 21. Tanggal Selesai Produksi */}
      <TableCell className="whitespace-nowrap p-1 w-[220px] border-r">
        {item.production_status === "Butuh Di Review" && item.production_completion_date && (
          <div className="text-center">
            {formatDisplayDate(item.production_completion_date, true)}
          </div>
        )}
      </TableCell>

      {/* 22. Approved (Production) */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="flex justify-center">
          <Checkbox 
            checked={item.production_approved} 
            onCheckedChange={checked => handleFieldChange(item.id, 'production_approved', !!checked)} 
          />
        </div>
      </TableCell>

      {/* 23. Tanggal Approved */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        {item.production_approved && item.production_approved_date ? formatDisplayDate(item.production_approved_date, true) : ""}
      </TableCell>

      {/* 24. Download Link File */}
      <TableCell className="p-1 w-[220px] border-r">
        {item.production_approved && item.google_drive_link && (
          <Button variant="outline" size="sm" className="w-full h-8" asChild>
            <a href={item.google_drive_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" /> Download
            </a>
          </Button>
        )}
      </TableCell>

      {/* 25. Link Post */}
      <TableCell className="p-1 w-[220px] border-r">
        <div className="flex items-center gap-1">
          <Input 
            value={item.post_link || ""} 
            onChange={e => handleFieldChange(item.id, 'post_link', e.target.value)} 
            placeholder="Enter post link" 
            className="w-full h-8 text-xs" 
          />
          {item.post_link && (
            <Button size="sm" variant="ghost" className="h-8 px-2 flex-shrink-0" asChild>
              <a href={item.post_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </TableCell>

      {/* 26. Done */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="flex justify-center">
          <Checkbox 
            checked={item.done} 
            onCheckedChange={checked => handleFieldChange(item.id, 'done', !!checked)} 
          />
        </div>
      </TableCell>

      {/* 27. Actual Post */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        {item.actual_post_date ? format(new Date(item.actual_post_date), "dd MMM yyyy") : ""}
      </TableCell>

      {/* 28. On Time Status */}
      <TableCell className="text-center whitespace-nowrap p-1 w-[220px] border-r">
        <div className="truncate" title={item.on_time_status || ""}>
          {item.on_time_status || ""}
        </div>
      </TableCell>

      {/* 29. Status Content */}
      <TableCell className="whitespace-nowrap p-1 w-[220px]">
        <Select 
          value={item.status_content || "none"} 
          onValueChange={value => handleFieldChange(item.id, 'status_content', value === "none" ? "" : value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="-" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-</SelectItem>
            <SelectItem value="Recomended For Ads">Recomended For Ads</SelectItem>
            <SelectItem value="Cancel">Cancel</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}
